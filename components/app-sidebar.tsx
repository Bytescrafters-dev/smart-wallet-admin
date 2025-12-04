"use client";

import React from "react";
import {
  IconChartBar,
  IconDashboard,
  IconFolder,
  IconListDetails,
  IconUsers,
  IconBallVolleyball,
} from "@tabler/icons-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const navMain = [
  {
    title: "Dashboard",
    url: "/",
    icon: IconDashboard,
    collapsible: false,
    items: [],
  },
  {
    title: "Product Categories",
    url: "/product-categories",
    icon: IconListDetails,
    collapsible: true,
    items: [
      { title: "View Product Categories", url: "/product-categories" },
      { title: "Add Product Category", url: "/product-categories/create" },
    ],
  },
  {
    title: "Products",
    url: "/products",
    icon: IconBallVolleyball,
    collapsible: true,
    items: [
      { title: "View Products", url: "/products" },
      { title: "Add Product", url: "/products/create" },
    ],
  },
  {
    title: "Platform Admins",
    url: "#",
    icon: IconChartBar,
    collapsible: false,
    items: [],
  },
  {
    title: "Tenants",
    url: "#",
    icon: IconFolder,
    collapsible: false,
    items: [],
  },
  {
    title: "Billing",
    url: "#",
    icon: IconUsers,
    collapsible: false,
    items: [],
  },
  {
    title: "Reports",
    url: "#",
    icon: IconUsers,
    collapsible: false,
    items: [],
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <span className="text-xl font-semibold">Smart Wallets</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
