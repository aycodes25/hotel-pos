"use client";

import { useActionState } from "react";
import { Label, Input, Select, FieldError } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { createTableAction } from "@/lib/actions/admin";
import { TABLE_LOCATIONS } from "@/lib/enums";

export function TableForm() {
  const [state, formAction, pending] = useActionState(
    createTableAction,
    undefined,
  );

  return (
    <form action={formAction} className="flex flex-wrap items-end gap-3">
      <div>
        <Label htmlFor="tableNumber">Table number</Label>
        <Input id="tableNumber" name="tableNumber" required className="w-28" />
      </div>
      <div>
        <Label htmlFor="capacity">Capacity</Label>
        <Input
          id="capacity"
          name="capacity"
          type="number"
          min={1}
          required
          className="w-24"
        />
      </div>
      <div>
        <Label htmlFor="location">Location</Label>
        <Select id="location" name="location" className="w-32" defaultValue="INDOOR">
          {TABLE_LOCATIONS.map((loc) => (
            <option key={loc} value={loc}>
              {loc.charAt(0) + loc.slice(1).toLowerCase()}
            </option>
          ))}
        </Select>
      </div>
      <Button type="submit" disabled={pending} size="sm">
        {pending ? "Adding..." : "Add table"}
      </Button>
      <FieldError>{state?.error}</FieldError>
    </form>
  );
}
