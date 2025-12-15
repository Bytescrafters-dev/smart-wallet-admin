"use client";
import { useState } from "react";
import { useProducts, useDeleteProduct } from "@/hooks/useProducts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { Edit, Trash2 } from "lucide-react";
import DeleteDialog from "@/components/delete-confirmation-dialog";
import { toast } from "sonner";

const Products = () => {
  const [page, setPage] = useState(1);
  const limit = 10;
  const [deleteDialog, setDeleteDialog] = useState({
    isOpen: false,
    productId: "",
    productTitle: "",
  });

  const { data, isLoading, error } = useProducts({ page, limit });
  const deleteProduct = useDeleteProduct();

  const handleDeleteClick = (productId: string, productTitle: string) => {
    setDeleteDialog({ isOpen: true, productId, productTitle });
  };

  const handleDeleteConfirm = () => {
    deleteProduct.mutate(deleteDialog.productId, {
      onSuccess: () => {
        setDeleteDialog({ isOpen: false, productId: "", productTitle: "" });
        toast.success("Product deleted successfully");
      },
      onError: (error) => {
        console.error("Delete failed:", error);
        toast.error("Failed to delete product");
      },
    });
  };

  if (error) {
    return (
      <div className="p-4 md:p-8">
        <div className="text-red-500">Error: {error.message}</div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-bold">Image</TableHead>
              <TableHead className="font-bold">Title</TableHead>
              <TableHead className="font-bold">Category</TableHead>
              <TableHead className="font-bold">Variants</TableHead>
              <TableHead className="font-bold">Active</TableHead>
              <TableHead className="font-bold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: limit }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton className="h-12 w-12" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-32" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-16" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-16" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                </TableRow>
              ))
            ) : data?.data?.length ? (
              data.data.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    {product.images?.find((img) => img.isPrimary)?.url ? (
                      <img
                        src={
                          product.images.find((img) => img.isPrimary)?.url || ""
                        }
                        alt={
                          product.images.find((img) => img.isPrimary)?.alt ||
                          product.title
                        }
                        className="w-12 h-12 rounded object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-[8px] text-gray-500">
                        No Image
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">
                    <Link href={`/products/update/${product.id}`}>
                      {product.title}
                    </Link>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {product.category?.name || "No Category"}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {product._count?.variants || 0}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        product.active
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {product.active ? "Active" : "Inactive"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/products/update/${product.id}`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          handleDeleteClick(product.id, product.title)
                        }
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center text-muted-foreground"
                >
                  No products found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {data && (
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-muted-foreground">
            Showing {(page - 1) * limit + 1} to{" "}
            {Math.min(page * limit, data.total)} of {data.total} products
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => p + 1)}
              disabled={!data || page * limit >= data.total}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      <DeleteDialog
        isOpen={deleteDialog.isOpen}
        onOpenChange={() =>
          setDeleteDialog({ isOpen: false, productId: "", productTitle: "" })
        }
        isLoading={deleteProduct.isPending}
        onConfirm={handleDeleteConfirm}
        title="Delete Product"
        description={`Are you sure you want to delete "${deleteDialog.productTitle}"? This action cannot be undone.`}
      />
    </div>
  );
};

export default Products;
