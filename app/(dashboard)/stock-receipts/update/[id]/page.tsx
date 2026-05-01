"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft } from "lucide-react";
import { toast } from "sonner";
import {
  OrderLine,
  OrderLinesTable,
  ParentComponent,
} from "../../components/OrderLinesTable";
import { OrderDetailsForm } from "../../components/OrderDetailsForm";

import { Skeleton } from "@/components/ui/skeleton";
import { useStockReceipt } from "@/hooks/useStockReceipts";

const UpdateStockReceiptPage = () => {
  const router = useRouter();
  const params = useParams();
  const stockReceiptId = params.id as string;

  const [lines, setLines] = useState<OrderLine[]>([]);

  const {
    data: stockReceipt,
    isLoading: stockReceiptLoading,
    isError: stockReceiptError,
  } = useStockReceipt(stockReceiptId);

  useEffect(() => {
    if (stockReceipt) {
      setLines(
        stockReceipt.lines.map((l) => ({
          lineId: l.id,
          variantId: l.variantId,
          productTitle: l.variant.product.title,
          variantTitle: l.variant.title,
          sku: l.variant.sku,
          qty: l.qty,
          costPerUnit: l.costPerUnit ?? undefined,
        })),
      );
    }
  }, [stockReceipt]);

  useEffect(() => {
    if (stockReceiptError) {
      toast.error("Failed to fetch stock receipt!");
    }
  }, [stockReceiptError]);

  return (
    <div className="p-4 md:p-8">
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild className="-ml-2 mb-2">
          <Link href="/purchase-orders">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Stock Receipts
          </Link>
        </Button>
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">
            {stockReceiptLoading
              ? "Stock Receipt"
              : stockReceipt?.receiptNumber}
          </h1>
        </div>
      </div>

      <div className="space-y-6">
        {stockReceiptLoading ? (
          <Skeleton className="h-64 w-full rounded-xl" />
        ) : (
          <OrderDetailsForm
            currency={stockReceipt?.currency ?? ""}
            setCurrency={() => {}}
            invoiceRef={stockReceipt?.invoiceRef ?? ""}
            note={stockReceipt?.note ?? ""}
            onInvoiceRefChange={() => {}}
            onNoteChange={() => {}}
            parentComponent={ParentComponent.UPDATE}
          />
        )}

        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Order Lines
              {stockReceipt && stockReceipt.lines.length > 0 && (
                <span className="ml-2 text-muted-foreground font-normal text-sm">
                  ({stockReceipt.lines.length}{" "}
                  {stockReceipt.lines.length === 1 ? "item" : "items"})
                </span>
              )}
            </CardTitle>
          </CardHeader>
          {stockReceiptLoading ? (
            <Skeleton className="h-64 w-full rounded-xl" />
          ) : (
            <CardContent className="space-y-4">
              {stockReceipt && stockReceipt.lines.length > 0 && (
                <OrderLinesTable
                  currency={stockReceipt?.currency}
                  lines={lines}
                  onRemove={() => {}}
                  onUpdate={() => {}}
                  parentComponent={ParentComponent.UPDATE}
                />
              )}
            </CardContent>
          )}
        </Card>

        <div className="flex justify-end gap-4 pb-8">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/purchase-orders")}
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UpdateStockReceiptPage;
