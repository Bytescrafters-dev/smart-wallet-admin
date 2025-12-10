import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ProductImage,
  UpdateImageMetadataInput,
  ReorderImagesInput,
} from "@/types/productImage";

export const useProductImages = (productId: string) => {
  return useQuery({
    queryKey: ["productImages", productId],
    queryFn: async (): Promise<ProductImage[]> => {
      const response = await fetch(
        `/api/proxy/products/product-images/${productId}/images`
      );
      if (!response.ok) throw new Error("Failed to fetch product images");
      return response.json();
    },
    enabled: !!productId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useUploadProductImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      productId,
      file,
      alt,
      sortOrder,
    }: {
      productId: string;
      file: File;
      alt: string;
      sortOrder: number;
    }) => {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("productId", productId);
      formData.append("alt", alt);
      formData.append("sortOrder", sortOrder.toString());

      const response = await fetch("/api/proxy/admin/uploads/product-image", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || "Failed to upload image");
      }

      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["productImages", variables.productId],
      });
    },
  });
};

export const useUpdateImageMetadata = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      productId,
      imageId,
      data,
    }: {
      productId: string;
      imageId: string;
      data: UpdateImageMetadataInput;
    }) => {
      const response = await fetch(
        `/api/proxy/products/product-images/${productId}/images/${imageId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || "Failed to update image");
      }

      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["productImages", variables.productId],
      });
    },
  });
};

export const useDeleteProductImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      productId,
      imageId,
    }: {
      productId: string;
      imageId: string;
    }) => {
      const response = await fetch(
        `/api/proxy/products/product-images/${productId}/images/${imageId}`,
        { method: "DELETE" }
      );

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || "Failed to delete image");
      }

      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["productImages", variables.productId],
      });
    },
  });
};

export const useReorderProductImages = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      productId,
      images,
    }: {
      productId: string;
      images: ReorderImagesInput["images"];
    }) => {
      const response = await fetch(
        `/api/proxy/products/product-images/${productId}/images/reorder`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ images }),
        }
      );

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || "Failed to reorder images");
      }

      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["productImages", variables.productId],
      });
    },
  });
};
