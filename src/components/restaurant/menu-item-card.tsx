"use client";

import { useState } from "react";
import { Card, Badge } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { useCart } from "@/lib/cart-context";

export function MenuItemCard({
  id,
  name,
  description,
  price,
  image,
  isVeg,
  isAvailable,
}: {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string | null;
  isVeg: boolean;
  isAvailable: boolean;
}) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  return (
    <Card className="flex flex-col overflow-hidden">
      {image && (
        <div className="h-36 overflow-hidden bg-cream-soft">
          <img src={image} alt={name} className="h-full w-full object-cover" />
        </div>
      )}
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-serif text-lg font-semibold text-espresso">
            {name}
          </h3>
          {isVeg && <Badge tone="success">Veg</Badge>}
        </div>
        <p className="mt-1 flex-1 text-sm text-muted">{description}</p>
        <div className="mt-4 flex items-center justify-between">
          <span className="font-semibold text-espresso">
            {formatCurrency(price)}
          </span>
          <Button
            size="sm"
            variant={added ? "secondary" : "primary"}
            disabled={!isAvailable}
            onClick={() => {
              addItem({ menuItemId: id, name, price });
              setAdded(true);
              setTimeout(() => setAdded(false), 1200);
            }}
          >
            {!isAvailable ? "Unavailable" : added ? "Added ✓" : "Add to cart"}
          </Button>
        </div>
      </div>
    </Card>
  );
}
