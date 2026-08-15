"use client";

import { useActionState, useMemo, useState } from "react";
import { createBookingAction } from "@/lib/actions/bookings";
import { Label, Input, Textarea, FieldError } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { formatCurrency, nightsBetween } from "@/lib/utils";

export function BookingForm({
  roomTypeId,
  basePrice,
  capacity,
  initialCheckIn,
  initialCheckOut,
  initialGuests,
  loggedIn,
}: {
  roomTypeId: string;
  basePrice: number;
  capacity: number;
  initialCheckIn?: string;
  initialCheckOut?: string;
  initialGuests?: string;
  loggedIn: boolean;
}) {
  const [state, formAction, pending] = useActionState(
    createBookingAction,
    undefined,
  );
  const [checkIn, setCheckIn] = useState(initialCheckIn ?? "");
  const [checkOut, setCheckOut] = useState(initialCheckOut ?? "");
  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);

  const nights =
    checkIn && checkOut && new Date(checkOut) > new Date(checkIn)
      ? nightsBetween(new Date(checkIn), new Date(checkOut))
      : 0;
  const total = nights * basePrice;

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <input type="hidden" name="roomTypeId" value={roomTypeId} />

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="checkIn">Check-in</Label>
          <Input
            id="checkIn"
            name="checkIn"
            type="date"
            min={today}
            required
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="checkOut">Check-out</Label>
          <Input
            id="checkOut"
            name="checkOut"
            type="date"
            min={checkIn || today}
            required
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="guests">Guests</Label>
        <Input
          id="guests"
          name="guests"
          type="number"
          min={1}
          max={capacity}
          defaultValue={initialGuests || 1}
          required
        />
      </div>

      <div>
        <Label htmlFor="specialRequests">Special requests (optional)</Label>
        <Textarea
          id="specialRequests"
          name="specialRequests"
          rows={3}
          placeholder="Late check-in, extra pillows, quiet floor..."
        />
      </div>

      {nights > 0 && (
        <div className="rounded-lg bg-cream-soft p-3 text-sm">
          <div className="flex justify-between text-muted">
            <span>
              {formatCurrency(basePrice)} × {nights} night{nights > 1 ? "s" : ""}
            </span>
            <span>{formatCurrency(total)}</span>
          </div>
          <div className="mt-1 flex justify-between font-semibold text-espresso">
            <span>Total</span>
            <span>{formatCurrency(total)}</span>
          </div>
        </div>
      )}

      <FieldError>{state?.error}</FieldError>

      <Button type="submit" disabled={pending} size="lg">
        {pending
          ? "Booking..."
          : loggedIn
            ? "Confirm booking"
            : "Sign in to book"}
      </Button>
      <p className="text-center text-xs text-muted">
        You won&apos;t be charged now — pay at the property on arrival.
      </p>
    </form>
  );
}
