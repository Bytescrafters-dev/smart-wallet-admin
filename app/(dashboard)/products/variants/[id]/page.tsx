"use client";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { ChevronLeft } from "lucide-react";
import { useGetProductVariants } from "@/hooks/useProductVariants";

const ProductVariantsPage = () => {
  const params = useParams();
  const productId = params.id as string;

  const { data, isLoading, isError } = useGetProductVariants(productId);

  useEffect(() => {
    if (isError) {
      toast.error("Failed to fetch product variants");
    }
  }, [isError]);

  return (
    <div className="p-4 md:p-8">
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild className="-ml-2 mb-2">
          <Link href="/products">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Products
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Product Variants</h1>
      </div>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-bold">Title</TableHead>
              <TableHead className="font-bold">sku</TableHead>
              <TableHead className="font-bold">Barcode</TableHead>
              <TableHead className="font-bold">Availabe stock</TableHead>
              <TableHead className="font-bold">Stock Threshold</TableHead>
              <TableHead className="font-bold">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 10 }).map((_, i) => (
                <TableRow key={i}>
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
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                </TableRow>
              ))
            ) : data?.length ? (
              data.map((variant) => (
                <TableRow key={variant.id}>
                  <TableCell className="font-medium">{variant.title}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {variant.sku}
                  </TableCell>
                  <TableCell>{variant.barcode ?? "-"}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {variant.inventory.quantity}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {variant.inventory.lowStockThreshold}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {variant.active ? "Active" : "Inactive"}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center text-muted-foreground"
                >
                  No variants found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ProductVariantsPage;
