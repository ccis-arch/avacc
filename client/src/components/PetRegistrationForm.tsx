import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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

const petRegistrationSchema = z.object({
  name: z.string().min(1, "Pet name is required"),
  breedId: z.string().min(1, "Breed is required"),
  dateOfBirth: z.date().optional(),
  microchipId: z.string().optional(),
  notes: z.string().optional(),
});

type PetRegistrationFormData = z.infer<typeof petRegistrationSchema>;

interface PetRegistrationFormProps {
  onSuccess?: () => void;
}

export default function PetRegistrationForm({ onSuccess }: PetRegistrationFormProps) {
  const [dateOfBirth, setDateOfBirth] = useState<Date | undefined>();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const breedsQuery = trpc.breed.getAll.useQuery();
  const createPetMutation = trpc.pet.create.useMutation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    control,
    watch,
  } = useForm<PetRegistrationFormData>({
    resolver: zodResolver(petRegistrationSchema),
    defaultValues: {
      name: "",
      breedId: "",
      microchipId: "",
      notes: "",
    },
  });

  const breedIdValue = watch("breedId");

  const onSubmit = async (data: PetRegistrationFormData) => {
    try {
      const breedId = parseInt(data.breedId);
      await createPetMutation.mutateAsync({
        name: data.name,
        breedId,
        dateOfBirth: dateOfBirth,
        microchipId: data.microchipId || undefined,
        notes: data.notes || undefined,
      });

      toast.success("Pet registered successfully!");
      reset();
      setDateOfBirth(undefined);
      onSuccess?.();
    } catch (error: any) {
      toast.error(error.message || "Failed to register pet");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Register New Pet</CardTitle>
        <CardDescription>
          Add your pet's information to get started with vaccination tracking
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Pet Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Pet Name *</Label>
            <Input
              id="name"
              placeholder="Enter pet name (e.g., Max, Bella)"
              {...register("name")}
              disabled={isSubmitting || createPetMutation.isPending}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          {/* Breed Selection */}
          <div className="space-y-2">
            <Label htmlFor="breed">Breed *</Label>
            {breedsQuery.isLoading ? (
              <div className="flex items-center justify-center h-10 bg-muted rounded-md">
                <Loader2 className="animate-spin" size={16} />
              </div>
            ) : (
              <Controller
                name="breedId"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={isSubmitting || createPetMutation.isPending || breedsQuery.isLoading}
                  >
                    <SelectTrigger id="breed" className={errors.breedId ? "border-destructive" : ""}>
                      <SelectValue placeholder="Select a breed" />
                    </SelectTrigger>
                    <SelectContent>
                      {breedsQuery.data?.map((breed) => (
                        <SelectItem key={breed.id} value={breed.id.toString()}>
                          {breed.name} ({breed.species})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            )}
            {errors.breedId && (
              <p className="text-sm text-destructive">{errors.breedId.message}</p>
            )}
          </div>

          {/* Date of Birth */}
          <div className="space-y-2">
            <Label>Date of Birth</Label>
            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                  disabled={isSubmitting || createPetMutation.isPending}
                  type="button"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateOfBirth ? format(dateOfBirth, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dateOfBirth}
                  onSelect={(date) => {
                    setDateOfBirth(date);
                    setValue("dateOfBirth", date);
                    setIsCalendarOpen(false);
                  }}
                  disabled={(date) =>
                    date > new Date() || date < new Date("1900-01-01")
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <p className="text-xs text-muted-foreground">
              Select your pet's date of birth for accurate vaccination scheduling
            </p>
          </div>

          {/* Microchip ID */}
          <div className="space-y-2">
            <Label htmlFor="microchip">Microchip ID</Label>
            <Input
              id="microchip"
              placeholder="Enter microchip ID (optional)"
              {...register("microchipId")}
              disabled={isSubmitting || createPetMutation.isPending}
            />
            <p className="text-xs text-muted-foreground">
              The unique identifier for your pet's microchip
            </p>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              placeholder="Add any additional information about your pet (optional)"
              {...register("notes")}
              disabled={isSubmitting || createPetMutation.isPending}
              rows={4}
            />
            <p className="text-xs text-muted-foreground">
              Medical conditions, allergies, or other relevant information
            </p>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting || createPetMutation.isPending}
            className="w-full"
          >
            {isSubmitting || createPetMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Registering Pet...
              </>
            ) : (
              "Register Pet"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
