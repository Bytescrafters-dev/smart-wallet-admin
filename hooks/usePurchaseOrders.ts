import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useCurrentStore } from "@/contexts/storeProvider";
import { PurchaseOrderListItem, PurchaseOrder } from "@/types/purchaseOrder";

interface PurchaseOrdersResponse {
  data: PurchaseOrderListItem[];
  total: number;
  page: number;
  limit: number;
}

interface UsePurchaseOrdersParams {
  page?: number;
  limit?: number;
}

export interface CreatePurchaseOrderInput {
  supplierId?: string;
  invoiceRef?: string;
  note?: string;
  expectedDeliveryDate?: string;
  currency: string;
  lines: {
    variantId: string;
    orderedQty: number;
    costPerUnit: number | undefined;
  }[];
}

export interface UpdatePurchaseOrderInput {
  supplierId?: string;
  invoiceRef?: string;
  note?: string;
  expectedDeliveryDate?: string;
  currency: string;
  updateLines?: {
    lineId: string;
    orderedQty: number;
    costPerUnit: number | undefined;
  }[];
  addLines?: {
    variantId: string;
    orderedQty: number;
    costPerUnit: number | undefined;
  }[];
  removeLineIds?: string[];
}
export interface ReceivePurchaseOrderInput {
  invoiceRef?: string;
  note?: string;
  currency: string;
  lines: {
    lineId: string;
    receivedQty: number;
    costPerUnit: number;
  };
}

export const usePurchaseOrders = ({
  page = 1,
  limit = 10,
}: UsePurchaseOrdersParams = {}) => {
  const currentStore = useCurrentStore();

  return useQuery({
    queryKey: ["purchase-orders", currentStore?.id, page, limit],
    queryFn: async (): Promise<PurchaseOrdersResponse> => {
      if (!currentStore?.id) {
        throw new Error("No store selected");
      }

      const response = await fetch(
        `/api/proxy/stock-orders/store/${currentStore.id}?page=${page}&limit=${limit}`,
      );

      if (!response.ok) {
        throw new Error("Failed to fetch purchase orders");
      }

      return response.json();
    },
    enabled: !!currentStore?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const usePurchaseOrder = (id: string) => {
  return useQuery({
    queryKey: ["purchase-order", id],
    queryFn: async (): Promise<PurchaseOrder> => {
      const response = await fetch(`/api/proxy/stock-orders/${id}`);

      if (!response.ok) {
        throw new Error("Failed to fetch purchase order");
      }

      return response.json();
    },
    enabled: !!id,
  });
};

export const useCreatePurchaseOrder = () => {
  const queryClient = useQueryClient();
  const currentStore = useCurrentStore();

  return useMutation({
    mutationFn: async (
      data: CreatePurchaseOrderInput,
    ): Promise<PurchaseOrder> => {
      if (!currentStore?.id) {
        throw new Error("No store selected");
      }

      const response = await fetch("/api/proxy/stock-orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          storeId: currentStore.id,
        }),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || "Failed to create purchase order");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["purchase-orders", currentStore?.id],
      });
    },
  });
};

export const useUpdatePurchaseOrder = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      data: UpdatePurchaseOrderInput,
    ): Promise<PurchaseOrder> => {
      const response = await fetch(`/api/proxy/stock-orders/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
        }),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || "Failed to create purchase order");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["purchase-order", id],
      });
    },
  });
};

export const useReceivePurchaseOrder = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      data: ReceivePurchaseOrderInput,
    ): Promise<{ id: string; status: string }> => {
      const response = await fetch(`/api/proxy/stock-orders/${id}/receive`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || "Failed to create purchase order");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["purchase-order", id],
      });
    },
  });
};
