import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/common/DatePicker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CURRENCIES } from "@/shared/constants/common";

interface Props {
  invoiceRef: string;
  note: string;
  expectedDeliveryDate: Date | undefined;
  currency: string;
  setCurrency: (value: string) => void;
  onInvoiceRefChange: (value: string) => void;
  onNoteChange: (value: string) => void;
  onExpectedDeliveryDateChange: (value: Date | undefined) => void;
}

export const OrderDetailsForm = ({
  invoiceRef,
  note,
  expectedDeliveryDate,
  currency,
  setCurrency,
  onInvoiceRefChange,
  onNoteChange,
  onExpectedDeliveryDateChange,
}: Props) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Order Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-4">
          <Label
            htmlFor="invoiceRef"
            className="w-40 min-w-40 text-sm font-medium leading-none flex items-center"
          >
            Invoice Reference
          </Label>
          <Input
            id="invoiceRef"
            placeholder="e.g. INV-2024-001"
            value={invoiceRef}
            onChange={(e) => onInvoiceRefChange(e.target.value)}
          />
        </div>
        <div className="flex gap-4">
          <Label
            htmlFor="note"
            className="w-40 min-w-40 text-sm font-medium leading-none flex items-center"
          >
            Notes
          </Label>
          <Textarea
            id="note"
            placeholder="Internal notes about this order..."
            value={note}
            onChange={(e) => onNoteChange(e.target.value)}
            rows={3}
          />
        </div>
        <div className="flex gap-4">
          <Label className="w-40 min-w-40 text-sm font-medium leading-none flex items-center">
            Expected Delivery
          </Label>
          <DatePicker
            value={expectedDeliveryDate}
            onChange={onExpectedDeliveryDateChange}
            placeholder="Select delivery date"
            disablePast
          />
        </div>
        <div className="flex gap-4">
          <Label className="w-40 min-w-40 text-sm font-medium leading-none flex items-center">
            Order Currency
          </Label>
          <Select
            value={currency}
            onValueChange={(value) => setCurrency(value)}
          >
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CURRENCIES.map((currency) => (
                <SelectItem key={currency.value} value={currency.value}>
                  {currency.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};
