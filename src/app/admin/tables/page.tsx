import { db } from "@/lib/db";
import { Card, Badge } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { deleteTableAction, updateTableStatusAction } from "@/lib/actions/admin";
import { TableForm } from "@/components/admin/table-form";

export default async function AdminTablesPage() {
  const tables = await db.restaurantTable.findMany({
    orderBy: { tableNumber: "asc" },
  });

  return (
    <div>
      <h1 className="font-serif text-2xl font-semibold text-espresso">Tables</h1>
      <p className="mt-1 text-muted">Manage the restaurant floor plan.</p>

      <div className="mt-6 flex flex-col gap-3">
        {tables.map((t) => (
          <Card key={t.id} className="flex items-center justify-between p-4">
            <div>
              <p className="font-medium text-espresso">Table {t.tableNumber}</p>
              <p className="text-sm text-muted">
                Seats {t.capacity} · {t.location.charAt(0) + t.location.slice(1).toLowerCase()}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge tone={t.status === "AVAILABLE" ? "success" : "warning"}>
                {t.status}
              </Badge>
              <form
                action={updateTableStatusAction.bind(
                  null,
                  t.id,
                  t.status === "AVAILABLE" ? "MAINTENANCE" : "AVAILABLE",
                )}
              >
                <Button type="submit" size="sm" variant="ghost">
                  {t.status === "AVAILABLE" ? "Mark maintenance" : "Mark available"}
                </Button>
              </form>
              <form action={deleteTableAction.bind(null, t.id)}>
                <Button type="submit" size="sm" variant="danger">
                  Delete
                </Button>
              </form>
            </div>
          </Card>
        ))}
        {tables.length === 0 && <p className="text-sm text-muted">No tables yet.</p>}
      </div>

      <Card className="mt-8 p-6">
        <h2 className="font-serif text-lg font-semibold text-espresso">
          Add a table
        </h2>
        <div className="mt-4">
          <TableForm />
        </div>
      </Card>
    </div>
  );
}
