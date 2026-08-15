import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { Card, Badge } from "@/components/ui/card";
import { formatCurrency, formatDate } from "@/lib/utils";

export default async function MyBookingsPage() {
  const session = await getSession();
  if (!session) redirect("/login?next=/account/bookings");

  const bookings = await db.booking.findMany({
    where: { userId: session.sub },
    include: { room: { include: { roomType: true } } },
    orderBy: { checkIn: "desc" },
  });

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="font-serif text-3xl font-semibold text-espresso">
        My bookings
      </h1>

      <div className="mt-8 flex flex-col gap-4">
        {bookings.length === 0 && (
          <p className="text-muted">You haven&apos;t booked a room yet.</p>
        )}
        {bookings.map((b) => (
          <Link key={b.id} href={`/account/bookings/${b.id}`}>
            <Card className="flex items-center justify-between p-5">
              <div>
                <p className="font-serif font-semibold text-espresso">
                  {b.room.roomType.name}
                </p>
                <p className="text-sm text-muted">
                  {formatDate(b.checkIn)} → {formatDate(b.checkOut)} ·{" "}
                  {b.guests} guest{b.guests > 1 ? "s" : ""}
                </p>
                <p className="mt-1 text-xs text-muted">Code: {b.code}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-espresso">
                  {formatCurrency(b.totalPrice)}
                </p>
                <Badge tone="sand" className="mt-1">
                  {b.status}
                </Badge>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
