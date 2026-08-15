"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import {
  createSessionCookie,
  clearSessionCookie,
  hashPassword,
  verifyPassword,
} from "@/lib/auth";
import type { Role } from "@/lib/enums";

export type FormState = { error?: string } | undefined;

const signUpSchema = z.object({
  name: z.string().min(2, "Name is too short"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().optional(),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export async function signUpAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = signUpSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone") || undefined,
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const { name, email, phone, password } = parsed.data;

  const existing = await db.user.findUnique({ where: { email } });
  if (existing) {
    return { error: "An account with this email already exists" };
  }

  const passwordHash = await hashPassword(password);
  const user = await db.user.create({
    data: { name, email, phone, passwordHash },
  });

  await createSessionCookie({
    sub: user.id,
    role: user.role as Role,
    name: user.name,
  });

  const next = formData.get("next");
  redirect(typeof next === "string" && next ? next : "/account");
}

const signInSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

export async function signInAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = signInSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const { email, password } = parsed.data;
  const user = await db.user.findUnique({ where: { email } });
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    return { error: "Invalid email or password" };
  }

  await createSessionCookie({
    sub: user.id,
    role: user.role as Role,
    name: user.name,
  });

  const next = formData.get("next");
  redirect(
    typeof next === "string" && next
      ? next
      : user.role === "CUSTOMER"
        ? "/account"
        : "/admin",
  );
}

export async function signOutAction() {
  await clearSessionCookie();
  redirect("/");
}
