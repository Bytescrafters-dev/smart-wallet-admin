"use client";

import { useCurrentStore, useSetCurrentStore } from "@/contexts/storeProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SETTINGS_STORE } from "@/shared/constants/pageUrls";
import Link from "next/link";
import { useStores } from "@/hooks/useStores";
import { useEffect } from "react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft } from "lucide-react";
import { usePermissions } from "@/hooks/auth/usePermissions";

const Settings = () => {
  const currentStore = useCurrentStore();
  const setCurrentStore = useSetCurrentStore();
  const { data, isLoading, isError } = useStores();
  const { canCreateStores, canEditStores } = usePermissions();

  useEffect(() => {
    if (isError) toast.error("Failed to fetch stores!");
  }, [isError]);

  console.log("permissoin", canCreateStores);

  return (
    <div className="p-4 md:p-8">
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild className="-ml-2 mb-2">
          <Link href="/settings">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Settings
          </Link>
        </Button>
        <div className="flex items-end justify-between">
          <h1 className="text-2xl font-semibold">Stores</h1>
          {canCreateStores && (
            <Button asChild>
              <Link href="/settings/stores/create">Create Store</Link>
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-4 w-full">
        {isLoading ? (
          <>
            <Skeleton className="h-50 w-full rounded-xl" />
            <Skeleton className="h-50 w-full rounded-xl" />
            <Skeleton className="h-50 w-full rounded-xl" />
          </>
        ) : data && data.length > 0 ? (
          data &&
          data.map((store) => {
            const isCurrent = currentStore?.id === store.id;
            return (
              <Card key={store.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2">
                      {store.name}
                      {isCurrent && <Badge variant="secondary">Current</Badge>}
                    </CardTitle>
                    <div className="flex gap-2">
                      {!isCurrent && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentStore(store)}
                        >
                          Set as Current
                        </Button>
                      )}
                      {canEditStores && (
                        <Button size="sm" asChild>
                          <Link href={SETTINGS_STORE(store.id)}>Manage</Link>
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>Slug: {store.slug}</p>
                    <p>Currency: {store.defaultCurrency}</p>
                    {store.domain && <p>Domain: {store.domain}</p>}
                  </div>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <p className="text-muted-foreground text-sm">
            No stores found. Create a new store to get started.
          </p>
        )}
      </div>
    </div>
  );
};

export default Settings;
