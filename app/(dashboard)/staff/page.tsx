"use client";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { useDeleteSupplier, useSuppliers } from "@/hooks/useSuppliers";
import { Edit, Trash2 } from "lucide-react";
import DeleteDialog from "@/components/delete-confirmation-dialog";
import { toast } from "sonner";

const ViewStaffPage = () => {
  const [page, setPage] = useState(1);
  const limit = 10;
  const [deleteDialog, setDeleteDialog] = useState({
    isOpen: false,
    supplierId: "",
    supplierName: "",
  });

  return (
    <div className="p-4 md:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Staff Members</h1>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-bold">Employee No</TableHead>
              <TableHead className="font-bold">Name</TableHead>
              <TableHead className="font-bold">Email</TableHead>
              <TableHead className="font-bold">Phone</TableHead>
              <TableHead className="font-bold">Address</TableHead>
              <TableHead className="font-bold">Role</TableHead>
              <TableHead className="font-bold text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
        </Table>
      </div>
    </div>
  );
};

export default ViewStaffPage;
