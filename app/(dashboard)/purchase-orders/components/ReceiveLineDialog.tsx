"use client";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2Icon } from "lucide-react";
import { OrderLine } from "./OrderLinesTable";

interface Props {
  line: OrderLine | null;
  currency: string;
  open: boolean;
  onClose: () => void;
  onConfirm: (
    lineId: string,
    receivedQty: number,
    costPerUnit: number,
  ) => Promise<void>;
}

export const ReceiveLineDialog = ({
  line,
  currency,
  open,
  onClose,
  onConfirm,
}: Props) => {
  const [receivedQty, setReceivedQty] = useState("");
  const [costPerUnit, setCostPerUnit] = useState("");
  const [isPending, setIsPending] = useState(false);

  const alreadyReceived = line?.receivedQty ?? 0;
  const remaining = line ? line.orderedQty - alreadyReceived : 0;

  const qtyNum = parseInt(receivedQty);
  const costNum = parseFloat(costPerUnit);
  const valid =
    qtyNum >= 1 &&
    qtyNum <= remaining &&
    costNum > 0 &&
    !isNaN(costNum);

  useEffect(() => {
    if (open) {
      setReceivedQty("");
      setCostPerUnit(line?.costPerUnit?.toString() ?? "");
    }
  }, [open, line]);

  const handleConfirm = async () => {
    if (!line?.lineId || !valid) return;
    setIsPending(true);
    try {
      await onConfirm(line.lineId, qtyNum, costNum);
      onClose();
    } finally {
      setIsPending(false);
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Receive Items</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-md bg-muted/40 px-4 py-3 text-sm space-y-1">
            <p className="font-medium">{line?.productTitle}</p>
            <p className="text-muted-foreground">
              {line?.variantTitle} · {line?.sku}
            </p>
            <div className="flex gap-4 mt-2 text-xs">
              <span>
                Ordered:{" "}
                <span className="font-medium">{line?.orderedQty}</span>
              </span>
              <span>
                Received:{" "}
                <span className="font-medium">{alreadyReceived}</span>
              </span>
              <span>
                Remaining:{" "}
                <span className="font-medium text-primary">{remaining}</span>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="receivedQty">
                Receiving Qty{" "}
                <span className="text-destructive">*</span>
              </Label>
              <Input
                id="receivedQty"
                type="number"
                min={1}
                max={remaining}
                placeholder={`Max ${remaining}`}
                value={receivedQty}
                onChange={(e) => setReceivedQty(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="costPerUnit">
                Cost / Unit ({currency}){" "}
                <span className="text-destructive">*</span>
              </Label>
              <Input
                id="costPerUnit"
                type="number"
                min={0}
                step="0.01"
                placeholder="0.00"
                value={costPerUnit}
                onChange={(e) => setCostPerUnit(e.target.value)}
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isPending}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={!valid || isPending}>
            {isPending && <Loader2Icon className="h-4 w-4 animate-spin mr-1" />}
            {isPending ? "Receiving..." : "Confirm Receive"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
