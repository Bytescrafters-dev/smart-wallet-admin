import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Category } from "@/types/category";
import { useCurrentStore } from "@/contexts/storeProvider";

interface CategoriesResponse {
  data: Category[];
  total: number;
  page: number;
  limit: number;
}

interface UseCategoriesParams {
  page?: number;
  limit?: number;
}

interface CreateCategoryInput {
  name: string;
  slug: string;
  parentId?: string;
}

interface UpdateCategoryInput {
  name: string;
  slug: string;
  parentId?: string;
}

export const useCategories = ({
  page = 1,
  limit = 10,
}: UseCategoriesParams = {}) => {
  const currentStore = useCurrentStore();

  return useQuery({
    queryKey: ["categories", currentStore?.id, page, limit],
    queryFn: async (): Promise<CategoriesResponse> => {
      if (!currentStore?.id) {
        throw new Error("No store selected");
      }

      const response = await fetch(
        `/api/proxy/categories/stores/${currentStore.id}?page=${page}&limit=${limit}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }

      return response.json();
    },
    enabled: !!currentStore?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCategory = (id: string) => {
  return useQuery({
    queryKey: ["category", id],
    queryFn: async (): Promise<Category> => {
      const response = await fetch(`/api/proxy/categories/${id}`);

      if (!response.ok) {
        throw new Error("Failed to fetch category");
      }

      return response.json();
    },
    enabled: !!id,
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  const currentStore = useCurrentStore();

  return useMutation({
    mutationFn: async (data: CreateCategoryInput): Promise<Category> => {
      if (!currentStore?.id) {
        throw new Error("No store selected");
      }

      const response = await fetch("/api/proxy/categories", {
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
        throw new Error(error.message || "Failed to create category");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["categories", currentStore?.id],
      });
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  const currentStore = useCurrentStore();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: UpdateCategoryInput;
    }): Promise<Category> => {
      const response = await fetch(`/api/proxy/categories/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || "Failed to update category");
      }

      return response.json();
    },
    onSuccess: (updatedCategory, variables) => {
      queryClient.setQueryData<Category>(
        ["category", variables.id],
        updatedCategory
      );

      queryClient.invalidateQueries({
        queryKey: ["categories", currentStore?.id],
      });
    },
  });
};
