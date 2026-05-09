"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

const CreateLeadPage = () => {
  return (
    <div className="p-4 md:p-8">
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild className="-ml-2 mb-2">
          <Link href="/leads">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Leads
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default CreateLeadPage;
