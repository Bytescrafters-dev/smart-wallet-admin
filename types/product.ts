import {
  VariantInventory,
  VariantPrice,
  ProductVariant,
} from "@/hooks/useProductVariants";
import { ProductOption } from "@/hooks/useProductOptions";
import { ProductImage } from "@/types/productImage";

export interface Product {
  id: string;
  title: string;
  slug: string;
  description: string;
  categoryId: string;
  profileId: string;
  active: boolean;
  storeId: string;
  createdAt: string;
  updatedAt: string;

  // Nested relationships from API response
  category?: {
    id: string;
    name: string;
  };
  profile?: {
    id: string;
    name: string;
  };
  images?: ProductImage[];
  options?: ProductOption[];
  variants?: ProductVariant[];
  _count: any;
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
