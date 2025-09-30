"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import {
  DASHBOARD,
  USER_ROLES_ADD,
  USER_ROLES_VIEW,
} from "@/shared/constants/pageUrls";
import { BellRing } from "lucide-react";

const resolvePageHeader = (pathname: string) => {
  switch (pathname) {
    case DASHBOARD:
      return "Dashboard";
    case USER_ROLES_ADD:
      return "Add User Role";
    case USER_ROLES_VIEW:
      return "View User Role";
    default:
      return "Dashboard";
  }
};

export function SiteHeader() {
  const pathname = usePathname();
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">{resolvePageHeader(pathname)}</h1>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="ghost" asChild size="sm" className="hidden sm:flex">
            <BellRing />
          </Button>
        </div>
      </div>
    </header>
  );
}
