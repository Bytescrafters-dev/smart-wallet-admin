"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  useGetProductOptions,
  useCreateProductOption,
  useDeleteProductOption,
  ProductOption,
} from "@/hooks/useProductOptions";

interface ProductOptionsProps {
  productId: string;
}

const ProductOptions = ({ productId }: ProductOptionsProps) => {
  // Builder state
  const [optionName, setOptionName] = useState("");
  const [optionValues, setOptionValues] = useState<string[]>([]);
  const [currentValue, setCurrentValue] = useState("");

  // API hooks
  const { data: options = [], isLoading } = useGetProductOptions(
    productId || ""
  );
  const { mutateAsync: createOption, isPending: isCreating } =
    useCreateProductOption(productId || "");
  const { mutateAsync: deleteOption } = useDeleteProductOption(productId || "");

  const addValue = () => {
    if (!currentValue.trim()) return;
    if (optionValues.includes(currentValue.trim())) {
      toast.error("Value already exists");
      return;
    }
    setOptionValues([...optionValues, currentValue.trim()]);
    setCurrentValue("");
  };

  const removeValue = (index: number) => {
    setOptionValues(optionValues.filter((_, i) => i !== index));
  };

  const handleCreateOption = async () => {
    if (!optionName.trim()) {
      toast.error("Option name is required");
      return;
    }
    if (optionValues.length === 0) {
      toast.error("At least one option value is required");
      return;
    }
    if (
      options.some((opt) => opt.name.toLowerCase() === optionName.toLowerCase())
    ) {
      toast.error("Option name already exists");
      return;
    }

    try {
      await createOption({
        name: optionName.trim(),
        position: options.length,
        values: optionValues,
      });

      toast.success("Option created successfully");
      resetBuilder();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create option"
      );
    }
  };

  const resetBuilder = () => {
    setOptionName("");
    setOptionValues([]);
    setCurrentValue("");
  };

  const handleDeleteOption = async (optionId: string, optionName: string) => {
    if (
      !confirm(`Are you sure you want to delete the "${optionName}" option?`)
    ) {
      return;
    }

    try {
      await deleteOption(optionId);
      toast.success("Option deleted successfully");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete option"
      );
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addValue();
    }
  };

  if (!productId) {
    return (
      <div className="text-center py-8 text-gray-500">
        Please create the basic product first to add options.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Option Builder */}
      <Card>
        <CardHeader>
          <CardTitle>Create Product Option</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Option Name */}
          <div className="space-y-2">
            <Label htmlFor="optionName">Option Name *</Label>
            <Input
              id="optionName"
              value={optionName}
              onChange={(e) => setOptionName(e.target.value)}
              placeholder="e.g., Size, Color, Material"
            />
          </div>

          {/* Option Values Builder */}
          <div className="space-y-2">
            <Label>Option Values *</Label>
            <div className="flex gap-2">
              <Input
                value={currentValue}
                onChange={(e) => setCurrentValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="e.g., Small, Medium, Large"
              />
              <Button
                type="button"
                onClick={addValue}
                disabled={!currentValue.trim()}
                size="sm"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            {/* Values Preview */}
            {optionValues.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {optionValues.map((value, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {value}
                    <button
                      onClick={() => removeValue(index)}
                      className="ml-1 hover:text-red-500"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button
              onClick={handleCreateOption}
              disabled={
                isCreating || !optionName.trim() || optionValues.length === 0
              }
            >
              {isCreating ? "Creating..." : "Create Option"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={resetBuilder}
              disabled={!optionName && optionValues.length === 0}
            >
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Options Table */}
      <Card>
        <CardHeader>
          <CardTitle>Product Options</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-4 text-gray-500">
              Loading options...
            </div>
          ) : options.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No options created yet. Create your first option above.
            </div>
          ) : (
            <div className="space-y-4">
              {options.map((option) => (
                <div
                  key={option.id}
                  className="border rounded-lg p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-lg">{option.name}</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        handleDeleteOption(option.id!, option.name)
                      }
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {option.values.map((value) => (
                      <Badge key={value.id} variant="outline">
                        {value.value}
                      </Badge>
                    ))}
                  </div>
                  <div className="text-sm text-gray-500">
                    {option.values.length} value
                    {option.values.length !== 1 ? "s" : ""}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductOptions;
