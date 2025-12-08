import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export interface VariantPrice {
  currency: string;
  amount: number; // in cents
  validFrom?: Date;
  validTo?: Date;
}

export interface VariantInventory {
  quantity: number;
  reserved: number;
  lowStockThreshold: number;
}

export interface ProductVariant {
  id?: string;
  sku: string;
  barcode?: string;
  title?: string;
  weightGrams?: number;
  lengthCm?: number;
  widthCm?: number;
  heightCm?: number;
  active: boolean;
  optionValueIds: string[];
  optionValueNames?: string[]; // For display purposes
  prices: VariantPrice[];
  inventory: VariantInventory;
  createdAt?: Date;
  updatedAt?: Date;
}

interface CreateVariantsInput {
  variants: Omit<ProductVariant, "id" | "createdAt" | "updatedAt">[];
}

interface UpdateVariantInput {
  variantId: string;
  data: Partial<ProductVariant>;
}

export const useGetProductVariants = (productId: string) => {
  return useQuery({
    queryKey: ["productVariants", productId],
    queryFn: async (): Promise<ProductVariant[]> => {
      if (!productId) {
        throw new Error("Product ID is required");
      }

      const response = await fetch(
        `/api/proxy/products/product-variants/${productId}/variants`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch product variants");
      }

      return response.json();
    },
    enabled: !!productId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCreateProductVariants = (productId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateVariantsInput) => {
      if (!productId) {
        throw new Error("Product ID is required");
      }

      const response = await fetch(
        `/api/proxy/products/product-variants/${productId}/variants/bulk`,
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
        throw new Error(error.message || "Failed to create product variants");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["productVariants", productId],
      });
      toast.success("Variants created successfully");
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to create variants"
      );
    },
  });
};

export const useUpdateProductVariant = (productId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ variantId, data }: UpdateVariantInput) => {
      if (!productId || !variantId) {
        throw new Error("Product ID and Variant ID are required");
      }

      const response = await fetch(
        `/api/proxy/products/product-variants/${productId}/variants/${variantId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || "Failed to update product variant");
      }

      return response.json();
    },
    onMutate: async ({ variantId, data }) => {
      await queryClient.cancelQueries({
        queryKey: ["productVariants", productId],
      });
      const previousVariants = queryClient.getQueryData([
        "productVariants",
        productId,
      ]);

      queryClient.setQueryData(
        ["productVariants", productId],
        (old: ProductVariant[] | undefined) =>
          old?.map((v) => (v.id === variantId ? { ...v, ...data } : v)) || []
      );

      return { previousVariants };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(
        ["productVariants", productId],
        context?.previousVariants
      );
      toast.error(
        err instanceof Error ? err.message : "Failed to update variant"
      );
    },
    onSuccess: () => {
      toast.success("Variant updated successfully");
    },
  });
};

export const useBulkUpdateVariants = (productId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (variants: ProductVariant[]) => {
      if (!productId) {
        throw new Error("Product ID is required");
      }

      const response = await fetch(
        `/api/proxy/products/product-variants/${productId}/variants/bulk-update`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ variants }),
        }
      );

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || "Failed to bulk update variants");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["productVariants", productId],
      });
      toast.success("All variants updated successfully");
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to update variants"
      );
    },
  });
};

export const useDeleteProductVariant = (productId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (variantId: string) => {
      if (!productId || !variantId) {
        throw new Error("Product ID and Variant ID are required");
      }

      const response = await fetch(
        `/api/proxy/products/product-variants/${productId}/variants/${variantId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || "Failed to delete product variant");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["productVariants", productId],
      });
      toast.success("Variant deleted successfully");
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete variant"
      );
    },
  });
};

export const useProductVariants = (productId: string) => {
  const { data: variants = [], isLoading } = useGetProductVariants(productId);
  const createVariants = useCreateProductVariants(productId);
  const updateVariant = useUpdateProductVariant(productId);
  const bulkUpdate = useBulkUpdateVariants(productId);
  const deleteVariant = useDeleteProductVariant(productId);

  return {
    // Data
    variants,
    isLoading,

    // Actions
    createVariants: createVariants.mutateAsync,
    updateVariant: updateVariant.mutateAsync,
    bulkUpdate: bulkUpdate.mutateAsync,
    deleteVariant: deleteVariant.mutateAsync,

    // States
    isCreating: createVariants.isPending,
    isUpdating: updateVariant.isPending,
    isBulkUpdating: bulkUpdate.isPending,
    isDeleting: deleteVariant.isPending,
  };
};
