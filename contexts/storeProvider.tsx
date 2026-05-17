"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { Store } from "@/types/store";
import { useStores } from "@/hooks/useStores";

const STORE_KEY = "selected_store_id";

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
  const [currentStore, setCurrentStoreState] = useState<Store | null>(null);

  useEffect(() => {
    if (!stores?.length || currentStore) return;
    const savedId = localStorage.getItem(STORE_KEY);
    const saved = savedId ? stores.find((s) => s.id === savedId) : null;
    setCurrentStoreState(saved ?? stores[0]);
  }, [stores, currentStore]);

  const setCurrentStore = (store: Store) => {
    localStorage.setItem(STORE_KEY, store.id);
    setCurrentStoreState(store);
  };

  return (
    <StoreCtx.Provider value={{ currentStore, setCurrentStore }}>
      {children}
    </StoreCtx.Provider>
  );
};

export default StoreProvider;

export const useCurrentStore = () => useContext(StoreCtx).currentStore;
export const useSetCurrentStore = () => useContext(StoreCtx).setCurrentStore;
