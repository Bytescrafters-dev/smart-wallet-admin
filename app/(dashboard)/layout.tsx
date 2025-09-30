import { ReactNode } from "react";
import { AppSidebar } from "@/components/app-sidebar";

import PermissionProvider from "@/contexts/permissionsProvider";
import { getAppBaseUrl } from "@/lib/base-url";
import { cookies } from "next/headers";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { SiteHeader } from "@/components/site-header";

const DashboardLayout = async ({ children }: { children: ReactNode }) => {
  const cookieHeader = (await cookies()).toString();
  const base = await getAppBaseUrl();
  const res = await fetch(`${base}/api/me`, {
    headers: { cookie: cookieHeader },
    cache: "no-store",
  });

  const { perms = [], user = null } = res.ok ? await res.json() : {};

  return (
    <PermissionProvider initialPerms={perms} user={user}>
      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)",
          } as React.CSSProperties
        }
      >
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader />
          {children}
        </SidebarInset>
      </SidebarProvider>
    </PermissionProvider>
  );
};

export default DashboardLayout;
