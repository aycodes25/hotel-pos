import { db } from "@/lib/db";
import { MenuItemCard } from "@/components/restaurant/menu-item-card";

export default async function RestaurantPage() {
  const categories = await db.menuCategory.findMany({
    orderBy: { sortOrder: "asc" },
    include: { items: true },
  });

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="font-serif text-3xl font-semibold text-espresso">
        Restaurant menu
      </h1>
      <p className="mt-2 text-muted">
        Add dishes to your cart, then choose dine-in, takeaway, or delivery
        at checkout.
      </p>

      <nav className="mt-6 flex flex-wrap gap-3">
        {categories.map((c) => (
          <a
            key={c.id}
            href={`#${c.slug}`}
            className="rounded-full border border-border bg-surface px-4 py-1.5 text-sm font-medium text-espresso hover:border-sand"
          >
            {c.name}
          </a>
        ))}
      </nav>

      <div className="mt-10 flex flex-col gap-14">
        {categories.map((category) => (
          <section key={category.id} id={category.slug} className="scroll-mt-24">
            <h2 className="font-serif text-2xl font-semibold text-espresso">
              {category.name}
            </h2>
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {category.items.map((item) => (
                <MenuItemCard
                  key={item.id}
                  id={item.id}
                  name={item.name}
                  description={item.description}
                  price={item.price}
                  image={item.image}
                  isVeg={item.isVeg}
                  isAvailable={item.isAvailable}
                />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
