"use client";
import { createContext, useContext, useMemo } from "react";

type Ctx = { perms: Set<string>; user: any | null };
const PermissionsCtx = createContext<Ctx>({ perms: new Set(), user: null });

const PermissionProvider = ({
  initialPerms,
  user,
  children,
}: {
  initialPerms: string[];
  user: any;
  children: React.ReactNode;
}) => {
  const value = useMemo(
    () => ({ perms: new Set(initialPerms), user }),
    [initialPerms.join("|"), user]
  );

  return (
    <PermissionsCtx.Provider value={value}>{children}</PermissionsCtx.Provider>
  );
};

export default PermissionProvider;

export const useHasPermission = (key: string) => {
  const { perms } = useContext(PermissionsCtx);
  return perms.has(key);
};

export const useHasAny = (keys: string[]) => {
  const { perms } = useContext(PermissionsCtx);
  return keys.some((k) => perms.has(k));
};

export const useUser = () => {
  return useContext(PermissionsCtx).user;
};

export const getPermissions = () => {
  const { perms } = useContext(PermissionsCtx);
  return perms;
};
