import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCurrentStore } from "@/contexts/storeProvider";
import {
  CreateOrderInput,
  Order,
  OrderStatus,
  PaymentStatus,
  UpdateOrderInput,
} from "@/types/order";

interface OrdersParams {
  page: number;
  limit: number;
  q?: string;
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
}

interface OrdersResponse {
  data: Order[];
  total: number;
  page: number;
  limit: number;
}

export const useOrders = ({
  page = 1,
  limit = 10,
  q,
  status,
  paymentStatus,
}: OrdersParams) => {
  const currentStore = useCurrentStore();

  return useQuery({
    queryKey: [
      "orders",
      currentStore?.id,
      page,
      limit,
      status,
      paymentStatus,
      q,
    ],
    queryFn: async (): Promise<OrdersResponse> => {
      if (!currentStore?.id) {
        throw new Error("No store selected");
      }

      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (status) params.append("status", status);
      if (paymentStatus) params.append("paymentStatus", paymentStatus);
      if (q) params.append("q", q);

      const response = await fetch(
        `/api/proxy/admin/stores/${currentStore.id}/orders?${params.toString()}`,
      );

      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }

      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useOrder = (orderId: string) => {
  return useQuery({
    queryKey: ["order", orderId],
    queryFn: async (): Promise<Order> => {
      const response = await fetch(`/api/proxy/admin/orders/${orderId}`);

      if (!response.ok) {
        throw new Error("Failed to fetch order");
      }

      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  const currentStore = useCurrentStore();

  return useMutation({
    mutationFn: async (data: CreateOrderInput) => {
      if (!currentStore?.id) throw new Error("No store selected");

      const response = await fetch(
        `/api/proxy/admin/stores/${currentStore.id}/orders`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...data, storeId: currentStore.id }),
        },
      );

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || "Failed to create order");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders", currentStore?.id] });
    },
  });
};

export const useUpdateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: UpdateOrderInput;
    }) => {
      const response = await fetch(`/api/proxy/admin/orders/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => {});
        throw new Error(error.message || "Failed to update order");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["order"],
      });
      queryClient.invalidateQueries({
        queryKey: ["orders"],
      });
      queryClient.invalidateQueries({
        queryKey: ["productVariants"],
      });
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });
    },
  });
};
