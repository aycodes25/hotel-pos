import { db } from "@/lib/db";
import { Card, Badge } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/lib/utils";
import { updateBookingStatusAction } from "@/lib/actions/bookings";
import { nextBookingActions } from "@/lib/status-transitions";
import type { BookingStatus } from "@/lib/enums";

export default async function AdminBookingsPage() {
  const bookings = await db.booking.findMany({
    include: { user: true, room: { include: { roomType: true } } },
    orderBy: { checkIn: "desc" },
    take: 50,
  });

  return (
    <div>
      <h1 className="font-serif text-2xl font-semibold text-espresso">
        Bookings
      </h1>
      <p className="mt-1 text-muted">{bookings.length} most recent bookings.</p>

      <div className="mt-6 flex flex-col gap-3">
        {bookings.map((b) => (
          <Card key={b.id} className="flex flex-wrap items-center justify-between gap-4 p-4">
            <div>
              <p className="font-medium text-espresso">
                {b.user.name} · {b.room.roomType.name} ({b.room.roomNumber})
              </p>
              <p className="text-sm text-muted">
                {formatDate(b.checkIn)} → {formatDate(b.checkOut)} · {b.guests} guests ·{" "}
                {formatCurrency(b.totalPrice)}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge tone="sand">{b.status}</Badge>
              {nextBookingActions(b.status as BookingStatus).map((action) => (
                <form
                  key={action.status}
                  action={updateBookingStatusAction.bind(null, b.id, action.status)}
                >
                  <Button
                    type="submit"
                    size="sm"
                    variant={action.status === "CANCELLED" ? "danger" : "secondary"}
                  >
                    {action.label}
                  </Button>
                </form>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
