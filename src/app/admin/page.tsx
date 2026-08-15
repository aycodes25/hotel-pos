import { db } from "@/lib/db";
import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

function dayRange(date: Date) {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);
  return { start, end };
}

export default async function AdminOverviewPage() {
  const now = new Date();
  const { start: todayStart, end: todayEnd } = dayRange(now);
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const [
    arrivals,
    departures,
    todaysReservations,
    pendingOrders,
    totalRooms,
    occupiedRooms,
    monthBookings,
    monthOrders,
  ] = await Promise.all([
    db.booking.count({
      where: { checkIn: { gte: todayStart, lt: todayEnd }, status: { in: ["CONFIRMED", "PENDING"] } },
    }),
    db.booking.count({
      where: { checkOut: { gte: todayStart, lt: todayEnd }, status: "CHECKED_IN" },
    }),
    db.reservation.count({
      where: { date: { gte: todayStart, lt: todayEnd }, status: { in: ["PENDING", "CONFIRMED"] } },
    }),
    db.order.count({ where: { status: { in: ["PENDING", "CONFIRMED", "PREPARING"] } } }),
    db.room.count(),
    db.booking.count({
      where: {
        status: { in: ["CONFIRMED", "CHECKED_IN"] },
        checkIn: { lt: todayEnd },
        checkOut: { gt: todayStart },
      },
    }),
    db.booking.aggregate({
      where: { createdAt: { gte: monthStart } },
      _sum: { totalPrice: true },
    }),
    db.order.aggregate({
      where: { createdAt: { gte: monthStart } },
      _sum: { total: true },
    }),
  ]);

  const occupancy = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;
  const monthRevenue =
    (monthBookings._sum.totalPrice ?? 0) + (monthOrders._sum.total ?? 0);

  const stats = [
    { label: "Today's arrivals", value: arrivals },
    { label: "Today's departures", value: departures },
    { label: "Today's reservations", value: todaysReservations },
    { label: "Pending orders", value: pendingOrders },
    { label: "Occupancy", value: `${occupancy}%` },
    { label: "Revenue this month", value: formatCurrency(monthRevenue) },
  ];

  return (
    <div>
      <h1 className="font-serif text-2xl font-semibold text-espresso">
        HQ Overview
      </h1>
      <p className="mt-1 text-muted">Live snapshot of today&apos;s operations.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((s) => (
          <Card key={s.label} className="p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">
              {s.label}
            </p>
            <p className="mt-2 font-serif text-2xl font-semibold text-espresso">
              {s.value}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}
