import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useCurrentStore } from "@/contexts/storeProvider";
import { StockReceiptListItem, StockReceipt } from "@/types/stockReceipt";

interface StockReceiptsResponse {
  data: StockReceiptListItem[];
  total: number;
  page: number;
  limit: number;
}

interface UseStockReceiptsParams {
  page?: number;
  limit?: number;
}

export interface CreateStockReceiptInput {
  invoiceRef?: string;
  note?: string;
  currency: string;
  lines: {
    variantId: string;
    qty: number;
    costPerUnit: number | undefined;
  }[];
}

export const useStockReceipts = ({
  page = 1,
  limit = 10,
}: UseStockReceiptsParams = {}) => {
  const currentStore = useCurrentStore();

  return useQuery({
    queryKey: ["stock-receipts", currentStore?.id, page, limit],
    queryFn: async (): Promise<StockReceiptsResponse> => {
      if (!currentStore?.id) {
        throw new Error("No store selected");
      }

      const response = await fetch(
        `/api/proxy/stock-receipts/store/${currentStore.id}?page=${page}&limit=${limit}`,
      );

      if (!response.ok) {
        throw new Error("Failed to fetch stock receipts");
      }

      return response.json();
    },
    enabled: !!currentStore?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useStockReceipt = (id: string) => {
  return useQuery({
    queryKey: ["stock-receipt", id],
    queryFn: async (): Promise<StockReceipt> => {
      const response = await fetch(`/api/proxy/stock-receipts/${id}`);

      if (!response.ok) {
        throw new Error("Failed to fetch stock receipt");
      }

      return response.json();
    },
    enabled: !!id,
  });
};

export const useCreateStockReceipt = () => {
  const queryClient = useQueryClient();
  const currentStore = useCurrentStore();

  return useMutation({
    mutationFn: async (
      data: CreateStockReceiptInput,
    ): Promise<StockReceipt> => {
      if (!currentStore?.id) {
        throw new Error("No store selected");
      }

      const response = await fetch("/api/proxy/stock-receipts", {
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
        queryKey: ["stock-receipts", currentStore?.id],
      });
    },
  });
};
