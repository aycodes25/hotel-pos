import Link from "next/link";
import { db } from "@/lib/db";
import { Card, Badge } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { createRoomTypeAction, deleteRoomTypeAction } from "@/lib/actions/admin";
import { RoomTypeForm } from "@/components/admin/room-type-form";

export default async function AdminRoomsPage() {
  const roomTypes = await db.roomType.findMany({
    include: { _count: { select: { rooms: true } } },
    orderBy: { basePrice: "asc" },
  });

  return (
    <div>
      <h1 className="font-serif text-2xl font-semibold text-espresso">Rooms</h1>
      <p className="mt-1 text-muted">Manage room types and individual rooms.</p>

      <div className="mt-6 flex flex-col gap-3">
        {roomTypes.map((rt) => (
          <Card key={rt.id} className="flex flex-wrap items-center justify-between gap-4 p-4">
            <div>
              <p className="font-medium text-espresso">{rt.name}</p>
              <p className="text-sm text-muted">
                {formatCurrency(rt.basePrice)} / night · Sleeps {rt.capacity} ·{" "}
                {rt._count.rooms} rooms
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Link href={`/admin/rooms/${rt.id}`}>
                <Button type="button" size="sm" variant="secondary">
                  Manage
                </Button>
              </Link>
              <form action={deleteRoomTypeAction.bind(null, rt.id)}>
                <Button type="submit" size="sm" variant="danger">
                  Delete
                </Button>
              </form>
            </div>
          </Card>
        ))}
        {roomTypes.length === 0 && (
          <p className="text-sm text-muted">No room types yet.</p>
        )}
      </div>

      <Card className="mt-8 p-6">
        <h2 className="font-serif text-lg font-semibold text-espresso">
          Add a room type
        </h2>
        <div className="mt-4">
          <RoomTypeForm action={createRoomTypeAction} />
        </div>
      </Card>
    </div>
  );
}
