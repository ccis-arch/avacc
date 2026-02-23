import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

const inventorySchema = z.object({
  vaccineTypeId: z.string().min(1, "Vaccine type is required"),
  locationId: z.string().min(1, "Location is required"),
  quantityInStock: z.string().min(1, "Quantity is required"),
  reorderThreshold: z.string().min(1, "Reorder threshold is required"),
  expiryDate: z.date().optional(),
  batchNumber: z.string().optional(),
});

type InventoryFormData = z.infer<typeof inventorySchema>;

interface InventoryFormProps {
  onSuccess?: () => void;
}

export default function InventoryForm({ onSuccess }: InventoryFormProps) {
  const [expiryDate, setExpiryDate] = useState<Date | undefined>();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const vaccineTypesQuery = trpc.vaccineType.getAll.useQuery();
  const locationsQuery = trpc.location.getAll.useQuery();
  const createInventoryMutation = trpc.inventory.create.useMutation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<InventoryFormData>({
    resolver: zodResolver(inventorySchema),
  });

  const onSubmit = async (data: InventoryFormData) => {
    try {
      await createInventoryMutation.mutateAsync({
        vaccineTypeId: parseInt(data.vaccineTypeId),
        locationId: parseInt(data.locationId),
        quantity: parseInt(data.quantityInStock),
        reorderThreshold: parseInt(data.reorderThreshold),
      });

      toast.success("Inventory record created successfully!");
      reset();
      setExpiryDate(undefined);
      onSuccess?.();
    } catch (error: any) {
      toast.error(error.message || "Failed to create inventory record");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Vaccine Inventory</CardTitle>
        <CardDescription>Add or update vaccine stock at a location</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Vaccine Type Selection */}
          <div className="space-y-2">
            <Label htmlFor="vaccineTypeId">Vaccine Type *</Label>
            <Select {...register("vaccineTypeId")}>
              <SelectTrigger>
                <SelectValue placeholder="Select vaccine type" />
              </SelectTrigger>
              <SelectContent>
                {vaccineTypesQuery.data?.map((vaccine: any) => (
                  <SelectItem key={vaccine.id} value={String(vaccine.id)}>
                    {vaccine.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.vaccineTypeId && (
              <p className="text-sm text-red-500">{errors.vaccineTypeId.message}</p>
            )}
          </div>

          {/* Location Selection */}
          <div className="space-y-2">
            <Label htmlFor="locationId">Location *</Label>
            <Select {...register("locationId")}>
              <SelectTrigger>
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                {locationsQuery.data?.map((location: any) => (
                  <SelectItem key={location.id} value={String(location.id)}>
                    {location.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.locationId && (
              <p className="text-sm text-red-500">{errors.locationId.message}</p>
            )}
          </div>

          {/* Quantity in Stock */}
          <div className="space-y-2">
            <Label htmlFor="quantityInStock">Quantity in Stock *</Label>
            <Input
              id="quantityInStock"
              type="number"
              placeholder="Enter quantity"
              {...register("quantityInStock")}
            />
            {errors.quantityInStock && (
              <p className="text-sm text-red-500">{errors.quantityInStock.message}</p>
            )}
          </div>

          {/* Reorder Threshold */}
          <div className="space-y-2">
            <Label htmlFor="reorderThreshold">Reorder Threshold *</Label>
            <Input
              id="reorderThreshold"
              type="number"
              placeholder="Enter reorder threshold"
              {...register("reorderThreshold")}
            />
            {errors.reorderThreshold && (
              <p className="text-sm text-red-500">{errors.reorderThreshold.message}</p>
            )}
          </div>

          {/* Expiry Date */}
          <div className="space-y-2">
            <Label>Expiry Date</Label>
            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {expiryDate ? format(expiryDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={expiryDate}
                  onSelect={(date) => {
                    setExpiryDate(date);
                    setIsCalendarOpen(false);
                  }}
                  disabled={(date) => date < new Date()}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Submit Button */}
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Add Inventory"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
