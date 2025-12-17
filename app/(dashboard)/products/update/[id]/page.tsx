"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

import { useUpdateProduct, useGetProduct } from "@/hooks/useProducts";
import { Button } from "@/components/ui/button";

import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductBasicForm from "../../components/BaseProduct";
import ProductImages from "../../components/ProductImages";
import ProductOptions from "../../components/ProductOptions";
import ProductVariants from "../../components/ProductVariants";
import ProductReview from "../../components/ProductReview";
import StepIndicator from "@/components/multi-step-component";

const UpdateProduct = () => {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;

  const [currentStep, setCurrentStep] = useState(0);

  // Form state
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState<string | undefined>(undefined);
  const [active, setActive] = useState(true);

  const { mutateAsync: UpdateProduct, isPending } = useUpdateProduct();
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

    try {
      await UpdateProduct({
        id: productId,
        data: {
          title,
          slug,
          description,
          categoryId,
          active,
        }
      });
      
      toast.success("Product basic info updated");
      setCurrentStep(1);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update product"
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
    toast.success("Product updated successfully");
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
        return <ProductOptions productId={productId} />;
      case 2:
        return <ProductVariants productId={productId} />;
      case 3:
        return <ProductImages productId={productId} />;
      case 4:
        return <ProductReview productId={productId} />;
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
            {isPending ? "Updating..." : "Update & Continue"}
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
        <h1 className="text-2xl font-bold">Update Product</h1>
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

export default UpdateProduct;
