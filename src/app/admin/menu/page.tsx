import { db } from "@/lib/db";
import { Card, Badge } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import {
  deleteMenuCategoryAction,
  deleteMenuItemAction,
  toggleMenuItemAvailabilityAction,
} from "@/lib/actions/admin";
import { AddCategoryForm } from "@/components/admin/add-category-form";
import { AddMenuItemForm } from "@/components/admin/add-menu-item-form";

export default async function AdminMenuPage() {
  const categories = await db.menuCategory.findMany({
    orderBy: { sortOrder: "asc" },
    include: { items: true },
  });

  return (
    <div>
      <h1 className="font-serif text-2xl font-semibold text-espresso">Menu</h1>
      <p className="mt-1 text-muted">Manage categories and dishes.</p>

      <div className="mt-6 flex flex-col gap-6">
        {categories.map((category) => (
          <Card key={category.id} className="p-5">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-lg font-semibold text-espresso">
                {category.name}
              </h2>
              <form action={deleteMenuCategoryAction.bind(null, category.id)}>
                <Button type="submit" size="sm" variant="danger">
                  Delete category
                </Button>
              </form>
            </div>

            <div className="mt-4 flex flex-col gap-2">
              {category.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-lg border border-border p-3"
                >
                  <div>
                    <span className="font-medium text-espresso">{item.name}</span>
                    <span className="ml-2 text-sm text-muted">
                      {formatCurrency(item.price)}
                    </span>
                    {item.isVeg && (
                      <Badge tone="success" className="ml-2">
                        Veg
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <form
                      action={toggleMenuItemAvailabilityAction.bind(
                        null,
                        item.id,
                        !item.isAvailable,
                      )}
                    >
                      <Button type="submit" size="sm" variant="ghost">
                        {item.isAvailable ? "Mark unavailable" : "Mark available"}
                      </Button>
                    </form>
                    <form action={deleteMenuItemAction.bind(null, item.id)}>
                      <Button type="submit" size="sm" variant="danger">
                        Delete
                      </Button>
                    </form>
                  </div>
                </div>
              ))}
              {category.items.length === 0 && (
                <p className="text-sm text-muted">No dishes in this category yet.</p>
              )}
            </div>

            <div className="mt-4 border-t border-border pt-4">
              <AddMenuItemForm categoryId={category.id} />
            </div>
          </Card>
        ))}
      </div>

      <Card className="mt-6 p-6">
        <h2 className="font-serif text-lg font-semibold text-espresso">
          Add a category
        </h2>
        <div className="mt-4">
          <AddCategoryForm />
        </div>
      </Card>
    </div>
  );
}
