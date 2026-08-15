import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-cream-soft">
      <div className="mx-auto max-w-6xl px-6 py-10 text-sm text-muted">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div>
            <span className="font-serif text-lg font-semibold text-espresso">
              Tawnystay
            </span>
            <p className="mt-2 max-w-sm">
              Boutique rooms and table-side dining, booked in the same place.
            </p>
          </div>
          <div className="flex gap-10">
            <div className="flex flex-col gap-2">
              <span className="font-semibold text-espresso">Stay</span>
              <Link href="/rooms" className="hover:text-espresso">
                Rooms
              </Link>
              <Link href="/account/bookings" className="hover:text-espresso">
                My bookings
              </Link>
            </div>
            <div className="flex flex-col gap-2">
              <span className="font-semibold text-espresso">Dine</span>
              <Link href="/restaurant" className="hover:text-espresso">
                Menu
              </Link>
              <Link href="/reservations/new" className="hover:text-espresso">
                Reserve a table
              </Link>
            </div>
          </div>
        </div>
        <p className="mt-8 text-xs">
          © {new Date().getFullYear()} Tawnystay. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
