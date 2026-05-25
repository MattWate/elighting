import { ManagerSalesInvoice } from './types';

const managerBaseUrl = process.env.MANAGER_API_BASE_URL;
const managerApiToken = process.env.MANAGER_API_TOKEN;
const managerApiSecret = process.env.MANAGER_API_SECRET;
const managerSalesInvoicesPath = process.env.MANAGER_SALES_INVOICES_PATH || '/api2/sales-invoices';

// Default is deliberately conservative. Once the exact Manager.io API auth format is confirmed,
// set MANAGER_AUTH_MODE to one of: bearer, basic, token-secret-headers, query-token-secret.
const managerAuthMode = process.env.MANAGER_AUTH_MODE || 'token-secret-headers';

type ManagerRequestOptions = {
  from?: string;
  to?: string;
};

function ensureManagerConfig() {
  if (!managerBaseUrl && !managerSalesInvoicesPath.startsWith('http')) {
    throw new Error('Missing MANAGER_API_BASE_URL environment variable.');
  }

  if (!managerApiToken) {
    throw new Error('Missing MANAGER_API_TOKEN environment variable.');
  }

  if (!managerApiSecret) {
    throw new Error('Missing MANAGER_API_SECRET environment variable.');
  }
}

function buildManagerUrl(pathOrUrl: string) {
  if (pathOrUrl.startsWith('http://') || pathOrUrl.startsWith('https://')) {
    return new URL(pathOrUrl);
  }

  if (!managerBaseUrl) {
    throw new Error('Missing MANAGER_API_BASE_URL environment variable.');
  }

  return new URL(pathOrUrl, managerBaseUrl);
}

function getManagerAuthHeaders(): Record<string, string> {
  ensureManagerConfig();

  if (managerAuthMode === 'bearer') {
    return {
      Authorization: `Bearer ${managerApiToken}`,
    };
  }

  if (managerAuthMode === 'basic') {
    const credentials = Buffer.from(`${managerApiToken}:${managerApiSecret}`).toString('base64');
    return {
      Authorization: `Basic ${credentials}`,
    };
  }

  if (managerAuthMode === 'token-secret-headers') {
    return {
      'X-Manager-Token': managerApiToken!,
      'X-Manager-Secret': managerApiSecret!,
    };
  }

  if (managerAuthMode === 'query-token-secret') {
    return {};
  }

  throw new Error(`Unsupported MANAGER_AUTH_MODE: ${managerAuthMode}`);
}

function addManagerQueryAuth(url: URL) {
  if (managerAuthMode !== 'query-token-secret') return;

  ensureManagerConfig();
  url.searchParams.set('token', managerApiToken!);
  url.searchParams.set('secret', managerApiSecret!);
}

function numberFromUnknown(value: unknown, fallback = 0) {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }
  return fallback;
}

function textFromUnknown(value: unknown): string | null {
  return typeof value === 'string' && value.trim() ? value.trim() : null;
}

function normaliseInvoice(rawInvoice: any): ManagerSalesInvoice {
  const rawLines = rawInvoice.lines || rawInvoice.Lines || rawInvoice.items || rawInvoice.Items || [];

  return {
    id: String(rawInvoice.id || rawInvoice.ID || rawInvoice.key || rawInvoice.Key || rawInvoice.reference || rawInvoice.Reference),
    invoiceNumber: textFromUnknown(rawInvoice.invoiceNumber || rawInvoice.InvoiceNumber || rawInvoice.number || rawInvoice.Number || rawInvoice.reference || rawInvoice.Reference),
    invoiceDate: textFromUnknown(rawInvoice.invoiceDate || rawInvoice.InvoiceDate || rawInvoice.date || rawInvoice.Date),
    customerName: textFromUnknown(rawInvoice.customerName || rawInvoice.CustomerName || rawInvoice.customer || rawInvoice.Customer),
    status: textFromUnknown(rawInvoice.status || rawInvoice.Status),
    lines: Array.isArray(rawLines)
      ? rawLines.map((line: any) => ({
          itemCode: textFromUnknown(line.itemCode || line.ItemCode || line.code || line.Code || line.sku || line.SKU),
          itemName: textFromUnknown(line.itemName || line.ItemName || line.name || line.Name || line.item || line.Item),
          description: textFromUnknown(line.description || line.Description),
          quantity: numberFromUnknown(line.quantity || line.Quantity || line.qty || line.Qty, 0),
          raw: line,
        }))
      : [],
    raw: rawInvoice,
  };
}

export async function fetchManagerSalesInvoices(options: ManagerRequestOptions = {}): Promise<ManagerSalesInvoice[]> {
  ensureManagerConfig();

  const url = buildManagerUrl(managerSalesInvoicesPath);

  if (options.from) url.searchParams.set('from', options.from);
  if (options.to) url.searchParams.set('to', options.to);
  addManagerQueryAuth(url);

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      ...getManagerAuthHeaders(),
      Accept: 'application/json',
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Manager.io invoice request failed (${response.status}): ${body}`);
  }

  const payload = await response.json();
  const invoices = Array.isArray(payload) ? payload : payload.invoices || payload.salesInvoices || payload.data || [];

  if (!Array.isArray(invoices)) {
    throw new Error('Manager.io invoice response was not an array. Update src/lib/manager/client.ts to match the API shape.');
  }

  return invoices.map(normaliseInvoice).filter((invoice) => invoice.id && invoice.id !== 'undefined');
}
