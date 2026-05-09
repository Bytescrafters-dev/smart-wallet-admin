"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { LeadRowWithValidation } from "../../../../../types/leads";

interface Props {
  rows: LeadRowWithValidation[];
}

export const getCampaignStyles = (campaign: string) => {
  switch (campaign) {
    case "facebook":
      return "bg-blue-800 text-white";
    case "instagram":
      return "bg-pink-800 text-white";
    case "tiktok":
      return "bg-black text-white";
    case "whatsapp":
      return "bg-green-800 text-white";
    case "google":
      return "bg-gray-100 text-red-800";
    case "other":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export const LeadsPreviewTable = ({ rows }: Props) => {
  return (
    <div className="border rounded-md overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10">#</TableHead>
              <TableHead>Full Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>City</TableHead>
              <TableHead>Country</TableHead>
              <TableHead>Campaign</TableHead>
              <TableHead>Products</TableHead>
              <TableHead className="w-28">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => {
              const hasError = row.errors.length > 0;
              const products = [
                row.product1,
                row.product2,
                row.product3,
                row.product4,
                row.product5,
              ].filter(Boolean);

              return (
                <TableRow
                  key={row.rowIndex}
                  className={hasError ? "bg-destructive/5" : undefined}
                >
                  <TableCell className="text-muted-foreground text-xs">
                    {row.rowIndex}
                  </TableCell>
                  <TableCell className="font-medium">
                    {row.fullName || (
                      <span className="text-muted-foreground italic">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {row.email || "—"}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {row.phone || "—"}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {row.city || "—"}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {row.country || "—"}
                  </TableCell>
                  <TableCell className="flex  items-center justify-center">
                    {row.campaign ? (
                      <Badge
                        variant="outline"
                        className={`text-xs capitalize ${getCampaignStyles(row.campaign)}`}
                      >
                        {row.campaign}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground text-sm">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {products.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {products.map((p, i) => (
                          <Badge
                            key={i}
                            variant="secondary"
                            className="text-xs"
                          >
                            {p}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-sm">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {hasError ? (
                      <div className="flex items-start gap-1.5">
                        <AlertCircle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
                        <ul className="text-xs text-destructive space-y-0.5">
                          {row.errors.map((err, i) => (
                            <li key={i}>{err}</li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-emerald-600">
                        <CheckCircle2 className="h-4 w-4" />
                        <span className="text-xs">Valid</span>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
