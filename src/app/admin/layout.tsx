import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";

const navItems = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/bookings", label: "Bookings" },
  { href: "/admin/reservations", label: "Reservations" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/rooms", label: "Rooms" },
  { href: "/admin/tables", label: "Tables" },
  { href: "/admin/menu", label: "Menu" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/login?next=/admin");
  if (session.role !== "ADMIN" && session.role !== "STAFF") redirect("/account");

  return (
    <div className="mx-auto flex max-w-6xl gap-8 px-6 py-10">
      <aside className="w-48 shrink-0">
        <p className="mb-4 px-2 text-xs font-semibold uppercase tracking-wide text-muted">
          Admin
        </p>
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-espresso hover:bg-sand/15"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}
