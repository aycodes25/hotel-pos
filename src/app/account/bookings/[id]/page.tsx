import { redirect, notFound } from "next/navigation";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { Card, Badge } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/lib/utils";
import { cancelOwnBookingAction } from "@/lib/actions/bookings";

export default async function BookingDetailPage({
  params,
  searchParams,
}: PageProps<"/account/bookings/[id]">) {
  const session = await getSession();
  if (!session) redirect("/login?next=/account/bookings");

  const { id } = await params;
  const query = await searchParams;

  const booking = await db.booking.findUnique({
    where: { id },
    include: { room: { include: { roomType: true } }, payment: true },
  });

  if (!booking || booking.userId !== session.sub) notFound();

  const canCancel = ["PENDING", "CONFIRMED"].includes(booking.status);

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      {query.new === "1" && (
        <div className="mb-6 rounded-lg bg-success/15 px-4 py-3 text-sm text-success">
          Booking confirmed! We&apos;ve saved your reservation.
        </div>
      )}

      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl font-semibold text-espresso">
          {booking.room.roomType.name}
        </h1>
        <Badge tone="sand">{booking.status}</Badge>
      </div>
      <p className="mt-1 text-sm text-muted">Confirmation code: {booking.code}</p>

      <Card className="mt-6 divide-y divide-border p-0">
        <Row label="Room" value={`${booking.room.roomNumber} (Floor ${booking.room.floor})`} />
        <Row label="Check-in" value={formatDate(booking.checkIn)} />
        <Row label="Check-out" value={formatDate(booking.checkOut)} />
        <Row label="Guests" value={String(booking.guests)} />
        {booking.specialRequests && (
          <Row label="Special requests" value={booking.specialRequests} />
        )}
        <Row label="Total" value={formatCurrency(booking.totalPrice)} />
        <Row
          label="Payment"
          value={`${booking.payment?.status ?? "PENDING"} · Pay at property`}
        />
      </Card>

      {canCancel && (
        <form action={cancelOwnBookingAction.bind(null, booking.id)} className="mt-6">
          <Button type="submit" variant="danger" size="sm">
            Cancel booking
          </Button>
        </form>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between p-4">
      <span className="text-sm text-muted">{label}</span>
      <span className="text-sm font-medium text-espresso">{value}</span>
    </div>
  );
}
