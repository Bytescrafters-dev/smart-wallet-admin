"use client";
import { useEffect, useState } from "react";
import { format } from "date-fns";
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
import {
  useDeletePurchaseOrder,
  usePurchaseOrders,
} from "@/hooks/usePurchaseOrders";
import { IconPlus } from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";

export const getStatusColor = (status: string) => {
  switch (status) {
    case "CREATED":
      return "bg-blue-100 text-blue-800";
    case "REJECTED":
      return "bg-red-100 text-red-800";
    case "RECEIVED":
      return "bg-green-100 text-green-800";
    case "PARTIALLY_RECEIVED":
      return "bg-yellow-100 text-yellow-800";
    case "CLOSED":
      return "bg-grey-100 text-grey-800";
    default:
      return "";
  }
};

export const getStatusText = (status: string) => {
  switch (status) {
    case "CREATED":
      return "CREATED";
    case "REJECTED":
      return "REJECTED";
    case "RECEIVED":
      return "RECEIVED";
    case "PARTIALLY_RECEIVED":
      return "PARTIALLY RECEIVED";
    case "CLOSED":
      return "CLOSED";
    default:
      return "";
  }
};

const PurchaseOrdersPage = () => {
  const [page, setPage] = useState(1);
  const limit = 10;
  const [deleteDialog, setDeleteDialog] = useState({
    isOpen: false,
    orderNumber: "",
    orderId: "",
  });

  const { data, isLoading, error } = usePurchaseOrders({ page, limit });
  const {
    mutateAsync: deletePurchaseOrder,
    isPending,
    isError,
  } = useDeletePurchaseOrder();

  const handleDeleteClick = (orderId: string, orderNumber: string) => {
    setDeleteDialog({ isOpen: true, orderNumber, orderId });
  };

  const handleDeleteConfirm = async () => {
    try {
      await deletePurchaseOrder(deleteDialog.orderId);
      setDeleteDialog({ isOpen: false, orderNumber: "", orderId: "" });
      toast.success("Purchase order deleted successfully");
    } catch {}
  };

  useEffect(() => {
    if (isError) {
      toast.error("Failed to delete purchase order!");
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
      <div className="mb-1">
        <h1 className="text-2xl font-bold">Purchase Orders</h1>
      </div>
      <div className="flex justify-end mb-6">
        <Button>
          <Link
            className="w-full flex items-center"
            href={`/purchase-orders/create`}
          >
            <IconPlus className="mr-2" />
            Create new purchase order
          </Link>
        </Button>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-bold">Order Number</TableHead>
              <TableHead className="font-bold">Created By</TableHead>
              <TableHead className="font-bold">Supplier Name</TableHead>
              <TableHead className="font-bold">Expected Date</TableHead>
              <TableHead className="font-bold">Line Count</TableHead>
              <TableHead className="font-bold text-center">Status</TableHead>
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
                </TableRow>
              ))
            ) : data?.data?.length ? (
              data.data.map((purchaseOrder) => (
                <TableRow key={purchaseOrder.id}>
                  <TableCell className="font-medium">
                    <Link href={`/purchase-orders/update/${purchaseOrder.id}`}>
                      {purchaseOrder.orderNumber}
                    </Link>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {`${purchaseOrder.createdBy?.firstName} ${purchaseOrder.createdBy?.lastName}`}
                  </TableCell>
                  <TableCell>{purchaseOrder.supplier.name || "-"}</TableCell>
                  <TableCell>
                    {purchaseOrder.expectedDeliveryDate
                      ? format(
                          new Date(purchaseOrder.expectedDeliveryDate),
                          "yyyy-MM-dd",
                        )
                      : "-"}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {purchaseOrder._count?.lines ?? "-"}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-center">
                    <Badge className={getStatusColor(purchaseOrder.status)}>
                      {getStatusText(purchaseOrder.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2 justify-center">
                      <Button variant="ghost" size="sm" asChild>
                        <Link
                          href={`/purchase-orders/update/${purchaseOrder.id}`}
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          handleDeleteClick(
                            purchaseOrder.id,
                            purchaseOrder.orderNumber,
                          )
                        }
                        disabled={
                          isPending || purchaseOrder.status !== "CREATED"
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
                  No purchase orders found
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
            {Math.min(page * limit, data.total)} of {data.total} purchase orders
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
          setDeleteDialog({ isOpen: false, orderNumber: "", orderId: "" })
        }
        isLoading={false}
        onConfirm={handleDeleteConfirm}
        title="Delete Purchase Order"
        description={`Are you sure you want to delete "${deleteDialog.orderNumber}"? This action cannot be undone.`}
      />
    </div>
  );
};

export default PurchaseOrdersPage;
