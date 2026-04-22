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

const Settings = () => {
  const currentStore = useCurrentStore();
  const setCurrentStore = useSetCurrentStore();
  const { data, isLoading, isError } = useStores();

  useEffect(() => {
    if (isError) toast.error("Failed to fetch stores!");
  }, [isError]);

  return (
    <div className="p-4 md:p-8">
      <div className="flex items-end justify-between mb-6">
        <h1 className="text-2xl font-semibold">Settings</h1>
        <Button asChild>
          <Link href="/settings/stores/create">Create Store</Link>
        </Button>
      </div>

      <div className="space-y-4 w-full">
        <h2 className="text-lg font-medium">Stores</h2>
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
                      <Button size="sm" asChild>
                        <Link href={SETTINGS_STORE(store.id)}>Manage</Link>
                      </Button>
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
