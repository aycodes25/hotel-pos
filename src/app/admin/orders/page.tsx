import { db } from "@/lib/db";
import { Card, Badge } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/lib/utils";
import { updateOrderStatusAction } from "@/lib/actions/orders";
import { nextOrderActions } from "@/lib/status-transitions";
import type { OrderStatus, OrderType } from "@/lib/enums";

export default async function AdminOrdersPage() {
  const orders = await db.order.findMany({
    include: { user: true, items: true },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <div>
      <h1 className="font-serif text-2xl font-semibold text-espresso">Orders</h1>
      <p className="mt-1 text-muted">{orders.length} most recent orders.</p>

      <div className="mt-6 flex flex-col gap-3">
        {orders.map((o) => (
          <Card key={o.id} className="flex flex-wrap items-center justify-between gap-4 p-4">
            <div>
              <p className="font-medium text-espresso">
                {o.code} · {o.user.name}
              </p>
              <p className="text-sm text-muted">
                {o.type.replace("_", " ")} · {o.items.length} items ·{" "}
                {formatCurrency(o.total)} · {formatDate(o.createdAt)}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge tone="sand">{o.status}</Badge>
              {nextOrderActions(o.status as OrderStatus, o.type as OrderType).map(
                (action) => (
                  <form
                    key={action.status}
                    action={updateOrderStatusAction.bind(null, o.id, action.status)}
                  >
                    <Button
                      type="submit"
                      size="sm"
                      variant={action.status === "CANCELLED" ? "danger" : "secondary"}
                    >
                      {action.label}
                    </Button>
                  </form>
                ),
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
