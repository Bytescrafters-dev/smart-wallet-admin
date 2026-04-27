import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useCurrentStore } from "@/contexts/storeProvider";
import { PurchaseOrder } from "@/types/purchaseOrder";

interface PurchaseOrdersResponse {
  data: PurchaseOrder[];
  total: number;
  page: number;
  limit: number;
}

interface UsePurchaseOrdersParams {
  page?: number;
  limit?: number;
}

// interface CreateSupplierInput {
//   name: string;
//   contactName?: string;
//   contactEmail?: string;
//   contactPhone?: string;
//   address1?: string;
//   city?: string;
//   country?: string;
//   notes?: string;
// }

// interface UpdateSupplierInput {
//   name: string;
//   contactName?: string;
//   contactEmail?: string;
//   contactPhone?: string;
//   address1?: string;
//   city?: string;
//   country?: string;
//   notes?: string;
// }

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
