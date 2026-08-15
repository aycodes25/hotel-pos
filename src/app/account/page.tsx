import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { Card, Badge } from "@/components/ui/card";
import { formatCurrency, formatDate } from "@/lib/utils";

export default async function AccountPage() {
  const session = await getSession();
  if (!session) redirect("/login?next=/account");

  const [bookings, reservations, orders] = await Promise.all([
    db.booking.findMany({
      where: { userId: session.sub },
      include: { room: { include: { roomType: true } } },
      orderBy: { checkIn: "desc" },
      take: 3,
    }),
    db.reservation.findMany({
      where: { userId: session.sub },
      include: { table: true },
      orderBy: { date: "desc" },
      take: 3,
    }),
    db.order.findMany({
      where: { userId: session.sub },
      orderBy: { createdAt: "desc" },
      take: 3,
    }),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="font-serif text-3xl font-semibold text-espresso">
        Welcome, {session.name.split(" ")[0]}
      </h1>
      <p className="mt-2 text-muted">
        Your recent bookings, reservations, and orders.
      </p>

      <div className="mt-10 grid gap-8 lg:grid-cols-3">
        <section>
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-lg font-semibold text-espresso">
              Bookings
            </h2>
            <Link href="/account/bookings" className="text-sm text-sand-deep hover:underline">
              View all
            </Link>
          </div>
          <div className="mt-4 flex flex-col gap-3">
            {bookings.length === 0 && (
              <p className="text-sm text-muted">No bookings yet.</p>
            )}
            {bookings.map((b) => (
              <Card key={b.id} className="p-4">
                <Link href={`/account/bookings/${b.id}`}>
                  <p className="font-medium text-espresso">
                    {b.room.roomType.name}
                  </p>
                  <p className="text-sm text-muted">
                    {formatDate(b.checkIn)} → {formatDate(b.checkOut)}
                  </p>
                  <Badge tone="sand" className="mt-2">
                    {b.status}
                  </Badge>
                </Link>
              </Card>
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-lg font-semibold text-espresso">
              Reservations
            </h2>
            <Link
              href="/account/reservations"
              className="text-sm text-sand-deep hover:underline"
            >
              View all
            </Link>
          </div>
          <div className="mt-4 flex flex-col gap-3">
            {reservations.length === 0 && (
              <p className="text-sm text-muted">No reservations yet.</p>
            )}
            {reservations.map((r) => (
              <Card key={r.id} className="p-4">
                <Link href={`/account/reservations/${r.id}`}>
                  <p className="font-medium text-espresso">
                    Table {r.table.tableNumber} · {r.partySize} guests
                  </p>
                  <p className="text-sm text-muted">
                    {formatDate(r.date)} at {r.time}
                  </p>
                  <Badge tone="sand" className="mt-2">
                    {r.status}
                  </Badge>
                </Link>
              </Card>
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-lg font-semibold text-espresso">
              Orders
            </h2>
            <Link href="/account/orders" className="text-sm text-sand-deep hover:underline">
              View all
            </Link>
          </div>
          <div className="mt-4 flex flex-col gap-3">
            {orders.length === 0 && (
              <p className="text-sm text-muted">No orders yet.</p>
            )}
            {orders.map((o) => (
              <Card key={o.id} className="p-4">
                <Link href={`/account/orders/${o.id}`}>
                  <p className="font-medium text-espresso">
                    {o.code} · {formatCurrency(o.total)}
                  </p>
                  <p className="text-sm text-muted">{o.type.replace("_", " ")}</p>
                  <Badge tone="sand" className="mt-2">
                    {o.status}
                  </Badge>
                </Link>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
