"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-context";

export function CartIndicator() {
  const { count } = useCart();

  return (
    <Link
      href="/restaurant/cart"
      className="relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface text-espresso hover:border-sand"
      aria-label="View cart"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        className="h-4.5 w-4.5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 1.994-4.694 2.602-7.152.075-.302-.15-.598-.463-.598H5.106M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
        />
      </svg>
      {count > 0 && (
        <span className="absolute -right-1 -top-1 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-sand-deep px-1 text-[10px] font-bold text-white">
          {count}
        </span>
      )}
    </Link>
  );
}
