import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";

export interface ProductOptionValue {
  id?: string;
  value: string;
  position: number;
}

export interface ProductOption {
  id?: string;
  name: string;
  position: number;
  values: ProductOptionValue[];
}

interface CreateProductOptionInput {
  name: string;
  position: number;
  values: string[];
}

export const useGetProductOptions = (productId: string) => {
  return useQuery({
    queryKey: ["productOptions", productId],
    queryFn: async (): Promise<ProductOption[]> => {
      if (!productId) {
        throw new Error("Product ID is required");
      }

      const response = await fetch(
        `/api/proxy/products/product-options/${productId}/options`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch product options");
      }

      return response.json();
    },
    enabled: !!productId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCreateProductOption = (productId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateProductOptionInput) => {
      if (!productId) {
        throw new Error("Product ID is required");
      }

      const response = await fetch(
        `/api/proxy/products/product-options/${productId}/options`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || "Failed to create product option");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["productOptions", productId],
      });
    },
  });
};

export const useDeleteProductOption = (productId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (optionId: string) => {
      if (!productId || !optionId) {
        throw new Error("Product ID and Option ID are required");
      }

      const response = await fetch(
        `/api/proxy/products/product-options/${productId}/options/${optionId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || "Failed to delete product option");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["productOptions", productId],
      });
    },
  });
};
