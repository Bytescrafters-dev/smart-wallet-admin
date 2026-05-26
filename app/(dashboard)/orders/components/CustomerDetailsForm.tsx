"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

interface Props {
  customerName: string;
  customerPhone: string;
  shippingAddress1: string;
  shippingAddress2: string;
  shippingCity: string;
  shippingState: string;
  shippingPostalCode: string;
  shippingCountry: string;
  canEdit?: boolean;
  onChange: (field: string, value: string) => void;
}

export const CustomerDetailsForm = ({
  customerName,
  customerPhone,
  shippingAddress1,
  shippingAddress2,
  shippingCity,
  shippingState,
  shippingPostalCode,
  shippingCountry,
  canEdit = true,
  onChange,
}: Props) => {
  const [showShipping, setShowShipping] = useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Customer Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-4">
          <Label className="w-40 min-w-40 text-sm font-medium leading-none flex items-center">
            Customer Name
          </Label>
          <Input
            placeholder="Enter customer name"
            value={customerName}
            disabled={!canEdit}
            onChange={(e) => onChange("customerName", e.target.value)}
          />
        </div>
        <div className="flex gap-4">
          <Label className="w-40 min-w-40 text-sm font-medium leading-none flex items-center">
            Phone
          </Label>
          <Input
            placeholder="Enter phone number"
            value={customerPhone}
            disabled={!canEdit}
            onChange={(e) => onChange("customerPhone", e.target.value)}
          />
        </div>

        <div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="-ml-2 text-muted-foreground"
            onClick={() => setShowShipping((v) => !v)}
          >
            {showShipping ? (
              <ChevronUp className="h-4 w-4 mr-1" />
            ) : (
              <ChevronDown className="h-4 w-4 mr-1" />
            )}
            {showShipping ? "Hide shipping address" : "Add shipping address"}
          </Button>

          {showShipping && (
            <div className="mt-4 space-y-4">
              <div className="flex gap-4">
                <Label className="w-40 min-w-40 text-sm font-medium leading-none flex items-center">
                  Address Line 1
                </Label>
                <Input
                  placeholder="Street address"
                  value={shippingAddress1}
                  disabled={!canEdit}
                  onChange={(e) => onChange("shippingAddress1", e.target.value)}
                />
              </div>
              <div className="flex gap-4">
                <Label className="w-40 min-w-40 text-sm font-medium leading-none flex items-center">
                  Address Line 2
                </Label>
                <Input
                  placeholder="Apt, suite, unit, etc."
                  value={shippingAddress2}
                  disabled={!canEdit}
                  onChange={(e) => onChange("shippingAddress2", e.target.value)}
                />
              </div>
              <div className="flex gap-4">
                <Label className="w-40 min-w-40 text-sm font-medium leading-none flex items-center">
                  City
                </Label>
                <Input
                  placeholder="City"
                  value={shippingCity}
                  disabled={!canEdit}
                  onChange={(e) => onChange("shippingCity", e.target.value)}
                />
              </div>
              <div className="flex gap-4">
                <Label className="w-40 min-w-40 text-sm font-medium leading-none flex items-center">
                  State / Province
                </Label>
                <Input
                  placeholder="State or province"
                  value={shippingState}
                  disabled={!canEdit}
                  onChange={(e) => onChange("shippingState", e.target.value)}
                />
              </div>
              <div className="flex gap-4">
                <Label className="w-40 min-w-40 text-sm font-medium leading-none flex items-center">
                  Postal Code
                </Label>
                <Input
                  placeholder="Postal / ZIP code"
                  value={shippingPostalCode}
                  disabled={!canEdit}
                  onChange={(e) =>
                    onChange("shippingPostalCode", e.target.value)
                  }
                />
              </div>
              <div className="flex gap-4">
                <Label className="w-40 min-w-40 text-sm font-medium leading-none flex items-center">
                  Country
                </Label>
                <Input
                  placeholder="Country"
                  value={shippingCountry}
                  disabled={!canEdit}
                  onChange={(e) => onChange("shippingCountry", e.target.value)}
                />
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
