"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { Store } from "@/types/store";
import { useStores } from "@/hooks/useStores";

type StoreContext = {
  currentStore: Store | null;
  setCurrentStore: (store: Store) => void;
};

const StoreCtx = createContext<StoreContext>({
  currentStore: null,
  setCurrentStore: () => {},
});

const StoreProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: stores } = useStores();
  const [currentStore, setCurrentStore] = useState<Store | null>(null);

  useEffect(() => {
    if (stores?.length && !currentStore) {
      setCurrentStore(stores[0]); // Option A: Set first store as default
    }
  }, [stores, currentStore]);

  return (
    <StoreCtx.Provider value={{ currentStore, setCurrentStore }}>
      {children}
    </StoreCtx.Provider>
  );
};

export default StoreProvider;

export const useCurrentStore = () => useContext(StoreCtx).currentStore;
export const useSetCurrentStore = () => useContext(StoreCtx).setCurrentStore;
export { useStores } from "@/hooks/useStores";