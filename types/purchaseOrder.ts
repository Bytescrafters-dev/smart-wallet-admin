export interface PurchaseOrderListItem {
  id: string;
  storeId: string;
  status: string;
  supplier: any;
  createdBy: any;
  orderNumber: string;
  expectedDeliveryDate: string;
  _count: any;
}

export interface PurchaseOrderLine {
  id: string;
  orderId: string;
  variantId: string;
  orderedQty: number;
  receivedQty: number | null;
  costPerUnit: number | null;
  variant: {
    sku: string;
    title: string;
    product: {
      title: string;
    };
  };
}

export interface PurchaseOrder extends Omit<PurchaseOrderListItem, "_count"> {
  receivedBy: any;
  rejectedBy: any;
  invoiceRef: string;
  note: string;
  currency: string;
  lines: PurchaseOrderLine[];
}

export const PurchaseOrderStatus = {
  UNRESOLVED: "UNRESOLVED",
  CREATED: "CREATED",
  PARTIALLY_RECEIVED: "PARTIALLY_RECEIVED",
  RECEIVED: "RECEIVED",
  REJECTED: "REJECTED",
};
