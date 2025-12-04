"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useUpdateCategory, useCategories, useCategory } from "@/hooks/useCategories";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

const UpdateCategory = () => {
  const router = useRouter();
  const params = useParams();
  const categoryId = params.id as string;
  
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [parentId, setParentId] = useState<string | undefined>(undefined);

  const { data: category, isLoading } = useCategory(categoryId);
  const { data: categoriesData } = useCategories({ limit: 100 });
  const updateMutation = useUpdateCategory();

  useEffect(() => {
    if (category) {
      setName(category.name);
      setSlug(category.slug);
      setParentId(category.parentId || undefined);
    }
  }, [category]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !slug.trim()) {
      toast.error("Name and slug are required");
      return;
    }

    try {
      await updateMutation.mutateAsync({
        id: categoryId,
        data: {
          name: name.trim(),
          slug: slug.trim(),
          parentId,
        },
      });

      toast.success("Category updated successfully");
      router.push("/product-categories");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update category"
      );
    }
  };

  const generateSlug = (value: string) => {
    const slug = value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    setSlug(slug);
  };

  return (
    <div className="p-4 md:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Update Product Category</h1>
      </div>

      <Card className="max-w">
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-4">
              <Label
                htmlFor="name"
                className="w-40 min-w-40 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center"
              >
                Name
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (!slug) generateSlug(e.target.value);
                }}
                placeholder="Category name"
                required
              />
            </div>

            <div className="flex gap-4">
              <Label
                htmlFor="slug"
                className="w-40 min-w-40 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center"
              >
                Slug
              </Label>
              <Input
                id="slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="category-slug"
                required
              />
            </div>

            <div className="flex gap-4">
              <Label
                htmlFor="parent"
                className="w-40 min-w-40 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center"
              >
                Parent Category (Optional)
              </Label>
              <Select
                value={parentId}
                onValueChange={(value) =>
                  setParentId(value === "none" ? undefined : value)
                }
              >
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select parent category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No parent</SelectItem>
                  {categoriesData?.data?.filter(cat => cat.id !== categoryId).map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/product-categories")}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={updateMutation.isPending || isLoading}>
                {updateMutation.isPending ? "Updating..." : "Update Category"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default UpdateCategory;
