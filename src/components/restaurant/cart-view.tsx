"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { createOrderAction } from "@/lib/actions/orders";
import { Card } from "@/components/ui/card";
import { Button, LinkButton } from "@/components/ui/button";
import { Label, Input, Textarea, Select, FieldError } from "@/components/ui/field";
import { formatCurrency } from "@/lib/utils";
import type { OrderType } from "@/lib/enums";

const TAX_RATE = 0.08;

export function CartView({ loggedIn }: { loggedIn: boolean }) {
  const { items, setQuantity, removeItem, subtotal } = useCart();
  const [state, formAction, pending] = useActionState(
    createOrderAction,
    undefined,
  );
  const [type, setType] = useState<OrderType>("DINE_IN");

  const tax = Math.round(subtotal * TAX_RATE * 100) / 100;
  const total = subtotal + tax;

  if (items.length === 0) {
    return (
      <Card className="p-10 text-center">
        <p className="text-muted">Your cart is empty.</p>
        <LinkButton href="/restaurant" className="mt-4 inline-flex">
          Browse the menu
        </LinkButton>
      </Card>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <Card className="divide-y divide-border p-0">
          {items.map((item) => (
            <div
              key={item.menuItemId}
              className="flex items-center justify-between gap-4 p-5"
            >
              <div>
                <p className="font-medium text-espresso">{item.name}</p>
                <p className="text-sm text-muted">
                  {formatCurrency(item.price)} each
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center rounded-lg border border-border">
                  <button
                    type="button"
                    className="cursor-pointer px-3 py-1.5 text-espresso hover:bg-cream-soft"
                    onClick={() =>
                      setQuantity(item.menuItemId, item.quantity - 1)
                    }
                  >
                    −
                  </button>
                  <span className="w-8 text-center text-sm">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    className="cursor-pointer px-3 py-1.5 text-espresso hover:bg-cream-soft"
                    onClick={() =>
                      setQuantity(item.menuItemId, item.quantity + 1)
                    }
                  >
                    +
                  </button>
                </div>
                <span className="w-16 text-right font-medium text-espresso">
                  {formatCurrency(item.price * item.quantity)}
                </span>
                <button
                  type="button"
                  className="cursor-pointer text-sm text-danger hover:underline"
                  onClick={() => removeItem(item.menuItemId)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </Card>
      </div>

      <Card className="h-fit p-6">
        <form action={formAction} className="flex flex-col gap-4">
          <input
            type="hidden"
            name="items"
            value={JSON.stringify(
              items.map((i) => ({
                menuItemId: i.menuItemId,
                quantity: i.quantity,
              })),
            )}
          />

          <div>
            <Label htmlFor="type">Order type</Label>
            <Select
              id="type"
              name="type"
              value={type}
              onChange={(e) => setType(e.target.value as OrderType)}
            >
              <option value="DINE_IN">Dine-in</option>
              <option value="TAKEAWAY">Takeaway</option>
              <option value="DELIVERY">Delivery</option>
            </Select>
          </div>

          {type === "DELIVERY" && (
            <div>
              <Label htmlFor="deliveryAddress">Delivery address</Label>
              <Textarea
                id="deliveryAddress"
                name="deliveryAddress"
                rows={2}
                required
                placeholder="Street, city, postal code"
              />
            </div>
          )}

          <div>
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea
              id="notes"
              name="notes"
              rows={2}
              placeholder="Allergies, spice preference..."
            />
          </div>

          <div className="rounded-lg bg-cream-soft p-3 text-sm">
            <div className="flex justify-between text-muted">
              <span>Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-muted">
              <span>Tax (8%)</span>
              <span>{formatCurrency(tax)}</span>
            </div>
            <div className="mt-1 flex justify-between font-semibold text-espresso">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>

          <FieldError>{state?.error}</FieldError>

          {loggedIn ? (
            <Button type="submit" disabled={pending} size="lg">
              {pending ? "Placing order..." : "Place order"}
            </Button>
          ) : (
            <LinkButton href="/login?next=/restaurant/cart" size="lg">
              Sign in to order
            </LinkButton>
          )}
          <p className="text-center text-xs text-muted">
            Pay by cash on {type === "DELIVERY" ? "delivery" : "collection"}.
          </p>
        </form>
      </Card>

      <div className="lg:col-span-3">
        <Link href="/restaurant" className="text-sm text-sand-deep hover:underline">
          ← Continue browsing the menu
        </Link>
      </div>
    </div>
  );
}
