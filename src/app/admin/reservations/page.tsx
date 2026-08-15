import { db } from "@/lib/db";
import { Card, Badge } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { updateReservationStatusAction } from "@/lib/actions/reservations";
import { nextReservationActions } from "@/lib/status-transitions";
import type { ReservationStatus } from "@/lib/enums";

export default async function AdminReservationsPage() {
  const reservations = await db.reservation.findMany({
    include: { user: true, table: true },
    orderBy: { date: "desc" },
    take: 50,
  });

  return (
    <div>
      <h1 className="font-serif text-2xl font-semibold text-espresso">
        Reservations
      </h1>
      <p className="mt-1 text-muted">{reservations.length} most recent reservations.</p>

      <div className="mt-6 flex flex-col gap-3">
        {reservations.map((r) => (
          <Card key={r.id} className="flex flex-wrap items-center justify-between gap-4 p-4">
            <div>
              <p className="font-medium text-espresso">
                {r.user.name} · Table {r.table.tableNumber}
              </p>
              <p className="text-sm text-muted">
                {formatDate(r.date)} at {r.time} · {r.partySize} guests
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge tone="sand">{r.status}</Badge>
              {nextReservationActions(r.status as ReservationStatus).map((action) => (
                <form
                  key={action.status}
                  action={updateReservationStatusAction.bind(null, r.id, action.status)}
                >
                  <Button
                    type="submit"
                    size="sm"
                    variant={
                      action.status === "CANCELLED" || action.status === "NO_SHOW"
                        ? "danger"
                        : "secondary"
                    }
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
