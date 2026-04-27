"use client";
import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSupplier, useUpdateSupplier } from "@/hooks/useSuppliers";
import { Loader2Icon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  contactName: z.string(),
  contactEmail: z.email("Invalid email address"),
  contactPhone: z.string(),
  city: z.string(),
  country: z.string(),
  notes: z.string(),
});
type Form = z.infer<typeof schema>;

const UpdateSupplier = () => {
  const router = useRouter();
  const params = useParams();
  const supplierId = params.id as string;

  const { register, handleSubmit, reset } = useForm<Form>({
    resolver: zodResolver(schema),
  });

  const {
    data: supplier,
    isLoading,
    isError: supplierError,
  } = useSupplier(supplierId);

  const {
    mutateAsync: updateSupplier,
    isPending,
    isError,
  } = useUpdateSupplier();

  useEffect(() => {
    if (supplier?.id) {
      reset({
        name: supplier.name,
        contactName: supplier?.contactName ?? "",
        contactEmail: supplier?.contactEmail ?? "",
        contactPhone: supplier?.contactPhone ?? "",
        city: supplier?.city ?? "",
        country: supplier?.country ?? "",
        notes: supplier?.notes ?? "",
      });
    }
  }, [supplier, reset]);

  const onSubmit = async (values: Form) => {
    const {
      name,
      contactName,
      contactEmail,
      contactPhone,
      city,
      country,
      notes,
    } = values;
    try {
      await updateSupplier({
        id: supplierId,
        data: {
          name,
          contactName,
          contactEmail,
          contactPhone,
          city,
          country,
          notes,
        },
      });
      toast.success("Supplier updated successfully!");
    } catch {}
  };

  useEffect(() => {
    if (isError) {
      toast.error("Failed to update supplier!");
    }

    if (supplierError) {
      toast.error("Failed to load supplier!");
    }
  }, [isError, supplierError]);

  return (
    <div className="p-4 md:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Update Supplier</h1>
      </div>

      <Card className="max-w">
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-48 w-full rounded-xl" />
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="flex gap-4">
                <Label
                  htmlFor="name"
                  className="w-40 min-w-40 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center"
                >
                  Name
                </Label>
                <Input
                  id="name"
                  {...register("name")}
                  placeholder="Supplier name"
                  required
                />
              </div>

              <div className="flex gap-4">
                <Label
                  htmlFor="contact-name"
                  className="w-40 min-w-40 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center"
                >
                  Contact Name
                </Label>
                <Input
                  id="contact-name"
                  {...register("contactName")}
                  placeholder="Contact name"
                />
              </div>

              <div className="flex gap-4">
                <Label
                  htmlFor="contact-email"
                  className="w-40 min-w-40 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center"
                >
                  Contact Email
                </Label>
                <Input
                  id="contact-email"
                  {...register("contactEmail")}
                  placeholder="Contact email"
                />
              </div>
              <div className="flex gap-4">
                <Label
                  htmlFor="contact-phone"
                  className="w-40 min-w-40 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center"
                >
                  Contact Phone
                </Label>
                <Input
                  id="contact-phone"
                  {...register("contactPhone")}
                  placeholder="Contact phone"
                />
              </div>
              <div className="flex gap-4">
                <Label
                  htmlFor="city"
                  className="w-40 min-w-40 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center"
                >
                  City
                </Label>
                <Input id="city" {...register("city")} placeholder="City" />
              </div>

              <div className="flex gap-4">
                <Label
                  htmlFor="country"
                  className="w-40 min-w-40 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center"
                >
                  Country
                </Label>
                <Input
                  id="country"
                  {...register("country")}
                  placeholder="Country"
                />
              </div>

              <div className="flex gap-4">
                <Label
                  htmlFor="notes"
                  className="w-40 min-w-40 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center"
                >
                  Notes
                </Label>
                <Textarea id="notes" {...register("notes")} />
              </div>

              <div className="flex justify-end gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/suppliers")}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isPending && <Loader2Icon className="animate-spin" />}
                  {isPending ? "Updating..." : "Update Supplier"}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UpdateSupplier;
