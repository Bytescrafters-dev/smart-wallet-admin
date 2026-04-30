"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Search, X, Building2, Phone, Mail, MapPin } from "lucide-react";
import { Supplier } from "@/types/supplier";
import { useSuppliers } from "@/hooks/useSuppliers";
import { PurchaseOrderStatus } from "@/types/purchaseOrder";

interface Props {
  selected: Supplier | null;
  onSelect: (supplier: Supplier | null) => void;
  orderStatus?: string;
}

export const SupplierSelector = ({
  selected,
  onSelect,
  orderStatus = PurchaseOrderStatus.UNRESOLVED,
}: Props) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const isEditable =
    orderStatus === PurchaseOrderStatus.UNRESOLVED ||
    orderStatus === PurchaseOrderStatus.CREATED;

  const { data, isLoading, isError } = useSuppliers({ limit: 100 });

  const filtered = (data?.data ?? []).filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      (s.contactName ?? "").toLowerCase().includes(search.toLowerCase()),
  );

  const handleSelect = (supplier: Supplier) => {
    onSelect(supplier);
    setOpen(false);
    setSearch("");
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) setSearch("");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Supplier</CardTitle>
      </CardHeader>
      <CardContent>
        {!selected && isEditable ? (
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={() => setOpen(true)}>
              <Search className="h-4 w-4 mr-2" />
              Select Supplier
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                <span className="font-semibold">{selected?.name || "-"}</span>
              </div>
              <div className="flex gap-1">
                {isEditable && (
                  <>
                    {" "}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto py-1 px-2 text-xs text-muted-foreground"
                      onClick={() => setOpen(true)}
                    >
                      Change
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto py-1 px-2 text-muted-foreground hover:text-destructive"
                      onClick={() => onSelect(null)}
                    >
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground pl-6">
              {selected?.contactName && (
                <span>Contact: {selected.contactName}</span>
              )}
              {selected?.contactPhone && (
                <span className="flex items-center gap-1.5">
                  <Phone className="h-3 w-3 shrink-0" />
                  {selected.contactPhone}
                </span>
              )}
              {selected?.contactEmail && (
                <span className="flex items-center gap-1.5">
                  <Mail className="h-3 w-3 shrink-0" />
                  {selected.contactEmail}
                </span>
              )}
              {(selected?.address1 || selected?.city || selected?.country) && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-3 w-3 shrink-0" />
                  {[selected.address1, selected.city, selected.country]
                    .filter(Boolean)
                    .join(", ")}
                </span>
              )}
            </div>

            {selected?.notes && (
              <p className="text-xs text-muted-foreground pl-6 italic">
                {selected.notes}
              </p>
            )}
          </div>
        )}
      </CardContent>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Select Supplier</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or contact..."
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                autoFocus
              />
            </div>
            <div className="max-h-64 overflow-y-auto space-y-0.5">
              {isLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="px-3 py-2.5 space-y-1.5">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-3 w-56" />
                  </div>
                ))
              ) : isError ? (
                <p className="text-sm text-destructive text-center py-6">
                  Failed to load suppliers
                </p>
              ) : filtered.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-6">
                  No suppliers found
                </p>
              ) : (
                filtered.map((supplier) => (
                  <button
                    key={supplier.id}
                    type="button"
                    className="w-full text-left px-3 py-2.5 rounded-md hover:bg-muted transition-colors"
                    onClick={() => handleSelect(supplier)}
                  >
                    <div className="font-medium text-sm">{supplier.name}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {[supplier.contactName, supplier.city, supplier.country]
                        .filter(Boolean)
                        .join(" · ")}
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};
