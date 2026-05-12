import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { fetchManagerSalesInvoices } from './client';
import { ManagerInvoiceLine, ManagerSalesInvoice, ManagerSyncSummary, ProductRecipeComponent } from './types';

type ProductRow = {
  id: string;
  name: string;
  sku: string | null;
  product_components: ProductRecipeComponent[];
};

function normaliseSku(value?: string | null) {
  return value?.trim().toLowerCase() || null;
}

function getBestLineSku(line: ManagerInvoiceLine) {
  return normaliseSku(line.itemCode) || normaliseSku(line.itemName);
}

async function createSyncRun() {
  const { data, error } = await supabaseAdmin
    .from('manager_sync_runs')
    .insert([{ status: 'running' }])
    .select('id')
    .single();

  if (error) throw error;
  return data.id as string;
}

async function finishSyncRun(syncRunId: string, summary: Omit<ManagerSyncSummary, 'syncRunId' | 'unmatchedLines'>) {
  const { error } = await supabaseAdmin
    .from('manager_sync_runs')
    .update({
      status: 'completed',
      finished_at: new Date().toISOString(),
      invoices_seen: summary.invoicesSeen,
      invoices_imported: summary.invoicesImported,
      invoices_skipped: summary.invoicesSkipped,
      stock_movements_created: summary.stockMovementsCreated,
    })
    .eq('id', syncRunId);

  if (error) throw error;
}

async function failSyncRun(syncRunId: string, errorMessage: string) {
  await supabaseAdmin
    .from('manager_sync_runs')
    .update({
      status: 'failed',
      finished_at: new Date().toISOString(),
      error_message: errorMessage,
    })
    .eq('id', syncRunId);
}

async function getProductsBySku() {
  const { data, error } = await supabaseAdmin
    .from('products')
    .select('id, name, sku, product_components(component_id, quantity_required, wastage_percentage)')
    .not('sku', 'is', null);

  if (error) throw error;

  const productsBySku = new Map<string, ProductRow>();

  ((data || []) as ProductRow[]).forEach((product) => {
    const sku = normaliseSku(product.sku);
    if (sku) productsBySku.set(sku, product);
  });

  return productsBySku;
}

async function importInvoice(invoice: ManagerSalesInvoice, syncRunId: string) {
  const { data, error } = await supabaseAdmin
    .from('manager_invoice_imports')
    .insert([{
      manager_invoice_id: invoice.id,
      invoice_number: invoice.invoiceNumber,
      invoice_date: invoice.invoiceDate,
      customer_name: invoice.customerName,
      status: invoice.status,
      raw_invoice: invoice.raw,
      sync_run_id: syncRunId,
    }])
    .select('id')
    .single();

  if (error) {
    if (error.code === '23505') return null;
    throw error;
  }

  return data.id as string;
}

async function applyStockMovement(params: {
  componentId: number;
  productId: string;
  invoiceImportId: string;
  sourceReference: string | null;
  quantityDelta: number;
  notes: string;
}) {
  const { error } = await supabaseAdmin.rpc('apply_component_stock_movement', {
    target_component_id: params.componentId,
    target_product_id: params.productId,
    target_invoice_import_id: params.invoiceImportId,
    target_source_reference: params.sourceReference,
    target_quantity_delta: params.quantityDelta,
    target_notes: params.notes,
  });

  if (error) throw error;
}

export async function syncManagerInvoicesToComponentStock(options: { from?: string; to?: string } = {}): Promise<ManagerSyncSummary> {
  const syncRunId = await createSyncRun();
  const unmatchedLines: ManagerSyncSummary['unmatchedLines'] = [];

  let invoicesSeen = 0;
  let invoicesImported = 0;
  let invoicesSkipped = 0;
  let stockMovementsCreated = 0;

  try {
    const [invoices, productsBySku] = await Promise.all([
      fetchManagerSalesInvoices(options),
      getProductsBySku(),
    ]);

    invoicesSeen = invoices.length;

    for (const invoice of invoices) {
      const invoiceImportId = await importInvoice(invoice, syncRunId);

      if (!invoiceImportId) {
        invoicesSkipped += 1;
        continue;
      }

      invoicesImported += 1;

      for (const line of invoice.lines) {
        const lineSku = getBestLineSku(line);
        const product = lineSku ? productsBySku.get(lineSku) : undefined;

        if (!product) {
          unmatchedLines.push({
            invoiceId: invoice.id,
            invoiceNumber: invoice.invoiceNumber,
            itemCode: line.itemCode,
            itemName: line.itemName,
            description: line.description,
            quantity: line.quantity,
          });
          continue;
        }

        if (!product.product_components || product.product_components.length === 0) {
          unmatchedLines.push({
            invoiceId: invoice.id,
            invoiceNumber: invoice.invoiceNumber,
            itemCode: line.itemCode,
            itemName: line.itemName,
            description: `Product matched (${product.name}) but has no component recipe.`,
            quantity: line.quantity,
          });
          continue;
        }

        for (const component of product.product_components) {
          const wastageMultiplier = 1 + Number(component.wastage_percentage || 0) / 100;
          const consumedQuantity = line.quantity * Number(component.quantity_required || 0) * wastageMultiplier;

          if (!Number.isFinite(consumedQuantity) || consumedQuantity <= 0) continue;

          await applyStockMovement({
            componentId: component.component_id,
            productId: product.id,
            invoiceImportId,
            sourceReference: invoice.invoiceNumber || invoice.id,
            quantityDelta: -consumedQuantity,
            notes: `Manager.io sales invoice ${invoice.invoiceNumber || invoice.id}: ${line.quantity} x ${product.name}`,
          });

          stockMovementsCreated += 1;
        }
      }
    }

    const summary = {
      syncRunId,
      invoicesSeen,
      invoicesImported,
      invoicesSkipped,
      stockMovementsCreated,
      unmatchedLines,
    };

    await finishSyncRun(syncRunId, summary);
    return summary;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown Manager.io sync error';
    await failSyncRun(syncRunId, message);
    throw error;
  }
}
