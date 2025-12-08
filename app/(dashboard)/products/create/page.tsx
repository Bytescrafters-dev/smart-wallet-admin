"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { useCreateProduct, useGetProduct } from "@/hooks/useProducts";
import { Button } from "@/components/ui/button";

import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductBasicForm from "./components/baseProduct";
import ProductImages from "./components/productImages";
import ProductOptions from "./components/productOptions";
import ProductVariants from "./components/productVariants";
import ProductReview from "./components/ProductReview";
import StepIndicator from "@/components/multi-step-component";

const CreateProduct = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [productId, setProductId] = useState<string | null>(null);

  // Form state
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState<string | undefined>(undefined);
  const [active, setActive] = useState(true);

  const { mutateAsync: createProduct, isPending } = useCreateProduct();
  const { data: productData } = useGetProduct(productId || "", {
    enabled: !!productId,
  });

  // Load product data when productId is available
  useEffect(() => {
    if (productData) {
      setTitle(productData.title);
      setSlug(productData.slug);
      setDescription(productData.description || "");
      setCategoryId(productData.categoryId || undefined);
      setActive(productData.active);
    }
  }, [productData]);

  const handleBasicFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("saving");

    try {
      //handle validation
      //handle product update
      if (!productId) {
        const result = await createProduct({
          title,
          slug: slug || undefined,
          description: description || undefined,
          categoryId,
          active,
        });
        setProductId(result.id);
        toast.success("Product draft created successfully");
      }
      setCurrentStep(1);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create product"
      );
    }
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFinish = () => {
    toast.success("Product created successfully");
    router.push("/products");
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <ProductBasicForm
            title={title}
            setTitle={setTitle}
            slug={slug}
            setSlug={setSlug}
            description={description}
            setDescription={setDescription}
            categoryId={categoryId}
            setCategoryId={setCategoryId}
            active={active}
            setActive={setActive}
            onSubmit={handleBasicFormSubmit}
            isPending={isPending}
          />
        );
      case 1:
        return <ProductOptions productId={productId ?? ""} />;
      case 2:
        return <ProductVariants productId={productId ?? ""} />;
      case 3:
        return <ProductImages />;
      case 4:
        return <ProductReview />;
      default:
        return null;
    }
  };

  const renderStepActions = () => {
    if (currentStep === 0) {
      return (
        <div className="flex justify-end gap-4 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/products")}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isPending}
            onClick={handleBasicFormSubmit}
          >
            {isPending ? "Creating..." : "Create & Continue"}
          </Button>
        </div>
      );
    }

    return (
      <div className="flex justify-between pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep === 0}
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>

        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/products")}
          >
            Save Draft
          </Button>
          {currentStep === 4 ? (
            <Button onClick={handleFinish}>Finish</Button>
          ) : (
            <Button onClick={handleNext}>
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 md:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Create Product</h1>
        {productId && (
          <p className="text-sm text-gray-600 mt-2">
            Product: {productData?.title}
          </p>
        )}
      </div>

      <StepIndicator
        currentStep={currentStep}
        steps={[
          "Basic Info",
          "Options",
          "Variants & Pricing",
          "Images",
          "Review",
        ]}
      />

      <Card className="max-w">
        <CardContent className="pt-6">
          {renderStepContent()}
          {renderStepActions()}
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateProduct;
