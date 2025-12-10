import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Product } from "@/types/product";
import { Badge } from "@/components/ui/badge";

const ProductOptionsReview = ({ product }: { product: Product }) => {
  if (!product.options || product.options.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Options</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {product.options.map((option) => (
            <div key={option.id} className="border rounded-lg p-4 space-y-3">
              <h4 className="font-medium text-lg">{option.name}</h4>
              <div className="flex flex-wrap gap-2">
                {option.values.map((value) => (
                  <Badge key={value.id} variant="outline">
                    {value.value}
                  </Badge>
                ))}
              </div>
              <div className="text-sm text-muted-foreground">
                {option.values.length} value
                {option.values.length !== 1 ? "s" : ""}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductOptionsReview;
