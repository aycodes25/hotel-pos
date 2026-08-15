"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signUpAction } from "@/lib/actions/auth";
import { Label, Input, FieldError } from "@/components/ui/field";
import { Button } from "@/components/ui/button";

export function SignupForm({ next }: { next?: string }) {
  const [state, formAction, pending] = useActionState(signUpAction, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <input type="hidden" name="next" value={next ?? ""} />
      <div>
        <Label htmlFor="name">Full name</Label>
        <Input id="name" name="name" type="text" required autoFocus />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" required />
      </div>
      <div>
        <Label htmlFor="phone">Phone (optional)</Label>
        <Input id="phone" name="phone" type="tel" />
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <Input id="password" name="password" type="password" required minLength={8} />
      </div>
      <FieldError>{state?.error}</FieldError>
      <Button type="submit" disabled={pending} className="mt-2 w-full">
        {pending ? "Creating account..." : "Create account"}
      </Button>
      <p className="text-center text-sm text-muted">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-sand-deep hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}
