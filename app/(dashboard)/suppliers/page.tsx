"use client";
import { useEffect, useState } from "react";
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
import { useDeleteSupplier, useSuppliers } from "@/hooks/useSuppliers";
import { Edit, Trash2 } from "lucide-react";
import DeleteDialog from "@/components/delete-confirmation-dialog";
import { toast } from "sonner";

const Suppliers = () => {
  const [page, setPage] = useState(1);
  const limit = 10;
  const [deleteDialog, setDeleteDialog] = useState({
    isOpen: false,
    supplierId: "",
    supplierName: "",
  });

  const { data, isLoading, error } = useSuppliers({ page, limit });
  const {
    mutateAsync: deleteSupplier,
    isPending,
    isError,
  } = useDeleteSupplier();

  const handleDeleteClick = (supplierId: string, supplierName: string) => {
    setDeleteDialog({ isOpen: true, supplierId, supplierName });
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteSupplier(deleteDialog.supplierId);
      setDeleteDialog({ isOpen: false, supplierId: "", supplierName: "" });
      toast.success("Supplier deleted successfully");
    } catch {}
  };

  useEffect(() => {
    if (isError) {
      toast.error("Failed to delete supplier!");
    }
  }, [isError]);

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
        <h1 className="text-2xl font-bold">Suppliers</h1>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-bold">Name</TableHead>
              <TableHead className="font-bold">Contact Name</TableHead>
              <TableHead className="font-bold">Contact Email</TableHead>
              <TableHead className="font-bold">Contact Phone</TableHead>
              <TableHead className="font-bold">City</TableHead>
              <TableHead className="font-bold">Country</TableHead>
              <TableHead className="font-bold">Notes</TableHead>
              <TableHead className="font-bold text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: limit }).map((_, i) => (
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
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-16" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                </TableRow>
              ))
            ) : data?.data?.length ? (
              data.data.map((supplier) => (
                <TableRow key={supplier.id}>
                  <TableCell className="font-medium">
                    <Link href={`/suppliers/update/${supplier.id}`}>
                      {supplier.name}
                    </Link>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {supplier.contactName || "-"}
                  </TableCell>
                  <TableCell>{supplier.contactEmail || "-"}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {supplier.contactPhone || "-"}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {supplier.city || "-"}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {supplier.country || "-"}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {supplier.notes || "-"}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2 justify-center">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/suppliers/update/${supplier.id}`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          handleDeleteClick(supplier.id, supplier.name)
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
                  colSpan={4}
                  className="text-center text-muted-foreground"
                >
                  No suppliers found
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
            {Math.min(page * limit, data.total)} of {data.total} suppliers
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
          setDeleteDialog({ isOpen: false, supplierId: "", supplierName: "" })
        }
        isLoading={isPending}
        onConfirm={handleDeleteConfirm}
        title="Delete Supplier"
        description={`Are you sure you want to delete "${deleteDialog.supplierName}"? This action cannot be undone.`}
      />
    </div>
  );
};

export default Suppliers;
