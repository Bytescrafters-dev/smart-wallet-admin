import { VariantInventory, VariantPrice } from "@/hooks/useProductVariants";

export interface Product {
  id: string;
  title: string;
  slug: string;
  categoryId: string;
  profileId: string;
  active: boolean;
  createdAt: string;
  description: string;
  updatedAt: string;
  storeId: string;
}

export interface VariantMasterTemplate {
  skuPattern: string;
  titlePattern: string;
  barcodePattern: string;
  weightGrams: number;
  lengthCm: number;
  widthCm: number;
  heightCm: number;
  active: boolean;
  prices: VariantPrice[];
  inventory: VariantInventory;
}
