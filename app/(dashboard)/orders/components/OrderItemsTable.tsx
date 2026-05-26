"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { OrderItem } from "@/types/order";

interface Props {
  items: OrderItem[];
  currency: string;
  canEdit?: boolean;
  onRemove: (variantId: string) => void;
  onUpdate: (variantId: string, updates: Pick<OrderItem, "quantity">) => void;
}

export const OrderItemsTable = ({
  items,
  currency,
  canEdit = true,
  onRemove,
  onUpdate,
}: Props) => {
  return (
    <div className="border rounded-md overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="font-semibold">Product</TableHead>
            <TableHead className="font-semibold">Variant</TableHead>
            <TableHead className="font-semibold">SKU</TableHead>
            <TableHead className="font-semibold w-28">Qty</TableHead>
            <TableHead className="font-semibold w-36">Unit Price</TableHead>
            <TableHead className="font-semibold w-26">Line Total</TableHead>
            {canEdit && <TableHead className="w-12" />}
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => {
            const lineTotal =
              item.pricePerUnit !== undefined
                ? (item.quantity * item.pricePerUnit).toFixed(2)
                : null;

            return (
              <TableRow key={item.variantId}>
                <TableCell className="font-medium">
                  {item.productTitle}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {item.variantTitle}
                </TableCell>
                <TableCell className="text-muted-foreground font-mono text-xs">
                  {item.sku}
                </TableCell>
                <TableCell>
                  {canEdit ? (
                    <Input
                      type="number"
                      min={1}
                      value={item.quantity}
                      className="h-8 w-20"
                      onChange={(e) =>
                        onUpdate(item.variantId, {
                          quantity: Math.max(1, parseInt(e.target.value) || 1),
                        })
                      }
                    />
                  ) : (
                    item.quantity
                  )}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {item.pricePerUnit !== undefined
                    ? `${currency} ${item.pricePerUnit.toFixed(2)}`
                    : "—"}
                </TableCell>
                <TableCell className="text-right pr-4 text-muted-foreground">
                  {lineTotal !== null ? `${currency} ${lineTotal}` : "—"}
                </TableCell>
                {canEdit && (
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                      onClick={() => onRemove(item.variantId)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};
