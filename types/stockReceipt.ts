export interface StockReceiptListItem {
  id: string;
  storeId: string;
  receiptNumber: string;
  createdBy: {
    firstName: string;
    lastName: string;
  };
  invoiceRef: string;
  createdAt: string;
  note: string;
  _count: {
    lines: number;
  };
}

export interface StockReceiptLine {
  id: string;
  receiptId: string;
  variantId: string;
  qty: number;
  costPerUnit: number | null;
  variant: {
    id: string;
    sku: string;
    title: string;
    product: {
      title: string;
    };
  };
}

export interface StockReceipt extends Omit<StockReceiptListItem, "_count"> {
  invoiceRef: string;
  note: string;
  currency: string;
  lines: StockReceiptLine[];
}
