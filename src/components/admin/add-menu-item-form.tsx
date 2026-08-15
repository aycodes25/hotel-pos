"use client";

import { useActionState } from "react";
import { Label, Input, Textarea, FieldError } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { createMenuItemAction, type FormState } from "@/lib/actions/admin";

export function AddMenuItemForm({ categoryId }: { categoryId: string }) {
  const boundAction = createMenuItemAction.bind(null, categoryId);
  const [state, formAction, pending] = useActionState<FormState, FormData>(
    boundAction,
    undefined,
  );

  return (
    <form action={formAction} className="flex flex-wrap items-end gap-3">
      <div>
        <Label htmlFor={`name-${categoryId}`}>Dish name</Label>
        <Input id={`name-${categoryId}`} name="name" required className="w-48" />
      </div>
      <div className="flex-1 min-w-[180px]">
        <Label htmlFor={`description-${categoryId}`}>Description</Label>
        <Textarea
          id={`description-${categoryId}`}
          name="description"
          rows={1}
          required
        />
      </div>
      <div>
        <Label htmlFor={`price-${categoryId}`}>Price</Label>
        <Input
          id={`price-${categoryId}`}
          name="price"
          type="number"
          min={0}
          step="0.01"
          required
          className="w-24"
        />
      </div>
      <label className="mb-2.5 flex items-center gap-1.5 text-sm text-espresso">
        <input type="checkbox" name="isVeg" />
        Veg
      </label>
      <Button type="submit" disabled={pending} size="sm">
        {pending ? "Adding..." : "Add dish"}
      </Button>
      <FieldError>{state?.error}</FieldError>
    </form>
  );
}
