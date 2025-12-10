"use client";

import { useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetProduct } from "@/hooks/useProducts";

import ProductBasicInfo from "./productBasicInfoSection";
import ProductOptionsReview from "./productOptionsSection";
import ProductVariantsReview from "./productVariantsSection";
import ProductImagesReview from "./productImagesSection";

interface ProductReviewProps {
  productId: string;
}

const ProductReview = ({ productId }: ProductReviewProps) => {
  const { data: product, isLoading, refetch } = useGetProduct(productId);

  useEffect(() => {
    refetch();
  }, [refetch]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-32 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Product not found
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{product.title}</h1>
          <p className="text-muted-foreground">
            Review your product before publishing
          </p>
        </div>
        <Badge
          variant={product.active ? "default" : "secondary"}
          className="text-sm"
        >
          {product.active ? "Active" : "Inactive"}
        </Badge>
      </div>

      <ProductBasicInfo product={product} />
      <ProductOptionsReview product={product} />
      <ProductVariantsReview product={product} />
      <ProductImagesReview product={product} />
    </div>
  );
};

export default ProductReview;
