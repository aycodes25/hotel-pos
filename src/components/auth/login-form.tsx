"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signInAction } from "@/lib/actions/auth";
import { Label, Input, FieldError } from "@/components/ui/field";
import { Button } from "@/components/ui/button";

export function LoginForm({ next }: { next?: string }) {
  const [state, formAction, pending] = useActionState(signInAction, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <input type="hidden" name="next" value={next ?? ""} />
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" required autoFocus />
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <Input id="password" name="password" type="password" required />
      </div>
      <FieldError>{state?.error}</FieldError>
      <Button type="submit" disabled={pending} className="mt-2 w-full">
        {pending ? "Signing in..." : "Sign in"}
      </Button>
      <p className="text-center text-sm text-muted">
        New here?{" "}
        <Link href="/signup" className="font-semibold text-sand-deep hover:underline">
          Create an account
        </Link>
      </p>
    </form>
  );
}
