"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, Loader2Icon } from "lucide-react";
import { toast } from "sonner";
import { SupplierSelector } from "../components/SupplierSelector";
import { Supplier } from "@/types/supplier";
import { ProductSearch } from "../components/ProductSearch";
import { OrderLinesTable, OrderLine } from "../components/OrderLinesTable";
import { OrderDetailsForm } from "../components/OrderDetailsForm";
import {
  CreatePurchaseOrderInput,
  useCreatePurchaseOrder,
} from "@/hooks/usePurchaseOrders";
import { useCurrentStore } from "@/contexts/storeProvider";

const CreatePurchaseOrderPage = () => {
  const router = useRouter();
  const currentStore = useCurrentStore();

  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(
    null,
  );
  const [currency, setCurrency] = useState("");
  const [lines, setLines] = useState<OrderLine[]>([]);
  const [invoiceRef, setInvoiceRef] = useState("");
  const [note, setNote] = useState("");
  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState<
    Date | undefined
  >(undefined);
  const {
    mutateAsync: createPurchaseOrder,
    isPending,
    isError,
  } = useCreatePurchaseOrder();

  useEffect(() => {
    if (currentStore?.defaultCurrency)
      setCurrency(currentStore.defaultCurrency);
  }, [currentStore]);

  const handleAddLine = (line: OrderLine) => {
    setLines((prev) => {
      const existingIndex = prev.findIndex(
        (l) => l.variantId === line.variantId,
      );
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = line;
        return updated;
      }
      return [...prev, line];
    });
  };

  const handleRemoveLine = (variantId: string) => {
    setLines((prev) => prev.filter((l) => l.variantId !== variantId));
  };

  const handleUpdateLine = (
    variantId: string,
    updates: Partial<Pick<OrderLine, "orderedQty" | "costPerUnit">>,
  ) => {
    setLines((prev) =>
      prev.map((l) => (l.variantId === variantId ? { ...l, ...updates } : l)),
    );
  };

  const handleSubmit = async () => {
    if (lines.length === 0) {
      toast.error("Add at least one product line before creating the order.");
      return;
    }
    const purchaseOrderInput: CreatePurchaseOrderInput = {
      supplierId: selectedSupplier?.id,
      invoiceRef,
      note,
      expectedDeliveryDate: expectedDeliveryDate?.toISOString(),
      currency,
      lines: lines.map((l) => ({
        variantId: l.variantId,
        orderedQty: l.orderedQty,
        costPerUnit: l.costPerUnit ?? undefined,
      })),
    };

    await createPurchaseOrder(purchaseOrderInput);
    toast.success("Purchase order created successfully!");
    router.push("/purchase-orders");
  };

  useEffect(() => {
    if (isError) {
      toast.error("Failed to create purchase order!");
    }
  }, [isError]);

  return (
    <div className="p-4 md:p-8">
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild className="-ml-2 mb-2">
          <Link href="/purchase-orders">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Purchase Orders
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Create Purchase Order</h1>
      </div>

      <div className="space-y-6">
        {/* Section 1: Supplier */}
        <SupplierSelector
          selected={selectedSupplier}
          onSelect={setSelectedSupplier}
        />

        <OrderDetailsForm
          invoiceRef={invoiceRef}
          note={note}
          expectedDeliveryDate={expectedDeliveryDate}
          currency={currency}
          setCurrency={setCurrency}
          onInvoiceRefChange={setInvoiceRef}
          onNoteChange={setNote}
          onExpectedDeliveryDateChange={setExpectedDeliveryDate}
        />

        {/* Section 2: Order Lines */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Order Lines
              {lines.length > 0 && (
                <span className="ml-2 text-muted-foreground font-normal text-sm">
                  ({lines.length} {lines.length === 1 ? "item" : "items"})
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ProductSearch lines={lines} onAddLine={handleAddLine} />

            {lines.length > 0 ? (
              <OrderLinesTable
                currency={currency}
                lines={lines}
                onRemove={handleRemoveLine}
                onUpdate={handleUpdateLine}
              />
            ) : (
              <p className="text-sm text-muted-foreground text-center py-6 border rounded-md border-dashed">
                Search for a product above to add order lines.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Footer Actions */}
        <div className="flex justify-end gap-4 pb-8">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/purchase-orders")}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={lines.length === 0 || isPending}
          >
            {isPending && <Loader2Icon className="animate-spin" />}
            {isPending ? "Creating..." : "Create Purchase Order"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreatePurchaseOrderPage;
