"use client";

import { useActionState } from "react";
import { Input, FieldError } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { createMenuCategoryAction } from "@/lib/actions/admin";

export function AddCategoryForm() {
  const [state, formAction, pending] = useActionState(
    createMenuCategoryAction,
    undefined,
  );

  return (
    <form action={formAction} className="flex items-end gap-3">
      <Input name="name" placeholder="Category name" required className="w-56" />
      <Button type="submit" disabled={pending} size="sm">
        {pending ? "Adding..." : "Add category"}
      </Button>
      <FieldError>{state?.error}</FieldError>
    </form>
  );
}
