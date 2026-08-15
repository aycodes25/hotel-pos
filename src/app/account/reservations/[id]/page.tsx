import { redirect, notFound } from "next/navigation";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { Card, Badge } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { cancelOwnReservationAction } from "@/lib/actions/reservations";

export default async function ReservationDetailPage({
  params,
  searchParams,
}: PageProps<"/account/reservations/[id]">) {
  const session = await getSession();
  if (!session) redirect("/login?next=/account/reservations");

  const { id } = await params;
  const query = await searchParams;

  const reservation = await db.reservation.findUnique({
    where: { id },
    include: { table: true },
  });

  if (!reservation || reservation.userId !== session.sub) notFound();

  const canCancel = ["PENDING", "CONFIRMED"].includes(reservation.status);

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      {query.new === "1" && (
        <div className="mb-6 rounded-lg bg-success/15 px-4 py-3 text-sm text-success">
          Table reserved! We&apos;ll have it ready for you.
        </div>
      )}

      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl font-semibold text-espresso">
          Table {reservation.table.tableNumber}
        </h1>
        <Badge tone="sand">{reservation.status}</Badge>
      </div>
      <p className="mt-1 text-sm text-muted">
        Confirmation code: {reservation.code}
      </p>

      <Card className="mt-6 divide-y divide-border p-0">
        <Row label="Date" value={formatDate(reservation.date)} />
        <Row label="Time" value={reservation.time} />
        <Row label="Party size" value={String(reservation.partySize)} />
        <Row
          label="Location"
          value={reservation.table.location.charAt(0) + reservation.table.location.slice(1).toLowerCase()}
        />
        {reservation.specialRequests && (
          <Row label="Special requests" value={reservation.specialRequests} />
        )}
      </Card>

      {canCancel && (
        <form
          action={cancelOwnReservationAction.bind(null, reservation.id)}
          className="mt-6"
        >
          <Button type="submit" variant="danger" size="sm">
            Cancel reservation
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
