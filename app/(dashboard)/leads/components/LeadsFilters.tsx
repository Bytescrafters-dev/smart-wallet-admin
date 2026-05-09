"use client";
import { useEffect, useRef, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useDebounce } from "use-debounce";
import { format, parse, isValid } from "date-fns";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/common/DatePicker";
import { Search, X } from "lucide-react";
import { LEAD_STATUS, LEAD_CAMPAIGN } from "@/types/leads";

const STATUS_LABELS: Record<string, string> = {
  NEW: "New",
  CONTACTED: "Contacted",
  NO_ANSWER: "No Answer",
  INTERESTED: "Interested",
  ORDERED: "Ordered",
  NOT_INTERESTED: "Not Interested",
};

const SOURCE_LABELS: Record<string, string> = {
  FACEBOOK: "Facebook",
  INSTAGRAM: "Instagram",
  TIKTOK: "TikTok",
  WHATSAPP: "WhatsApp",
  GOOGLE: "Google",
  OTHER: "Other",
};

function parseDate(str: string | null): Date | undefined {
  if (!str) return undefined;
  const d = parse(str, "yyyy-MM-dd", new Date());
  return isValid(d) ? d : undefined;
}

export const LeadsFilters = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Keep a ref to the latest searchParams to avoid stale closure in effects
  const searchParamsRef = useRef(searchParams);
  searchParamsRef.current = searchParams;

  const [searchInput, setSearchInput] = useState(searchParams.get("q") ?? "");
  const [debouncedSearch] = useDebounce(searchInput, 300);
  const isFirstRender = useRef(true);

  const status = searchParams.get("status") ?? "";
  const source = searchParams.get("source") ?? "";
  const dateType = searchParams.get("dateType") ?? "createdAt";
  const dateFrom = parseDate(searchParams.get("dateFrom"));
  const dateTo = parseDate(searchParams.get("dateTo"));

  const hasActiveFilters = !!(
    searchParams.get("q") ||
    status ||
    source ||
    searchParams.get("dateFrom") ||
    searchParams.get("dateTo")
  );

  const updateParams = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParamsRef.current.toString());
    for (const [key, value] of Object.entries(updates)) {
      if (!value) params.delete(key);
      else params.set(key, value);
    }
    // Reset to page 1 on any filter change
    if (!("page" in updates)) params.delete("page");
    router.replace(`${pathname}?${params.toString()}`);
  };

  // Sync debounced search to URL (skip initial render to avoid overwriting URL on mount)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    updateParams({ q: debouncedSearch || null });
  }, [debouncedSearch]); // eslint-disable-line react-hooks/exhaustive-deps

  const clearAll = () => {
    setSearchInput("");
    router.replace(pathname);
  };

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name, email, or phone..."
          className="pl-9 pr-9"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        {searchInput && (
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            onClick={() => setSearchInput("")}
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2 items-center">
        <Select
          value={status}
          onValueChange={(v) =>
            updateParams({ status: v === "_all" ? null : v })
          }
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="_all">All Statuses</SelectItem>
            {Object.values(LEAD_STATUS).map((s) => (
              <SelectItem key={s} value={s}>
                {STATUS_LABELS[s] ?? s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={source}
          onValueChange={(v) =>
            updateParams({ source: v === "_all" ? null : v })
          }
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="All Sources" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="_all">All Sources</SelectItem>
            {Object.values(LEAD_CAMPAIGN).map((c) => (
              <SelectItem key={c} value={c}>
                {SOURCE_LABELS[c] ?? c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={dateType}
          onValueChange={(v) =>
            updateParams({ dateType: v, dateFrom: null, dateTo: null })
          }
        >
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="createdAt">Created At</SelectItem>
            <SelectItem value="followupDate">Follow-up Date</SelectItem>
          </SelectContent>
        </Select>

        <DatePicker
          value={dateFrom}
          onChange={(d) =>
            updateParams({ dateFrom: d ? format(d, "yyyy-MM-dd") : null })
          }
          placeholder="From"
          className="w-48"
          disabled={(date) => (dateTo ? date > dateTo : false)}
        />

        <DatePicker
          value={dateTo}
          onChange={(d) =>
            updateParams({ dateTo: d ? format(d, "yyyy-MM-dd") : null })
          }
          placeholder="To"
          className="w-48"
          disabled={(date) => (dateFrom ? date < dateFrom : false)}
        />

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAll}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4 mr-1" />
            Clear filters
          </Button>
        )}
      </div>
    </div>
  );
};
