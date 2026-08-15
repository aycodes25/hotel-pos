"use client";

import { useActionState, useMemo } from "react";
import { createReservationAction } from "@/lib/actions/reservations";
import { Label, Input, Select, Textarea, FieldError } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { RESERVATION_SLOTS } from "@/lib/enums";

export function ReservationForm({ loggedIn }: { loggedIn: boolean }) {
  const [state, formAction, pending] = useActionState(
    createReservationAction,
    undefined,
  );
  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div>
        <Label htmlFor="date">Date</Label>
        <Input id="date" name="date" type="date" min={today} required />
      </div>

      <div>
        <Label htmlFor="time">Time</Label>
        <Select id="time" name="time" required defaultValue="">
          <option value="" disabled>
            Choose a time
          </option>
          {RESERVATION_SLOTS.map((slot) => (
            <option key={slot} value={slot}>
              {slot}
            </option>
          ))}
        </Select>
      </div>

      <div>
        <Label htmlFor="partySize">Party size</Label>
        <Input
          id="partySize"
          name="partySize"
          type="number"
          min={1}
          max={20}
          defaultValue={2}
          required
        />
      </div>

      <div>
        <Label htmlFor="specialRequests">Special requests (optional)</Label>
        <Textarea
          id="specialRequests"
          name="specialRequests"
          rows={3}
          placeholder="Window seat, allergy notes, celebration..."
        />
      </div>

      <FieldError>{state?.error}</FieldError>

      <Button type="submit" disabled={pending} size="lg">
        {pending
          ? "Reserving..."
          : loggedIn
            ? "Reserve table"
            : "Sign in to reserve"}
      </Button>
    </form>
  );
}
