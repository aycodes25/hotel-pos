"use client";

import { useActionState } from "react";
import { Label, Input, FieldError } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { createRoomAction, type FormState } from "@/lib/actions/admin";

export function AddRoomForm({ roomTypeId }: { roomTypeId: string }) {
  const boundAction = createRoomAction.bind(null, roomTypeId);
  const [state, formAction, pending] = useActionState<FormState, FormData>(
    boundAction,
    undefined,
  );

  return (
    <form action={formAction} className="flex flex-wrap items-end gap-3">
      <div>
        <Label htmlFor="roomNumber">Room number</Label>
        <Input id="roomNumber" name="roomNumber" required className="w-32" />
      </div>
      <div>
        <Label htmlFor="floor">Floor</Label>
        <Input id="floor" name="floor" type="number" min={0} required className="w-24" />
      </div>
      <Button type="submit" disabled={pending} size="sm">
        {pending ? "Adding..." : "Add room"}
      </Button>
      <FieldError>{state?.error}</FieldError>
    </form>
  );
}
