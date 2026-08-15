"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { getSession, requireRole } from "@/lib/auth";
import { generateOrderCode } from "@/lib/utils";
import { ORDER_STATUSES, ORDER_TYPES, type OrderStatus } from "@/lib/enums";

export type FormState = { error?: string } | undefined;

const TAX_RATE = 0.08;

const cartItemSchema = z.object({
  menuItemId: z.string().min(1),
  quantity: z.coerce.number().int().min(1).max(50),
});

const orderSchema = z.object({
  type: z.enum(ORDER_TYPES as unknown as [string, ...string[]]),
  deliveryAddress: z.string().optional(),
  notes: z.string().optional(),
  items: z.string().min(1, "Your cart is empty"),
});

export async function createOrderAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const session = await getSession();
  if (!session) redirect("/login?next=/restaurant/cart");

  const parsed = orderSchema.safeParse({
    type: formData.get("type"),
    deliveryAddress: formData.get("deliveryAddress") || undefined,
    notes: formData.get("notes") || undefined,
    items: formData.get("items"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const { type, notes } = parsed.data;

  if (type === "DELIVERY" && !parsed.data.deliveryAddress?.trim()) {
    return { error: "Enter a delivery address" };
  }

  let cartItems: { menuItemId: string; quantity: number }[];
  try {
    const rawItems = JSON.parse(parsed.data.items);
    cartItems = z.array(cartItemSchema).min(1).parse(rawItems);
  } catch {
    return { error: "Your cart is empty" };
  }

  const menuItems = await db.menuItem.findMany({
    where: {
      id: { in: cartItems.map((i) => i.menuItemId) },
      isAvailable: true,
    },
  });

  if (menuItems.length === 0) {
    return { error: "None of the items in your cart are available anymore" };
  }

  const orderItemsData = cartItems.flatMap((cartItem) => {
    const menuItem = menuItems.find((m) => m.id === cartItem.menuItemId);
    if (!menuItem) return [];
    return [
      {
        menuItemId: menuItem.id,
        quantity: cartItem.quantity,
        unitPrice: menuItem.price,
      },
    ];
  });

  const subtotal = orderItemsData.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0,
  );
  const tax = Math.round(subtotal * TAX_RATE * 100) / 100;
  const total = subtotal + tax;

  const paymentMethod = type === "DELIVERY" ? "PAY_ON_DELIVERY" : "CASH";

  const order = await db.order.create({
    data: {
      code: generateOrderCode(),
      type,
      status: "PENDING",
      deliveryAddress: parsed.data.deliveryAddress,
      notes,
      subtotal,
      tax,
      total,
      userId: session.sub,
      items: { create: orderItemsData },
      payment: {
        create: { amount: total, method: paymentMethod, status: "PENDING" },
      },
    },
  });

  redirect(`/account/orders/${order.id}?new=1`);
}

export async function updateOrderStatusAction(
  orderId: string,
  status: OrderStatus,
) {
  await requireRole("ADMIN", "STAFF");
  if (!ORDER_STATUSES.includes(status)) throw new Error("Invalid status");

  await db.order.update({ where: { id: orderId }, data: { status } });
  revalidatePath("/admin/orders");
}
