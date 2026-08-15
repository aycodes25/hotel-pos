"use client";

import { useActionState } from "react";
import { Label, Input, Textarea, FieldError } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import type { FormState } from "@/lib/actions/admin";

type Action = (state: FormState, formData: FormData) => Promise<FormState>;

export function RoomTypeForm({
  action,
  defaultValues,
  submitLabel = "Create room type",
}: {
  action: Action;
  defaultValues?: {
    name: string;
    description: string;
    basePrice: number;
    capacity: number;
    bedType: string;
    sizeSqft: number;
    amenities: string[];
  };
  submitLabel?: string;
}) {
  const [state, formAction, pending] = useActionState(action, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" required defaultValue={defaultValues?.name} />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          rows={3}
          required
          defaultValue={defaultValues?.description}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="basePrice">Price / night</Label>
          <Input
            id="basePrice"
            name="basePrice"
            type="number"
            min={0}
            step="0.01"
            required
            defaultValue={defaultValues?.basePrice}
          />
        </div>
        <div>
          <Label htmlFor="capacity">Capacity</Label>
          <Input
            id="capacity"
            name="capacity"
            type="number"
            min={1}
            required
            defaultValue={defaultValues?.capacity}
          />
        </div>
        <div>
          <Label htmlFor="bedType">Bed type</Label>
          <Input
            id="bedType"
            name="bedType"
            required
            defaultValue={defaultValues?.bedType}
          />
        </div>
        <div>
          <Label htmlFor="sizeSqft">Size (sq ft)</Label>
          <Input
            id="sizeSqft"
            name="sizeSqft"
            type="number"
            min={1}
            required
            defaultValue={defaultValues?.sizeSqft}
          />
        </div>
      </div>
      <div>
        <Label htmlFor="amenities">Amenities (comma separated)</Label>
        <Input
          id="amenities"
          name="amenities"
          placeholder="Free Wi-Fi, Minibar, Balcony"
          defaultValue={defaultValues?.amenities.join(", ")}
        />
      </div>

      <FieldError>{state?.error}</FieldError>

      <Button type="submit" disabled={pending} className="self-start">
        {pending ? "Saving..." : submitLabel}
      </Button>
    </form>
  );
}
