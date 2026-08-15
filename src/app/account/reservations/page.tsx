import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { Card, Badge } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";

export default async function MyReservationsPage() {
  const session = await getSession();
  if (!session) redirect("/login?next=/account/reservations");

  const reservations = await db.reservation.findMany({
    where: { userId: session.sub },
    include: { table: true },
    orderBy: { date: "desc" },
  });

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="font-serif text-3xl font-semibold text-espresso">
        My reservations
      </h1>

      <div className="mt-8 flex flex-col gap-4">
        {reservations.length === 0 && (
          <p className="text-muted">You haven&apos;t reserved a table yet.</p>
        )}
        {reservations.map((r) => (
          <Link key={r.id} href={`/account/reservations/${r.id}`}>
            <Card className="flex items-center justify-between p-5">
              <div>
                <p className="font-serif font-semibold text-espresso">
                  Table {r.table.tableNumber}
                </p>
                <p className="text-sm text-muted">
                  {formatDate(r.date)} at {r.time} · {r.partySize} guests
                </p>
                <p className="mt-1 text-xs text-muted">Code: {r.code}</p>
              </div>
              <Badge tone="sand">{r.status}</Badge>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
