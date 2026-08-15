import { db } from "@/lib/db";
import { LinkButton } from "@/components/ui/button";
import { Card, Badge } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

export default async function HomePage() {
  const [roomTypes, categories] = await Promise.all([
    db.roomType.findMany({ orderBy: { basePrice: "asc" }, take: 3 }),
    db.menuCategory.findMany({
      orderBy: { sortOrder: "asc" },
      take: 1,
      include: { items: { take: 3 } },
    }),
  ]);

  const featuredDishes = categories[0]?.items ?? [];

  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-b from-sand/25 via-cream to-cream">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-6 py-24">
          <Badge tone="sand">Boutique hotel &amp; table-side dining</Badge>
          <h1 className="max-w-2xl font-serif text-4xl font-semibold leading-tight text-espresso sm:text-5xl">
            Stay, dine, and reserve — one warm experience.
          </h1>
          <p className="max-w-xl text-lg text-muted">
            Tawnystay brings boutique rooms and restaurant reservations
            together, so a weekend away and a table for two are booked in
            the same breath.
          </p>
          <div className="flex flex-wrap gap-3">
            <LinkButton href="/rooms" size="lg">
              Browse rooms
            </LinkButton>
            <LinkButton href="/reservations/new" variant="secondary" size="lg">
              Reserve a table
            </LinkButton>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="font-serif text-2xl font-semibold text-espresso">
              Popular rooms
            </h2>
            <p className="mt-1 text-muted">Handpicked stays for every trip.</p>
          </div>
          <LinkButton href="/rooms" variant="ghost" size="sm">
            View all rooms →
          </LinkButton>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {roomTypes.map((room) => {
            const images: string[] = JSON.parse(room.images);
            return (
            <Card key={room.id} className="overflow-hidden">
              <div className="h-40 overflow-hidden bg-cream-soft">
                {images[0] && (
                  <img
                    src={images[0]}
                    alt={room.name}
                    className="h-full w-full object-cover"
                  />
                )}
              </div>
              <div className="p-5">
                <h3 className="font-serif text-lg font-semibold text-espresso">
                  {room.name}
                </h3>
                <p className="mt-1 line-clamp-2 text-sm text-muted">
                  {room.description}
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="font-semibold text-espresso">
                    {formatCurrency(room.basePrice)}
                    <span className="font-normal text-muted"> / night</span>
                  </span>
                  <LinkButton
                    href={`/rooms/${room.slug}`}
                    size="sm"
                    variant="secondary"
                  >
                    View room
                  </LinkButton>
                </div>
              </div>
            </Card>
            );
          })}
        </div>
      </section>

      <section className="bg-cream-soft py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="font-serif text-2xl font-semibold text-espresso">
                From the kitchen
              </h2>
              <p className="mt-1 text-muted">
                Order for dine-in, takeaway, or delivery.
              </p>
            </div>
            <LinkButton href="/restaurant" variant="ghost" size="sm">
              View full menu →
            </LinkButton>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {featuredDishes.map((dish) => (
              <Card key={dish.id} className="overflow-hidden">
                {dish.image && (
                  <div className="h-36 overflow-hidden bg-cream-soft">
                    <img
                      src={dish.image}
                      alt={dish.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
                <div className="p-5">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-serif text-lg font-semibold text-espresso">
                      {dish.name}
                    </h3>
                    {dish.isVeg && <Badge tone="success">Veg</Badge>}
                  </div>
                  <p className="mt-1 text-sm text-muted">{dish.description}</p>
                  <span className="mt-3 block font-semibold text-espresso">
                    {formatCurrency(dish.price)}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-6 sm:grid-cols-3">
          {[
            {
              title: "Real-time availability",
              body: "Rooms and tables are checked live — no double-bookings, ever.",
            },
            {
              title: "One account, everything",
              body: "Manage stays, reservations, and orders from a single dashboard.",
            },
            {
              title: "Built for the front desk too",
              body: "Staff get a live command center for check-ins, tables, and the kitchen.",
            },
          ].map((f) => (
            <div key={f.title}>
              <h3 className="font-serif text-lg font-semibold text-espresso">
                {f.title}
              </h3>
              <p className="mt-2 text-sm text-muted">{f.body}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
