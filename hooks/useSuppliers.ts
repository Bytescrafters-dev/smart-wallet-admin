import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useCurrentStore } from "@/contexts/storeProvider";
import { Supplier } from "@/types/supplier";

interface SuppliersResponse {
  data: Supplier[];
  total: number;
  page: number;
  limit: number;
}

interface UseSuppliersParams {
  page?: number;
  limit?: number;
}

interface CreateSupplierInput {
  name: string;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  address1?: string;
  city?: string;
  country?: string;
  notes?: string;
}

interface UpdateSupplierInput {
  name: string;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  address1?: string;
  city?: string;
  country?: string;
  notes?: string;
}

export const useSuppliers = ({
  page = 1,
  limit = 10,
}: UseSuppliersParams = {}) => {
  const currentStore = useCurrentStore();

  return useQuery({
    queryKey: ["suppliers", currentStore?.id, page, limit],
    queryFn: async (): Promise<SuppliersResponse> => {
      if (!currentStore?.id) {
        throw new Error("No store selected");
      }

      const response = await fetch(
        `/api/proxy/suppliers/all/${currentStore.id}?page=${page}&limit=${limit}`,
      );

      if (!response.ok) {
        throw new Error("Failed to fetch suppliers");
      }

      return response.json();
    },
    enabled: !!currentStore?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useSupplier = (id: string) => {
  return useQuery({
    queryKey: ["supplier", id],
    queryFn: async (): Promise<Supplier> => {
      const response = await fetch(`/api/proxy/suppliers/${id}`);

      if (!response.ok) {
        throw new Error("Failed to fetch supplier");
      }

      return response.json();
    },
    enabled: !!id,
  });
};

export const useCreateSupplier = () => {
  const queryClient = useQueryClient();
  const currentStore = useCurrentStore();

  return useMutation({
    mutationFn: async (data: CreateSupplierInput): Promise<Supplier> => {
      if (!currentStore?.id) {
        throw new Error("No store selected");
      }

      const response = await fetch("/api/proxy/suppliers", {
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
        throw new Error(error.message || "Failed to create supplier");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["suppliers", currentStore?.id],
      });
    },
  });
};

export const useUpdateSupplier = () => {
  const queryClient = useQueryClient();
  const currentStore = useCurrentStore();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: UpdateSupplierInput;
    }): Promise<Supplier> => {
      const response = await fetch(`/api/proxy/suppliers/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...data, storeId: currentStore?.id }),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || "Failed to update supplier");
      }

      return response.json();
    },
    onSuccess: (updatedCategory, variables) => {
      queryClient.setQueryData<Supplier>(
        ["supplier", variables.id],
        updatedCategory,
      );

      queryClient.invalidateQueries({
        queryKey: ["suppliers", currentStore?.id],
      });
    },
  });
};

export const useDeleteSupplier = () => {
  const queryClient = useQueryClient();
  const currentStore = useCurrentStore();

  return useMutation({
    mutationFn: async (supplierId: string) => {
      const response = await fetch(`/api/proxy/suppliers/${supplierId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || "Failed to delete supplier");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["suppliers", currentStore?.id],
      });
    },
  });
};
