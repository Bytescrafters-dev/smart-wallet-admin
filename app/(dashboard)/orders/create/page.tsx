"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, Loader2Icon } from "lucide-react";
import { toast } from "sonner";
import { CustomerDetailsForm } from "../components/CustomerDetailsForm";
import { OrderItemsSearch } from "../components/OrderItemsSearch";
import { OrderItemsTable } from "../components/OrderItemsTable";
import { OrderSummary } from "../components/OrderSummary";
import { useCreateOrder } from "@/hooks/useOrders";
import { useCurrentStore } from "@/contexts/storeProvider";
import { CreateOrderInput, OrderItem, PaymentStatus } from "@/types/order";

const CreateOrderPage = () => {
  const router = useRouter();
  const currentStore = useCurrentStore();

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [shippingAddress1, setShippingAddress1] = useState("");
  const [shippingAddress2, setShippingAddress2] = useState("");
  const [shippingCity, setShippingCity] = useState("");
  const [shippingState, setShippingState] = useState("");
  const [shippingPostalCode, setShippingPostalCode] = useState("");
  const [shippingCountry, setShippingCountry] = useState("");
  const [items, setItems] = useState<OrderItem[]>([]);
  const [discount, setDiscount] = useState("");
  const [note, setNote] = useState("");
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>(
    PaymentStatus.UNPAID,
  );

  const { mutateAsync: createOrder, isPending, isError } = useCreateOrder();

  const handleCustomerChange = (field: string, value: string) => {
    const setters: Record<string, (v: string) => void> = {
      customerName: setCustomerName,
      customerPhone: setCustomerPhone,
      shippingAddress1: setShippingAddress1,
      shippingAddress2: setShippingAddress2,
      shippingCity: setShippingCity,
      shippingState: setShippingState,
      shippingPostalCode: setShippingPostalCode,
      shippingCountry: setShippingCountry,
    };
    setters[field]?.(value);
  };

  const handleAddItem = (item: OrderItem) => {
    setItems((prev) => {
      const existingIndex = prev.findIndex(
        (i) => i.variantId === item.variantId,
      );
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = item;
        return updated;
      }
      return [...prev, item];
    });
  };

  const handleRemoveItem = (variantId: string) => {
    setItems((prev) => prev.filter((i) => i.variantId !== variantId));
  };

  const handleUpdateItem = (
    variantId: string,
    updates: Pick<OrderItem, "quantity">,
  ) => {
    setItems((prev) =>
      prev.map((i) => (i.variantId === variantId ? { ...i, ...updates } : i)),
    );
  };

  const handleSubmit = async () => {
    if (items.length === 0) {
      toast.error("Add at least one product before creating the order.");
      return;
    }

    const orderInput: CreateOrderInput = {
      paymentStatus,
      items: items.map((i) => ({
        variantId: i.variantId,
        quantity: i.quantity,
      })),
      customerName: customerName || undefined,
      customerPhone: customerPhone || undefined,
      shippingAddress1: shippingAddress1 || undefined,
      shippingAddress2: shippingAddress2 || undefined,
      shippingCity: shippingCity || undefined,
      shippingState: shippingState || undefined,
      shippingPostalCode: shippingPostalCode || undefined,
      shippingCountry: shippingCountry || undefined,
      note: note || undefined,
    };

    await createOrder(orderInput);
    toast.success("Order created successfully!");
    router.push("/orders");
  };

  useEffect(() => {
    if (isError) {
      toast.error("Failed to create order!");
    }
  }, [isError]);

  const currency = currentStore?.defaultCurrency ?? "LKR";

  return (
    <div className="p-4 md:p-8">
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild className="-ml-2 mb-2">
          <Link href="/orders">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Orders
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Create Order</h1>
      </div>

      <div className="space-y-6">
        <CustomerDetailsForm
          customerName={customerName}
          customerPhone={customerPhone}
          shippingAddress1={shippingAddress1}
          shippingAddress2={shippingAddress2}
          shippingCity={shippingCity}
          shippingState={shippingState}
          shippingPostalCode={shippingPostalCode}
          shippingCountry={shippingCountry}
          onChange={handleCustomerChange}
        />

        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Order Items
              {items.length > 0 && (
                <span className="ml-2 text-muted-foreground font-normal text-sm">
                  ({items.length} {items.length === 1 ? "item" : "items"})
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <OrderItemsSearch items={items} onAddItem={handleAddItem} />
            {items.length > 0 ? (
              <OrderItemsTable
                currency={currency}
                items={items}
                onRemove={handleRemoveItem}
                onUpdate={handleUpdateItem}
              />
            ) : (
              <p className="text-sm text-muted-foreground text-center py-6 border rounded-md border-dashed">
                Search for a product above to add items.
              </p>
            )}
          </CardContent>
        </Card>

        <OrderSummary
          items={items}
          currency={currency}
          discount={discount}
          note={note}
          paymentStatus={paymentStatus}
          onDiscountChange={setDiscount}
          onNoteChange={setNote}
          onPaymentStatusChange={setPaymentStatus}
        />

        <div className="flex justify-end gap-4 pb-8">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/orders")}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={items.length === 0 || isPending}
          >
            {isPending && <Loader2Icon className="animate-spin" />}
            {isPending ? "Creating..." : "Create Order"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateOrderPage;
