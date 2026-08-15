import Link from "next/link";
import type { SessionPayload } from "@/lib/auth";
import { signOutAction } from "@/lib/actions/auth";
import { LinkButton } from "@/components/ui/button";
import { CartIndicator } from "@/components/restaurant/cart-indicator";

const navLinks = [
  { href: "/rooms", label: "Rooms" },
  { href: "/restaurant", label: "Restaurant" },
  { href: "/reservations/new", label: "Reserve a Table" },
];

export function SiteHeader({ session }: { session: SessionPayload | null }) {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-cream-soft/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-sand font-serif text-lg font-bold text-white">
            T
          </span>
          <span className="font-serif text-xl font-semibold text-espresso">
            Tawnystay
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-espresso/80 transition-colors hover:text-espresso"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <CartIndicator />
          {session ? (
            <div className="flex items-center gap-3">
              {session.role !== "CUSTOMER" && (
                <LinkButton href="/admin" variant="secondary" size="sm">
                  Admin
                </LinkButton>
              )}
              <LinkButton href="/account" variant="ghost" size="sm">
                {session.name.split(" ")[0]}
              </LinkButton>
              <form action={signOutAction}>
                <button
                  type="submit"
                  className="cursor-pointer text-sm font-medium text-espresso/60 hover:text-espresso"
                >
                  Sign out
                </button>
              </form>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <LinkButton href="/login" variant="ghost" size="sm">
                Sign in
              </LinkButton>
              <LinkButton href="/signup" variant="primary" size="sm">
                Sign up
              </LinkButton>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
