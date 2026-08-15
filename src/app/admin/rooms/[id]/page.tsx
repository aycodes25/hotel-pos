import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { Card, Badge } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  updateRoomTypeAction,
  deleteRoomAction,
  updateRoomStatusAction,
} from "@/lib/actions/admin";
import { RoomTypeForm } from "@/components/admin/room-type-form";
import { AddRoomForm } from "@/components/admin/add-room-form";
import { ROOM_STATUSES } from "@/lib/enums";

export default async function AdminRoomTypeDetailPage({
  params,
}: PageProps<"/admin/rooms/[id]">) {
  const { id } = await params;

  const roomType = await db.roomType.findUnique({
    where: { id },
    include: { rooms: { orderBy: { roomNumber: "asc" } } },
  });

  if (!roomType) notFound();

  return (
    <div>
      <h1 className="font-serif text-2xl font-semibold text-espresso">
        {roomType.name}
      </h1>

      <Card className="mt-6 p-6">
        <h2 className="font-serif text-lg font-semibold text-espresso">
          Details
        </h2>
        <div className="mt-4">
          <RoomTypeForm
            action={updateRoomTypeAction.bind(null, roomType.id)}
            defaultValues={{
              name: roomType.name,
              description: roomType.description,
              basePrice: roomType.basePrice,
              capacity: roomType.capacity,
              bedType: roomType.bedType,
              sizeSqft: roomType.sizeSqft,
              amenities: JSON.parse(roomType.amenities),
            }}
            submitLabel="Save changes"
          />
        </div>
      </Card>

      <Card className="mt-6 p-6">
        <h2 className="font-serif text-lg font-semibold text-espresso">
          Rooms ({roomType.rooms.length})
        </h2>
        <div className="mt-4 flex flex-col gap-2">
          {roomType.rooms.map((room) => (
            <div
              key={room.id}
              className="flex items-center justify-between rounded-lg border border-border p-3"
            >
              <div>
                <span className="font-medium text-espresso">
                  Room {room.roomNumber}
                </span>
                <span className="ml-2 text-sm text-muted">Floor {room.floor}</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge tone={room.status === "AVAILABLE" ? "success" : "warning"}>
                  {room.status}
                </Badge>
                {ROOM_STATUSES.filter((s) => s !== room.status).map((s) => (
                  <form
                    key={s}
                    action={updateRoomStatusAction.bind(null, room.id, roomType.id, s)}
                  >
                    <Button type="submit" size="sm" variant="ghost">
                      Mark {s.replace("_", " ").toLowerCase()}
                    </Button>
                  </form>
                ))}
                <form action={deleteRoomAction.bind(null, room.id, roomType.id)}>
                  <Button type="submit" size="sm" variant="danger">
                    Delete
                  </Button>
                </form>
              </div>
            </div>
          ))}
          {roomType.rooms.length === 0 && (
            <p className="text-sm text-muted">No rooms yet.</p>
          )}
        </div>

        <div className="mt-6 border-t border-border pt-4">
          <AddRoomForm roomTypeId={roomType.id} />
        </div>
      </Card>
    </div>
  );
}
