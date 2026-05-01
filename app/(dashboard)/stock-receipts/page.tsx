"use client";
import { useState } from "react";
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
import { Edit } from "lucide-react";
import { IconPlus } from "@tabler/icons-react";
import { useStockReceipts } from "@/hooks/useStockReceipts";

const StockReceiptsPage = () => {
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading, error } = useStockReceipts({ page, limit });

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
        <h1 className="text-2xl font-bold">Stock Receipts</h1>
      </div>
      <div className="flex justify-end mb-6">
        <Button>
          <Link
            className="w-full flex items-center"
            href={`/stock-receipts/create`}
          >
            <IconPlus className="mr-2" />
            Create new stock receipts
          </Link>
        </Button>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-bold">Receipt Number</TableHead>
              <TableHead className="font-bold">Created By</TableHead>
              <TableHead className="font-bold">Created At</TableHead>
              <TableHead className="font-bold">Line Count</TableHead>
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
                    <Skeleton className="h-4 w-24" />
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
              data.data.map((stockReceipt) => (
                <TableRow key={stockReceipt.id}>
                  <TableCell className="font-medium">
                    <Link href={`/stock-receipts/update/${stockReceipt.id}`}>
                      {stockReceipt.receiptNumber}
                    </Link>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {`${stockReceipt.createdBy?.firstName} ${stockReceipt.createdBy?.lastName}`}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {format(new Date(stockReceipt.createdAt), "yyyy-MM-dd")}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {stockReceipt._count?.lines ?? "-"}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2 justify-center">
                      <Button variant="ghost" size="sm" asChild>
                        <Link
                          href={`/stock-receipts/update/${stockReceipt.id}`}
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
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
                  No stock receipts found
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
            {Math.min(page * limit, data.total)} of {data.total} stock receipts
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
    </div>
  );
};

export default StockReceiptsPage;
