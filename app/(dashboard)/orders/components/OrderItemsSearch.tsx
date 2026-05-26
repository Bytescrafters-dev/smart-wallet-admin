"use client";
import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Plus, X } from "lucide-react";
import { useDebounce } from "use-debounce";
import { useSeachProducts } from "@/hooks/useProducts";
import { productSearchVariant, ProductsSearch } from "@/types/product";
import { OrderItem } from "@/types/order";
import { useCurrentStore } from "@/contexts/storeProvider";

type LineInputs = Record<string, { qty: string }>;

interface Props {
  items: OrderItem[];
  onAddItem: (item: OrderItem) => void;
}

export const OrderItemsSearch = ({ items, onAddItem }: Props) => {
  const currentStore = useCurrentStore();
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 300);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductsSearch | null>(
    null,
  );
  const [lineInputs, setLineInputs] = useState<LineInputs>({});
  const containerRef = useRef<HTMLDivElement>(null);

  const { data, isLoading, isError } = useSeachProducts(debouncedSearch);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getVariantPrice = (
    variant: productSearchVariant,
  ): number | undefined => {
    if (!variant.prices?.length) return undefined;
    const currency = currentStore?.defaultCurrency;
    const match = currency
      ? variant.prices.find((p) => p.currency === currency)
      : variant.prices[0];
    return match ? match.amount / 100 : undefined;
  };

  const handleSelectProduct = (product: ProductsSearch) => {
    setSelectedProduct(product);
    setSearch(product.title);
    setShowDropdown(false);
    const inputs: LineInputs = {};
    (product.variants ?? []).forEach((v) => {
      if (!v.id) return;
      const existing = items.find((i) => i.variantId === v.id);
      inputs[v.id] = { qty: existing ? existing.quantity.toString() : "" };
    });
    setLineInputs(inputs);
  };

  const handleClearProduct = () => {
    setSelectedProduct(null);
    setSearch("");
    setLineInputs({});
  };

  const handleAddItem = (variant: productSearchVariant) => {
    if (!selectedProduct || !variant.id) return;
    const input = lineInputs[variant.id];
    const qty = parseInt(input?.qty || "0");
    if (qty < 1) return;

    onAddItem({
      variantId: variant.id,
      productTitle: selectedProduct.title,
      variantTitle: variant.title,
      sku: variant.sku,
      quantity: qty,
      pricePerUnit: getVariantPrice(variant),
    });

    setLineInputs((prev) => ({
      ...prev,
      [variant.id!]: { qty: "" },
    }));
  };

  const isAlreadyAdded = (variantId: string) =>
    items.some((i) => i.variantId === variantId);

  const variants = selectedProduct?.variants ?? [];
  const currency = currentStore?.defaultCurrency ?? "";

  return (
    <div className="space-y-4">
      <div ref={containerRef} className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products to add..."
            className="pl-9 pr-9"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setShowDropdown(true);
              if (!e.target.value) {
                setSelectedProduct(null);
                setLineInputs({});
              }
            }}
            onFocus={() => {
              if (search) setShowDropdown(true);
            }}
          />
          {search && (
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              onClick={handleClearProduct}
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {showDropdown && search && !selectedProduct && (
          <div className="absolute top-full mt-1 left-0 right-0 z-10 bg-background border rounded-md shadow-md overflow-hidden">
            {isLoading ? (
              <div className="p-3 space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="space-y-1.5">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                ))}
              </div>
            ) : isError ? (
              <div className="p-3 text-sm text-destructive">
                Failed to load products
              </div>
            ) : data?.length === 0 ? (
              <div className="p-3 text-sm text-muted-foreground">
                No products found
              </div>
            ) : (
              data?.map((product) => (
                <button
                  key={product.id}
                  type="button"
                  className="w-full text-left px-3 py-2.5 hover:bg-muted text-sm transition-colors border-b last:border-0"
                  onMouseDown={() => handleSelectProduct(product)}
                >
                  <span className="font-medium">{product.title}</span>
                  <span className="text-muted-foreground ml-2 text-xs">
                    {product._count?.variants ?? 0} variants
                  </span>
                </button>
              ))
            )}
          </div>
        )}
      </div>

      {selectedProduct && (
        <div className="border rounded-md overflow-hidden">
          <div className="bg-muted/50 px-4 py-2.5 flex items-center justify-between">
            <span className="text-sm font-medium">{selectedProduct.title}</span>
            <span className="text-xs text-muted-foreground">
              Enter qty to add variants
            </span>
          </div>

          {variants.length === 0 ? (
            <div className="px-4 py-6 text-sm text-muted-foreground text-center">
              No variants available for this product
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="px-4 py-2 font-medium text-muted-foreground">
                      Variant
                    </th>
                    <th className="px-4 py-2 font-medium text-muted-foreground">
                      SKU
                    </th>
                    <th className="px-4 py-2 font-medium text-muted-foreground w-20">
                      Stock
                    </th>
                    <th className="px-4 py-2 font-medium text-muted-foreground">
                      Unit Price
                    </th>
                    <th className="px-4 py-2 font-medium text-muted-foreground w-24">
                      Qty *
                    </th>
                    <th className="px-4 py-2 w-24" />
                  </tr>
                </thead>
                <tbody>
                  {variants.map((variant) => {
                    if (!variant.id) return null;
                    const added = isAlreadyAdded(variant.id);
                    const input = lineInputs[variant.id] ?? { qty: "" };
                    const qtyValid = parseInt(input.qty) >= 1;
                    const price = getVariantPrice(variant);

                    return (
                      <tr
                        key={variant.id}
                        className={`border-b last:border-0 ${added ? "bg-muted/20" : ""}`}
                      >
                        <td className="px-4 py-2.5">
                          <span>{variant.title}</span>
                          {added && (
                            <Badge
                              variant="secondary"
                              className="ml-2 text-xs py-0"
                            >
                              In order
                            </Badge>
                          )}
                        </td>
                        <td className="px-4 py-2.5 text-muted-foreground font-mono text-xs">
                          {variant.sku}
                        </td>
                        <td className="px-4 py-2.5">
                          <Badge
                            variant={
                              variant.inventory.quantity === 0
                                ? "destructive"
                                : variant.inventory.quantity < 5
                                  ? "outline"
                                  : "secondary"
                            }
                            className="text-xs"
                          >
                            {variant.inventory.quantity}
                          </Badge>
                        </td>
                        <td className="px-4 py-2.5 text-muted-foreground">
                          {price !== undefined
                            ? `${currency} ${price.toFixed(2)}`
                            : "—"}
                        </td>
                        <td className="px-4 py-2.5">
                          <Input
                            type="number"
                            min={1}
                            placeholder="0"
                            className="h-8 w-20"
                            value={input.qty}
                            onChange={(e) =>
                              setLineInputs((prev) => ({
                                ...prev,
                                [variant.id!]: { qty: e.target.value },
                              }))
                            }
                          />
                        </td>
                        <td className="px-4 py-2.5">
                          <Button
                            size="sm"
                            variant={added ? "outline" : "default"}
                            className="h-8"
                            disabled={!qtyValid}
                            onClick={() => handleAddItem(variant)}
                          >
                            <Plus className="h-3 w-3 mr-1" />
                            {added ? "Update" : "Add"}
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
