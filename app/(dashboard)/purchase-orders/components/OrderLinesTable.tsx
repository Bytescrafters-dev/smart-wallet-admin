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
import { PurchaseOrderStatus } from "@/types/purchaseOrder";

export interface OrderLine {
  lineId?: string;
  variantId: string;
  productTitle: string;
  variantTitle: string;
  sku: string;
  orderedQty: number;
  costPerUnit?: number;
  receivedQty?: number;
}

interface Props {
  lines: OrderLine[];
  onRemove: (variantId: string) => void;
  onUpdate: (
    variantId: string,
    updates: Partial<Pick<OrderLine, "orderedQty" | "costPerUnit">>,
  ) => void;
  parentComponent?: string;
  orderStatus?: string;
  currency: string;
}

export const ParentComponent = {
  CREATE: "CREATE",
  UPDATE: "UPDATE",
};

export const OrderLinesTable = ({
  lines,
  onRemove,
  onUpdate,
  currency,
  parentComponent = ParentComponent.CREATE,
  orderStatus = PurchaseOrderStatus.UNRESOLVED,
}: Props) => {
  const editable =
    orderStatus === PurchaseOrderStatus.UNRESOLVED ||
    orderStatus === PurchaseOrderStatus.CREATED;

  const limitedlyEditable =
    orderStatus === PurchaseOrderStatus.UNRESOLVED ||
    orderStatus === PurchaseOrderStatus.CREATED ||
    orderStatus === PurchaseOrderStatus.PARTIALLY_RECEIVED;

  const total = lines.reduce((sum, line) => {
    if (line.costPerUnit !== undefined) {
      return sum + line.orderedQty * line.costPerUnit;
    }
    return sum;
  }, 0);

  const hasAnyCost = lines.some((l) => l.costPerUnit !== undefined);

  return (
    <div className="border rounded-md overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="font-semibold">Product</TableHead>
            <TableHead className="font-semibold">Variant</TableHead>
            <TableHead className="font-semibold">SKU</TableHead>
            <TableHead className="font-semibold w-24">Ordered Qty</TableHead>
            {parentComponent === ParentComponent.UPDATE && (
              <TableHead className="font-semibold w-24">Received Qty</TableHead>
            )}
            <TableHead className="font-semibold w-64">Cost / Unit</TableHead>
            <TableHead className="font-semibold w-28">Line Total</TableHead>
            <TableHead className="w-32" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {lines.map((line) => {
            const lineTotal =
              line.costPerUnit !== undefined
                ? (line.orderedQty * line.costPerUnit).toFixed(2)
                : null;

            return (
              <TableRow key={line.variantId}>
                <TableCell className="font-medium">
                  {line.productTitle}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {line.variantTitle}
                </TableCell>
                <TableCell className="text-muted-foreground font-mono text-xs">
                  {line.sku}
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    min={1}
                    value={line.orderedQty}
                    className="h-8 w-20"
                    disabled={!editable}
                    onChange={(e) =>
                      onUpdate(line.variantId, {
                        orderedQty: Math.max(1, parseInt(e.target.value) || 1),
                      })
                    }
                  />
                </TableCell>
                <TableCell className="text-center">
                  {line.receivedQty ?? "-"}
                </TableCell>
                <TableCell className="flex items-center gap-1">
                  <Input
                    type="number"
                    min={0}
                    step="0.01"
                    value={line.costPerUnit ?? ""}
                    placeholder="—"
                    className="h-8 w-28"
                    onChange={(e) =>
                      onUpdate(line.variantId, {
                        costPerUnit: e.target.value
                          ? parseFloat(e.target.value)
                          : undefined,
                      })
                    }
                    disabled={!limitedlyEditable}
                  />
                </TableCell>
                <TableCell className="text-right pr-4 text-muted-foreground">
                  {lineTotal !== null ? `${currency} ${lineTotal}` : "—"}
                </TableCell>
                <TableCell className="flex items-center gap-1">
                  <Button
                    variant="default"
                    size="sm"
                    className="px-2 text-white hover:text-destructive"
                    onClick={() => {}}
                  >
                    Receive
                  </Button>

                  {!(line.receivedQty && line.receivedQty > 0) && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                      onClick={() => onRemove(line.variantId)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {hasAnyCost && (
        <div className="flex justify-end px-4 py-3 border-t bg-muted/30">
          <span className="text-sm font-semibold">
            {`Order Total: ${currency} ${total.toFixed(2)}`}
          </span>
        </div>
      )}
    </div>
  );
};
