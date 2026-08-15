import { redirect, notFound } from "next/navigation";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { Card, Badge } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { ClearCartOnMount } from "@/components/restaurant/clear-cart-on-mount";

export default async function OrderDetailPage({
  params,
  searchParams,
}: PageProps<"/account/orders/[id]">) {
  const session = await getSession();
  if (!session) redirect("/login?next=/account/orders");

  const { id } = await params;
  const query = await searchParams;

  const order = await db.order.findUnique({
    where: { id },
    include: { items: { include: { menuItem: true } }, table: true, payment: true },
  });

  if (!order || order.userId !== session.sub) notFound();

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      {query.new === "1" && <ClearCartOnMount />}
      {query.new === "1" && (
        <div className="mb-6 rounded-lg bg-success/15 px-4 py-3 text-sm text-success">
          Order placed! The kitchen has your ticket.
        </div>
      )}

      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl font-semibold text-espresso">
          {order.code}
        </h1>
        <Badge tone="sand">{order.status}</Badge>
      </div>
      <p className="mt-1 text-sm text-muted">
        {order.type.replace("_", " ")}
        {order.deliveryAddress ? ` · ${order.deliveryAddress}` : ""}
      </p>

      <Card className="mt-6 divide-y divide-border p-0">
        {order.items.map((item) => (
          <div key={item.id} className="flex items-center justify-between p-4">
            <span className="text-sm text-espresso">
              {item.quantity} × {item.menuItem.name}
            </span>
            <span className="text-sm font-medium text-espresso">
              {formatCurrency(item.unitPrice * item.quantity)}
            </span>
          </div>
        ))}
        <div className="flex items-center justify-between p-4 text-sm text-muted">
          <span>Subtotal</span>
          <span>{formatCurrency(order.subtotal)}</span>
        </div>
        <div className="flex items-center justify-between p-4 text-sm text-muted">
          <span>Tax</span>
          <span>{formatCurrency(order.tax)}</span>
        </div>
        <div className="flex items-center justify-between p-4 font-semibold text-espresso">
          <span>Total</span>
          <span>{formatCurrency(order.total)}</span>
        </div>
      </Card>

      {order.notes && (
        <p className="mt-4 text-sm text-muted">Notes: {order.notes}</p>
      )}
    </div>
  );
}
