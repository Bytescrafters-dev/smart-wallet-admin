"use client";

import { Suspense, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { ChevronDown, ChevronLeft, Edit, Trash2 } from "lucide-react";
import { IconPlus } from "@tabler/icons-react";
import { useStaffMembers } from "@/hooks/useStaff";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { StaffFilters } from "./components/staffFilters";
import { StaffMember } from "@/types/staff";
import { cn } from "@/lib/utils";

const LIMIT = 10;

const ROLE_VARIANT: Record<
  string,
  "default" | "secondary" | "outline" | "destructive"
> = {
  OWNER: "default",
  MANAGER: "secondary",
  VIEWER: "outline",
};

const getRoleName = (role: string) => {
  switch (role) {
    case "OWNER":
      return "Owner";
    case "MANAGER":
      return "Manager";
    case "VIEWER":
      return "Staff";
  }
};

function StoresPanel({ staff }: { staff: StaffMember }) {
  if (!staff.adminStores.length) {
    return (
      <p className="text-sm text-muted-foreground">No store assignments.</p>
    );
  }
  return (
    <div className="flex flex-wrap gap-2">
      {staff.adminStores.map(({ role, store }) => (
        <div
          key={store.id}
          className="flex items-center gap-2 border rounded-md px-3 py-1.5 bg-muted/30"
        >
          <span className="text-sm font-medium">{store.name}</span>
          <Badge variant={ROLE_VARIANT[role] ?? "outline"} className="text-xs">
            {getRoleName(role)}
          </Badge>
        </div>
      ))}
    </div>
  );
}

const StaffPageContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const page = Math.max(1, Number(searchParams.get("page") ?? "1"));
  const q = searchParams.get("q") ?? undefined;

  const { data, isLoading, isError } = useStaffMembers({
    page,
    limit: LIMIT,
    q,
  });

  const setPage = (next: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", next.toString());
    router.replace(`${pathname}?${params.toString()}`);
  };

  const toggleExpand = (id: string) =>
    setExpandedId((prev) => (prev === id ? null : id));

  if (isError) {
    return (
      <div className="text-destructive text-sm py-8 text-center">
        Failed to load staff members.
      </div>
    );
  }

  return (
    <>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-bold">First Name</TableHead>
              <TableHead className="font-bold">Last Name</TableHead>
              <TableHead className="font-bold">Email</TableHead>
              <TableHead className="font-bold">Contact Number</TableHead>
              <TableHead className="font-bold">Status</TableHead>
              <TableHead className="font-bold">Stores</TableHead>
              <TableHead className="font-bold text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: LIMIT }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 7 }).map((__, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-4 w-16" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : data?.data?.length ? (
              data.data.map((staff) => {
                const isExpanded = expandedId === staff.id;
                const storeCount = staff.adminStores.length;
                return (
                  <>
                    <TableRow
                      key={staff.id}
                      className={cn(isExpanded && "border-b-0")}
                    >
                      <TableCell className="font-medium">
                        {staff.firstName}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {staff.lastName || "-"}
                      </TableCell>
                      <TableCell>{staff.email}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {staff.phone || "-"}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={`${staff.mustChangePassword ? "bg-yellow-500" : "bg-green-500"}`}
                        >
                          {staff.mustChangePassword ? "Pending" : "Active"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="gap-1.5 text-muted-foreground hover:text-foreground"
                          onClick={() => toggleExpand(staff.id)}
                          disabled={storeCount === 0}
                        >
                          <span className="text-sm">
                            {storeCount} {storeCount === 1 ? "store" : "stores"}
                          </span>
                          <ChevronDown
                            className={cn(
                              "h-3.5 w-3.5 transition-transform duration-200",
                              isExpanded && "rotate-180",
                            )}
                          />
                        </Button>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2 justify-center">
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => {}}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>

                    {isExpanded && (
                      <TableRow
                        key={`${staff.id}-stores`}
                        className="bg-muted/20 hover:bg-muted/20"
                      >
                        <TableCell colSpan={7} className="py-3 px-6">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                              Store Assignments
                            </span>
                          </div>
                          <StoresPanel staff={staff} />
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center text-muted-foreground"
                >
                  No staff members found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {data && data.total > LIMIT && (
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-muted-foreground">
            Showing {(page - 1) * LIMIT + 1} to{" "}
            {Math.min(page * LIMIT, data.total)} of {data.total} staff members
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page + 1)}
              disabled={page * LIMIT >= data.total}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default function StaffPage() {
  return (
    <div className="p-4 md:p-8">
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild className="-ml-2 mb-2">
          <Link href="/settings">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Settings
          </Link>
        </Button>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Staff Members</h1>
          <Button asChild size="sm">
            <Link href="/settings/staff/create">
              <IconPlus className="mr-2" />
              Create Staff
            </Link>
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <Suspense fallback={<Skeleton className="h-20 w-full" />}>
          <StaffFilters />
        </Suspense>

        <Suspense fallback={<Skeleton className="h-64 w-full rounded-lg" />}>
          <StaffPageContent />
        </Suspense>
      </div>
    </div>
  );
}
