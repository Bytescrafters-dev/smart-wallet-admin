export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  isPrimary: boolean;
  sortOrder: number;
  productId: string;
}

export interface UploadProductImageInput {
  productId: string;
  file: File;
  alt: string;
  sortOrder: number;
}

export interface UpdateImageMetadataInput {
  alt?: string;
  isPrimary?: boolean;
  sortOrder?: number;
}

export interface ReorderImagesInput {
  images: Array<{
    id: string;
    sortOrder: number;
  }>;
}
