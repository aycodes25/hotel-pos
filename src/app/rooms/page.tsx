import { db } from "@/lib/db";
import { Card, Badge } from "@/components/ui/card";
import { LinkButton } from "@/components/ui/button";
import { Label, Input } from "@/components/ui/field";
import { formatCurrency } from "@/lib/utils";
import { countAvailableRooms } from "@/lib/availability";

export default async function RoomsPage({
  searchParams,
}: PageProps<"/rooms">) {
  const params = await searchParams;
  const checkIn = typeof params.checkIn === "string" ? params.checkIn : "";
  const checkOut = typeof params.checkOut === "string" ? params.checkOut : "";
  const guests = typeof params.guests === "string" ? params.guests : "";

  const roomTypes = await db.roomType.findMany({ orderBy: { basePrice: "asc" } });

  const hasSearch = Boolean(checkIn && checkOut);
  const availability = hasSearch
    ? await Promise.all(
        roomTypes.map((rt) =>
          countAvailableRooms(rt.id, new Date(checkIn), new Date(checkOut)),
        ),
      )
    : [];

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="font-serif text-3xl font-semibold text-espresso">Rooms</h1>
      <p className="mt-2 text-muted">
        Boutique rooms for every kind of trip — search by date to see live
        availability.
      </p>

      <form className="mt-8 grid gap-4 rounded-2xl border border-border bg-surface p-5 sm:grid-cols-4">
        <div>
          <Label htmlFor="checkIn">Check-in</Label>
          <Input id="checkIn" name="checkIn" type="date" defaultValue={checkIn} />
        </div>
        <div>
          <Label htmlFor="checkOut">Check-out</Label>
          <Input id="checkOut" name="checkOut" type="date" defaultValue={checkOut} />
        </div>
        <div>
          <Label htmlFor="guests">Guests</Label>
          <Input
            id="guests"
            name="guests"
            type="number"
            min={1}
            defaultValue={guests}
          />
        </div>
        <div className="flex items-end">
          <button
            type="submit"
            className="w-full cursor-pointer rounded-lg bg-sand px-4 py-2.5 text-sm font-medium text-white hover:bg-sand-dark"
          >
            Check availability
          </button>
        </div>
      </form>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {roomTypes.map((room, idx) => {
          const guestsNum = Number(guests) || 0;
          const meetsCapacity = !guestsNum || guestsNum <= room.capacity;
          const availableCount = hasSearch ? availability[idx] : null;
          const soldOut = hasSearch && availableCount === 0;
          const images: string[] = JSON.parse(room.images);

          return (
            <Card key={room.id} className="flex flex-col overflow-hidden">
              <div className="h-40 overflow-hidden bg-cream-soft">
                {images[0] && (
                  <img
                    src={images[0]}
                    alt={room.name}
                    className="h-full w-full object-cover"
                  />
                )}
              </div>
              <div className="flex flex-1 flex-col p-5">
                <div className="flex items-center gap-2">
                  <h3 className="font-serif text-lg font-semibold text-espresso">
                    {room.name}
                  </h3>
                  {!meetsCapacity && <Badge tone="warning">Too small</Badge>}
                  {soldOut && <Badge tone="danger">Sold out</Badge>}
                  {hasSearch && !soldOut && (
                    <Badge tone="success">{availableCount} left</Badge>
                  )}
                </div>
                <p className="mt-1 line-clamp-2 text-sm text-muted">
                  {room.description}
                </p>
                <p className="mt-2 text-xs text-muted">
                  Sleeps {room.capacity} · {room.bedType} · {room.sizeSqft} sq ft
                </p>
                <div className="mt-auto flex items-center justify-between pt-4">
                  <span className="font-semibold text-espresso">
                    {formatCurrency(room.basePrice)}
                    <span className="font-normal text-muted"> / night</span>
                  </span>
                  <LinkButton
                    href={`/rooms/${room.slug}${hasSearch ? `?checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}` : ""}`}
                    size="sm"
                  >
                    View room
                  </LinkButton>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
