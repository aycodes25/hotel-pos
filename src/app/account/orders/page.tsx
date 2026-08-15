import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { Card, Badge } from "@/components/ui/card";
import { formatCurrency, formatDate } from "@/lib/utils";

export default async function MyOrdersPage() {
  const session = await getSession();
  if (!session) redirect("/login?next=/account/orders");

  const orders = await db.order.findMany({
    where: { userId: session.sub },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="font-serif text-3xl font-semibold text-espresso">
        My orders
      </h1>

      <div className="mt-8 flex flex-col gap-4">
        {orders.length === 0 && (
          <p className="text-muted">You haven&apos;t placed an order yet.</p>
        )}
        {orders.map((o) => (
          <Link key={o.id} href={`/account/orders/${o.id}`}>
            <Card className="flex items-center justify-between p-5">
              <div>
                <p className="font-serif font-semibold text-espresso">
                  {o.code}
                </p>
                <p className="text-sm text-muted">
                  {o.type.replace("_", " ")} · {formatDate(o.createdAt)}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-espresso">
                  {formatCurrency(o.total)}
                </p>
                <Badge tone="sand" className="mt-1">
                  {o.status}
                </Badge>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
