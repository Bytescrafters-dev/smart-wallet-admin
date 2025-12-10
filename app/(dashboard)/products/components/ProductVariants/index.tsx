"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion } from "@/components/ui/accordion";
import { ChevronDown, ChevronRight, Copy, Plus, X } from "lucide-react";
import { toast } from "sonner";
import {
  useProductVariants,
  ProductVariant,
  VariantPrice,
  VariantInventory,
} from "@/hooks/useProductVariants";
import {
  useGetProductOptions,
  ProductOptionValue,
} from "@/hooks/useProductOptions";
import VariantAccordionItem from "../variantAccodion";
import { VariantMasterTemplate } from "@/types/product";
import VariantMasterTemplateCard from "../variantMasterTemplate";

interface ProductVariantsProps {
  productId?: string;
}

// Helper function to generate cartesian product
const cartesianProduct = (
  arrays: ProductOptionValue[][]
): ProductOptionValue[][] => {
  return arrays.reduce(
    (acc, curr) => acc.flatMap((x) => curr.map((y) => [...x, y])),
    [[]] as ProductOptionValue[][]
  );
};

// Simple hash function for SKU generation
const simpleHash = (str: string): string => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36).substring(0, 6).toUpperCase();
};

// Helper function to generate unique SKU from option values using hash
const generateSKU = (
  optionValues: ProductOptionValue[],
  basePattern: string = "PROD"
): string => {
  // Create a unique string from option value IDs and names
  const uniqueString = optionValues
    .map((val) => `${val.id}-${val.value}`)
    .sort() // Sort for consistency
    .join("|");

  // Generate hash from the unique string
  const hash = simpleHash(uniqueString);

  return `${basePattern}-${hash}`;
};

const ProductVariants = ({ productId }: ProductVariantsProps) => {
  // State
  const [showGenerator, setShowGenerator] = useState<boolean>(true);
  const [masterTemplate, setMasterTemplate] = useState<VariantMasterTemplate>({
    skuPattern: "PROD",
    titlePattern: "",
    barcodePattern: "",
    weightGrams: 0,
    lengthCm: 0,
    widthCm: 0,
    heightCm: 0,
    active: true,
    prices: [
      { currency: "AUD", amount: 0 },
      { currency: "USD", amount: 0 },
    ] as VariantPrice[],
    inventory: {
      quantity: 0,
      reserved: 0,
      lowStockThreshold: 5,
    } as VariantInventory,
  });
  const [generatedVariants, setGeneratedVariants] = useState<ProductVariant[]>(
    []
  );
  const [expandedVariants, setExpandedVariants] = useState<string[]>([]);
  // const [selectedVariants, setSelectedVariants] = useState<Set<string>>(
  //   new Set()
  // );

  // API hooks
  const { data: options = [], isLoading: optionsLoading } =
    useGetProductOptions(productId || "");
  const {
    variants,
    isLoading: variantsLoading,
    createVariants,
    updateVariant,
    deleteVariant,
    isCreating,
  } = useProductVariants(productId || "");

  // Hide generator if variants exist
  useEffect(() => {
    if (variants.length > 0) {
      setShowGenerator(false);
    }
  }, [variants]);

  const generateVariantsFromOptions = () => {
    if (options.length === 0) {
      toast.error("No product options found. Please create options first.");
      return;
    }

    const optionValues = options.map((option) => option.values);
    const combinations = cartesianProduct(optionValues);

    const newVariants: ProductVariant[] = combinations.map((combination) => {
      const optionValueNames = combination.map((val) => val.value);
      const sku = generateSKU(combination, masterTemplate.skuPattern);
      const title = masterTemplate.titlePattern
        ? masterTemplate.titlePattern.replace(
            /{(\w+)}/g,
            (match, optionName) => {
              const optionIndex = options.findIndex(
                (opt) => opt.name.toLowerCase() === optionName.toLowerCase()
              );
              return optionIndex >= 0
                ? combination[optionIndex]?.value || match
                : match;
            }
          )
        : optionValueNames.join(" ");

      return {
        sku,
        title,
        active: masterTemplate.active,
        weightGrams: masterTemplate.weightGrams || undefined,
        lengthCm: masterTemplate.lengthCm || undefined,
        widthCm: masterTemplate.widthCm || undefined,
        heightCm: masterTemplate.heightCm || undefined,
        optionValueIds: combination.map((val) => val.id!),
        optionValueNames,
        prices: masterTemplate.prices.map((price) => ({ ...price })),
        inventory: { ...masterTemplate.inventory },
      };
    });

    setGeneratedVariants(newVariants);
    toast.success(`Generated ${newVariants.length} variants`);
  };

  const handleCreateVariants = async () => {
    if (generatedVariants.length === 0) {
      toast.error("No variants to create");
      return;
    }

    try {
      await createVariants({ variants: generatedVariants });
      setGeneratedVariants([]);
      setShowGenerator(false);
    } catch (error) {
      // Error handled in hook
    }
  };

  const copyTemplateToAll = () => {
    const updatedVariants = generatedVariants.map((variant) => ({
      ...variant,
      weightGrams: masterTemplate.weightGrams || undefined,
      lengthCm: masterTemplate.lengthCm || undefined,
      widthCm: masterTemplate.widthCm || undefined,
      heightCm: masterTemplate.heightCm || undefined,
      active: masterTemplate.active,
      prices: masterTemplate.prices.map((price) => ({ ...price })),
      inventory: { ...masterTemplate.inventory },
    }));
    setGeneratedVariants(updatedVariants);
    toast.success("Template applied to all variants");
  };

  const handleRemoveGeneratedVariant = (index: number) => {
    setGeneratedVariants((prev) => prev.filter((_, i) => i !== index));
    toast.success("Variant removed");
  };

  const handleDeleteCreatedVariant = async (variantId: string) => {
    if (!confirm("Are you sure you want to delete this variant?")) {
      return;
    }
    try {
      await deleteVariant(variantId);
    } catch (error) {
      // Error handled in hook
    }
  };

  const handleDeleteVariant = (variantId: string, index: number) => {
    if (!variantId) {
      handleRemoveGeneratedVariant(index);
    } else {
      handleDeleteCreatedVariant(variantId);
    }
  };

  const handleUpdateGeneratedVariant = (
    updatedVariant: ProductVariant,
    index: number
  ) => {
    setGeneratedVariants((prev) =>
      prev.map((v, i) => (i === index ? updatedVariant : v))
    );
  };

  const handleUpdateCreatedVariant = async (updatedVariant: ProductVariant) => {
    try {
      await updateVariant({
        variantId: updatedVariant.id!,
        data: updatedVariant,
      });
    } catch (error) {
      // Error handled in hook
    }
  };

  const handleSaveVariant = async (variant: ProductVariant, index: number) => {
    if (!variant.id) {
      handleUpdateGeneratedVariant(variant, index);
    } else {
      await handleUpdateCreatedVariant(variant);
    }
  };

  const displayVariants =
    generatedVariants.length > 0 ? generatedVariants : variants;

  const expandAllVariants = () => {
    setExpandedVariants(displayVariants.map((_, i) => `variant-${i}`));
  };

  const collapseAllVariants = () => {
    setExpandedVariants([]);
  };

  const addPriceToTemplate = () => {
    setMasterTemplate((prev) => ({
      ...prev,
      prices: [...prev.prices, { currency: "GBP", amount: 0 }],
    }));
  };

  const removePriceFromTemplate = (index: number) => {
    setMasterTemplate((prev) => ({
      ...prev,
      prices: prev.prices.filter((_, i) => i !== index),
    }));
  };

  const updateTemplatePrice = (
    index: number,
    field: keyof VariantPrice,
    value: any
  ) => {
    setMasterTemplate((prev) => ({
      ...prev,
      prices: prev.prices.map((price, i) =>
        i === index ? { ...price, [field]: value } : price
      ),
    }));
  };

  if (!productId) {
    return (
      <div className="text-center py-8 text-gray-500">
        Please create the basic product first to manage variants.
      </div>
    );
  }

  if (optionsLoading || variantsLoading) {
    return (
      <div className="text-center py-8 text-gray-500">Loading variants...</div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Variant Generator */}
      {showGenerator && (
        <VariantMasterTemplateCard
          setMasterTemplate={setMasterTemplate}
          masterTemplate={masterTemplate}
          addPriceToTemplate={addPriceToTemplate}
          updateTemplatePrice={updateTemplatePrice}
          removePriceFromTemplate={removePriceFromTemplate}
          generateVariantsFromOptions={generateVariantsFromOptions}
          options={options}
          generatedVariants={generatedVariants}
          copyTemplateToAll={copyTemplateToAll}
          handleCreateVariants={handleCreateVariants}
          isCreating={isCreating}
        />
      )}

      {/* Unified Accordion-Based Variant Management */}
      {displayVariants.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>
                {generatedVariants.length > 0 ? "Generated" : "Product"}{" "}
                Variants ({displayVariants.length})
              </CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={expandAllVariants}>
                  <ChevronDown className="w-4 h-4 mr-2" />
                  Expand All
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={collapseAllVariants}
                >
                  <ChevronRight className="w-4 h-4 mr-2" />
                  Collapse All
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Accordion
              type="multiple"
              value={expandedVariants}
              onValueChange={setExpandedVariants}
              className="space-y-2"
            >
              {displayVariants.map((variant, index) => (
                <VariantAccordionItem
                  key={variant.id || `generated-${index}`}
                  variant={variant}
                  index={index}
                  isUnsaved={!variant.id}
                  onUpdate={handleSaveVariant}
                  onDelete={handleDeleteVariant}
                />
              ))}
            </Accordion>
          </CardContent>
        </Card>
      )}

      {displayVariants.length === 0 && !showGenerator && (
        <div className="text-center py-8 text-gray-500">
          No variants found.
          <Button
            variant="link"
            onClick={() => setShowGenerator(true)}
            className="p-0 h-auto ml-1"
          >
            Generate variants from options
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProductVariants;
