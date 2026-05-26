import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import * as XLSX from "xlsx";
import {
  LeadRow,
  LeadRowWithValidation,
  HEADER_TO_FIELD,
  TEMPLATE_HEADERS,
  CAMPAIGN_VALUES,
  CampaignValue,
} from "../types/leads";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getErrorMessage = (err: unknown) =>
  err ? (err instanceof Error ? err.message : "Something went wrong") : null;

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function parseLeadsFile(file: File): Promise<LeadRowWithValidation[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows: Record<string, string>[] = XLSX.utils.sheet_to_json(sheet, {
          defval: "",
        });

        const result: LeadRowWithValidation[] = rows.map((row, i) => {
          const lead: LeadRow = {
            fullName: "",
            email: "",
            phone: "",
            address1: "",
            address2: "",
            city: "",
            state: "",
            country: "",
            postalCode: "",
            campaign: "",
            product1: "",
            product2: "",
            product3: "",
            product4: "",
            product5: "",
          };

          for (const [header, field] of Object.entries(HEADER_TO_FIELD)) {
            lead[field] = String(row[header] ?? "").trim() as never;
          }

          // Normalize campaign to lowercase
          const rawCampaign = lead.campaign.toLowerCase() as CampaignValue;
          lead.campaign = rawCampaign;

          const errors: string[] = [];
          if (!lead.fullName) errors.push("Full Name is required");
          if (!lead.email && !lead.phone)
            errors.push("Email or Phone is required");
          if (lead.email && !validateEmail(lead.email))
            errors.push("Invalid email format");
          if (
            lead.campaign &&
            !(CAMPAIGN_VALUES as readonly string[]).includes(lead.campaign)
          )
            errors.push(
              `Invalid campaign "${lead.campaign}". Must be one of: ${CAMPAIGN_VALUES.join(", ")}`,
            );

          return { ...lead, rowIndex: i + 1, errors };
        });

        resolve(result);
      } catch {
        reject(
          new Error("Failed to parse file. Ensure it is a valid .xlsx file."),
        );
      }
    };
    reader.onerror = () => reject(new Error("Failed to read file."));
    reader.readAsArrayBuffer(file);
  });
}

export function downloadTemplate() {
  const exampleRow = [
    "John Doe",
    "john@example.com",
    "+94778956520",
    "123 Main St",
    "Apt 4B",
    "Colombo",
    "Western",
    "Sri Lanka",
    "10200",
    "facebook",
    "product SKU",
    "product SKU",
    "",
    "",
    "",
  ];

  const ws = XLSX.utils.aoa_to_sheet([TEMPLATE_HEADERS, exampleRow]);
  ws["!cols"] = TEMPLATE_HEADERS.map((h) => ({
    wch: Math.max(h.length + 4, 18),
  }));

  // Reference sheet listing valid campaign values
  const refData = [
    ["Campaign — Valid Values"],
    ["Leave blank if unknown / not applicable"],
    [],
    ...CAMPAIGN_VALUES.map((v) => [v]),
  ];
  const refWs = XLSX.utils.aoa_to_sheet(refData);
  refWs["!cols"] = [{ wch: 30 }];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Leads");
  XLSX.utils.book_append_sheet(wb, refWs, "Campaign Values");
  XLSX.writeFile(wb, "leads_import_template.xlsx");
}

export const getDisplayPrice = (price: number): number => {
  return price / 100;
};
