import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Product } from "@/types/product";
import { Badge } from "@/components/ui/badge";

const ProductVariantsReview = ({ product }: { product: Product }) => {
  if (!product.variants || product.variants.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Variants ({product.variants.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="multiple" className="space-y-2">
          {product.variants.map((variant, index) => (
            <AccordionItem
              key={variant.id}
              value={`variant-${index}`}
              className="border rounded-lg"
            >
              <AccordionTrigger className="px-4 hover:no-underline">
                <div className="flex items-center justify-between w-full mr-4">
                  <div className="text-left">
                    <p className="font-medium">{variant.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {variant.sku}
                    </p>
                  </div>
                  <Badge variant={variant.active ? "default" : "secondary"}>
                    {variant.active ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Prices
                    </p>
                    <div className="space-y-1">
                      {variant.prices?.map((price, i) => (
                        <p key={i} className="text-sm">
                          {price.currency}: {price.amount}
                        </p>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Inventory
                    </p>
                    <div className="space-y-1">
                      <p className="text-sm">
                        Quantity: {variant.inventory?.quantity || 0}
                      </p>
                      <p className="text-sm">
                        Reserved: {variant.inventory?.reserved || 0}
                      </p>
                      <p className="text-sm">
                        Low Stock: {variant.inventory?.lowStockThreshold || 0}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Dimensions
                    </p>
                    <div className="space-y-1">
                      <p className="text-sm">
                        Weight: {variant.weightGrams || 0}g
                      </p>
                      <p className="text-sm">
                        L×W×H: {variant.lengthCm || 0}×{variant.widthCm || 0}×
                        {variant.heightCm || 0}cm
                      </p>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default ProductVariantsReview;
