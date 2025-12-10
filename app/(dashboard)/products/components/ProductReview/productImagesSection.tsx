import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Product } from "@/types/product";
import { CheckCircle } from "lucide-react";

const ProductImagesReview = ({ product }: { product: Product }) => {
  if (!product.images || product.images.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Images</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {product.images.map((image) => (
            <div
              key={image.id}
              className="relative aspect-square rounded-lg overflow-hidden border"
            >
              <img
                src={image.url}
                alt={image.alt || "Product image"}
                className="w-full h-full object-cover"
              />
              {image.isPrimary && (
                <div className="absolute top-2 right-2">
                  <CheckCircle className="h-5 w-5 text-green-500 bg-white rounded-full" />
                </div>
              )}
              {image.alt && (
                <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-2">
                  {image.alt}
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductImagesReview;
