export type ManagerInvoiceLine = {
  itemCode?: string | null;
  itemName?: string | null;
  description?: string | null;
  quantity: number;
  raw: unknown;
};

export type ManagerSalesInvoice = {
  id: string;
  invoiceNumber?: string | null;
  invoiceDate?: string | null;
  customerName?: string | null;
  status?: string | null;
  lines: ManagerInvoiceLine[];
  raw: unknown;
};

export type ProductRecipeComponent = {
  component_id: number;
  quantity_required: number;
  wastage_percentage: number;
};

export type MatchedInvoiceLine = {
  invoiceId: string;
  invoiceNumber?: string | null;
  productId: string;
  productName: string;
  productSku: string | null;
  quantitySold: number;
  components: ProductRecipeComponent[];
};

export type ManagerSyncSummary = {
  syncRunId: string;
  invoicesSeen: number;
  invoicesImported: number;
  invoicesSkipped: number;
  stockMovementsCreated: number;
  unmatchedLines: Array<{
    invoiceId: string;
    invoiceNumber?: string | null;
    itemCode?: string | null;
    itemName?: string | null;
    description?: string | null;
    quantity: number;
  }>;
};
