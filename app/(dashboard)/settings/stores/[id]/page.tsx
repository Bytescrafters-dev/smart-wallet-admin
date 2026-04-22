"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Store } from "@/types/store";
import { SETTINGS } from "@/shared/constants/pageUrls";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { StoreGeneralTab } from "./components/store-general-tab";
import { useStore, useUpdateStore } from "@/hooks/useStores";
import { toast } from "sonner";

export default function StoreDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: store, isLoading, isError } = useStore(id);
  const { updateStore, isUpdating, isUpdatingError } = useUpdateStore();

  if (!store) {
    return (
      <div className="p-4 md:p-8">
        <p className="text-muted-foreground">Store not found.</p>
      </div>
    );
  }

  const handleSave = async (updated: Partial<Store>) => {
    try {
      const updatedtore = {
        name: updated.name,
        domain: updated.domain ?? null,
        defaultCurrency: updated.defaultCurrency,
        timezone: updated.timezone ?? null,
        supportEmail: updated.supportEmail ?? null,
      };
      await updateStore({ id, data: updatedtore });
      toast.success("Store updated successfully");
    } catch {}
  };

  useEffect(() => {
    if (isUpdatingError) {
      toast.error("Failed to update store!");
    }
  }, [isUpdatingError]);

  return (
    <div className="p-4 md:p-8 space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href={SETTINGS}>Settings</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{store.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="flex items-center gap-3">
        {/* <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ChevronLeft className="h-4 w-4" />
        </Button> */}
        <h1 className="text-2xl font-semibold">{store.name}</h1>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="general">
        <TabsList className="w-full">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="warehouses">Warehouses</TabsTrigger>
          <TabsTrigger value="regions">Regions</TabsTrigger>
          <TabsTrigger value="shipping">Shipping</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-6">
          <StoreGeneralTab
            store={store}
            onSave={handleSave}
            isUpdating={isUpdating}
          />
        </TabsContent>

        <TabsContent value="warehouses" className="mt-6">
          <p className="text-muted-foreground text-sm">
            Warehouse management coming soon.
          </p>
        </TabsContent>

        <TabsContent value="regions" className="mt-6">
          <p className="text-muted-foreground text-sm">
            Region management coming soon.
          </p>
        </TabsContent>

        <TabsContent value="shipping" className="mt-6">
          <p className="text-muted-foreground text-sm">
            Shipping profile management coming soon.
          </p>
        </TabsContent>
      </Tabs>
    </div>
  );
}
