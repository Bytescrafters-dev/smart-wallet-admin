import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { useCurrentStore } from "@/contexts/storeProvider";
import { Product } from "@/types/product";

interface CreateProductInput {
  title: string;
  slug?: string;
  description?: string;
  active?: boolean;
  categoryId?: string;
  profileId?: string;
}

interface ProductsResponse {
  data: Product[];
  total: number;
  page: number;
  limit: number;
}

interface UseProductsParams {
  page?: number;
  limit?: number;
  title?: string;
  slug?: string;
  categoryId?: string;
  profileId?: string;
  active?: boolean;
}

export const useProducts = ({
  page = 1,
  limit = 10,
  title,
  slug,
  categoryId,
  profileId,
  active,
}: UseProductsParams = {}) => {
  const currentStore = useCurrentStore();

  return useQuery({
    queryKey: [
      "products",
      currentStore?.id,
      page,
      limit,
      title,
      slug,
      categoryId,
      profileId,
      active,
    ],
    queryFn: async (): Promise<ProductsResponse> => {
      if (!currentStore?.id) {
        throw new Error("No store selected");
      }

      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (title) params.append("title", title);
      if (slug) params.append("slug", slug);
      if (categoryId) params.append("categoryId", categoryId);
      if (profileId) params.append("profileId", profileId);
      if (active !== undefined) params.append("active", active.toString());

      const response = await fetch(
        `/api/proxy/products/store/${currentStore.id}?${params.toString()}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }

      return response.json();
    },
    enabled: !!currentStore?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useGetProduct = (
  productId: string,
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: ["product", productId],
    queryFn: async (): Promise<Product> => {
      if (!productId) {
        throw new Error("Product ID is required");
      }

      const response = await fetch(`/api/proxy/products/${productId}`);

      if (!response.ok) {
        throw new Error("Failed to fetch product");
      }

      return response.json();
    },
    enabled: !!productId && options?.enabled !== false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  const currentStore = useCurrentStore();

  return useMutation({
    mutationFn: async (data: CreateProductInput) => {
      if (!currentStore?.id) {
        throw new Error("No store selected");
      }

      const response = await fetch("/api/proxy/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          storeId: currentStore.id,
          profileId: "cmiq39i9f0002yiazedu83ycv",
        }),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || "Failed to create product");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["products", currentStore?.id],
      });
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  const currentStore = useCurrentStore();

  return useMutation({
    mutationFn: async (productId: string) => {
      const response = await fetch(`/api/proxy/products/${productId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || "Failed to delete product");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["products", currentStore?.id],
      });
    },
  });
};
