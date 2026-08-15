import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { Card, Badge } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { BookingForm } from "@/components/booking/booking-form";

export default async function RoomDetailPage({
  params,
  searchParams,
}: PageProps<"/rooms/[slug]">) {
  const { slug } = await params;
  const query = await searchParams;

  const [roomType, session] = await Promise.all([
    db.roomType.findUnique({ where: { slug } }),
    getSession(),
  ]);

  if (!roomType) notFound();

  const amenities: string[] = JSON.parse(roomType.amenities);
  const images: string[] = JSON.parse(roomType.images);

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <div className="grid gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="h-64 overflow-hidden rounded-2xl bg-cream-soft">
            {images[0] && (
              <img
                src={images[0]}
                alt={roomType.name}
                className="h-full w-full object-cover"
              />
            )}
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-2">
            <Badge tone="sand">{roomType.bedType}</Badge>
            <Badge tone="neutral">Sleeps {roomType.capacity}</Badge>
            <Badge tone="neutral">{roomType.sizeSqft} sq ft</Badge>
          </div>

          <h1 className="mt-4 font-serif text-3xl font-semibold text-espresso">
            {roomType.name}
          </h1>
          <p className="mt-3 text-muted">{roomType.description}</p>

          <div className="mt-8">
            <h2 className="font-serif text-lg font-semibold text-espresso">
              Amenities
            </h2>
            <ul className="mt-3 grid grid-cols-2 gap-2 text-sm text-muted sm:grid-cols-3">
              {amenities.map((a) => (
                <li key={a} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-sand-deep" />
                  {a}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div>
          <Card className="sticky top-24 p-6">
            <div className="mb-4">
              <span className="font-serif text-2xl font-semibold text-espresso">
                {formatCurrency(roomType.basePrice)}
              </span>
              <span className="text-muted"> / night</span>
            </div>
            <BookingForm
              roomTypeId={roomType.id}
              basePrice={roomType.basePrice}
              capacity={roomType.capacity}
              initialCheckIn={
                typeof query.checkIn === "string" ? query.checkIn : undefined
              }
              initialCheckOut={
                typeof query.checkOut === "string" ? query.checkOut : undefined
              }
              initialGuests={
                typeof query.guests === "string" ? query.guests : undefined
              }
              loggedIn={Boolean(session)}
            />
          </Card>
        </div>
      </div>
    </div>
  );
}
