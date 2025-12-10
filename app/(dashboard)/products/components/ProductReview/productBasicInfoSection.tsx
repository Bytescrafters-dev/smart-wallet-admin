"use client";

import { useCategories } from "@/hooks/useCategories";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/types/product";

const ProductBasicInfo = ({ product }: { product: Product }) => {
  const { data: categoriesData } = useCategories({ limit: 100 });
  const category = categoriesData?.data?.find(
    (c) => c.id === product.categoryId
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Basic Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Title</p>
            <p className="text-base">{product.title}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Slug</p>
            <p className="text-base font-mono">{product.slug}</p>
          </div>
        </div>

        <div>
          <p className="text-sm font-medium text-muted-foreground">
            Description
          </p>
          <p className="text-base">{product.description || "No description"}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Category
            </p>
            <p className="text-base">{category?.name || "No category"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Status</p>
            <Badge variant={product.active ? "default" : "secondary"}>
              {product.active ? "Active" : "Inactive"}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductBasicInfo;
