"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { TABLE_LOCATIONS } from "@/lib/enums";

export type FormState = { error?: string } | undefined;

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function splitList(input: string) {
  return input
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

// ---------- Room types & rooms ----------

const roomTypeSchema = z.object({
  name: z.string().min(2),
  description: z.string().min(5),
  basePrice: z.coerce.number().positive(),
  capacity: z.coerce.number().int().positive(),
  bedType: z.string().min(1),
  sizeSqft: z.coerce.number().int().positive(),
  amenities: z.string().optional(),
});

export async function createRoomTypeAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireRole("ADMIN", "STAFF");

  const parsed = roomTypeSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    basePrice: formData.get("basePrice"),
    capacity: formData.get("capacity"),
    bedType: formData.get("bedType"),
    sizeSqft: formData.get("sizeSqft"),
    amenities: formData.get("amenities") || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const { amenities, ...data } = parsed.data;
  const slug = slugify(data.name);

  const existing = await db.roomType.findUnique({ where: { slug } });
  if (existing) return { error: "A room type with a similar name already exists" };

  await db.roomType.create({
    data: {
      ...data,
      slug,
      amenities: JSON.stringify(amenities ? splitList(amenities) : []),
      images: JSON.stringify([]),
    },
  });

  revalidatePath("/admin/rooms");
  return undefined;
}

export async function updateRoomTypeAction(
  roomTypeId: string,
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireRole("ADMIN", "STAFF");

  const parsed = roomTypeSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    basePrice: formData.get("basePrice"),
    capacity: formData.get("capacity"),
    bedType: formData.get("bedType"),
    sizeSqft: formData.get("sizeSqft"),
    amenities: formData.get("amenities") || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const { amenities, ...data } = parsed.data;

  await db.roomType.update({
    where: { id: roomTypeId },
    data: { ...data, amenities: JSON.stringify(amenities ? splitList(amenities) : []) },
  });

  revalidatePath("/admin/rooms");
  revalidatePath(`/admin/rooms/${roomTypeId}`);
  return undefined;
}

export async function deleteRoomTypeAction(roomTypeId: string) {
  await requireRole("ADMIN", "STAFF");
  await db.roomType.delete({ where: { id: roomTypeId } });
  revalidatePath("/admin/rooms");
}

const roomSchema = z.object({
  roomNumber: z.string().min(1),
  floor: z.coerce.number().int().min(0),
});

export async function createRoomAction(
  roomTypeId: string,
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireRole("ADMIN", "STAFF");

  const parsed = roomSchema.safeParse({
    roomNumber: formData.get("roomNumber"),
    floor: formData.get("floor"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const existing = await db.room.findUnique({
    where: { roomNumber: parsed.data.roomNumber },
  });
  if (existing) return { error: "Room number already exists" };

  await db.room.create({ data: { ...parsed.data, roomTypeId } });
  revalidatePath(`/admin/rooms/${roomTypeId}`);
  return undefined;
}

export async function updateRoomStatusAction(
  roomId: string,
  roomTypeId: string,
  status: string,
) {
  await requireRole("ADMIN", "STAFF");
  await db.room.update({ where: { id: roomId }, data: { status } });
  revalidatePath(`/admin/rooms/${roomTypeId}`);
}

export async function deleteRoomAction(roomId: string, roomTypeId: string) {
  await requireRole("ADMIN", "STAFF");
  await db.room.delete({ where: { id: roomId } });
  revalidatePath(`/admin/rooms/${roomTypeId}`);
}

// ---------- Restaurant tables ----------

const tableSchema = z.object({
  tableNumber: z.string().min(1),
  capacity: z.coerce.number().int().positive(),
  location: z.enum(TABLE_LOCATIONS as unknown as [string, ...string[]]),
});

export async function createTableAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireRole("ADMIN", "STAFF");

  const parsed = tableSchema.safeParse({
    tableNumber: formData.get("tableNumber"),
    capacity: formData.get("capacity"),
    location: formData.get("location"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const existing = await db.restaurantTable.findUnique({
    where: { tableNumber: parsed.data.tableNumber },
  });
  if (existing) return { error: "Table number already exists" };

  await db.restaurantTable.create({ data: parsed.data });
  revalidatePath("/admin/tables");
  return undefined;
}

export async function updateTableStatusAction(tableId: string, status: string) {
  await requireRole("ADMIN", "STAFF");
  await db.restaurantTable.update({ where: { id: tableId }, data: { status } });
  revalidatePath("/admin/tables");
}

export async function deleteTableAction(tableId: string) {
  await requireRole("ADMIN", "STAFF");
  await db.restaurantTable.delete({ where: { id: tableId } });
  revalidatePath("/admin/tables");
}

// ---------- Menu ----------

const categorySchema = z.object({ name: z.string().min(2) });

export async function createMenuCategoryAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireRole("ADMIN", "STAFF");

  const parsed = categorySchema.safeParse({ name: formData.get("name") });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const slug = slugify(parsed.data.name);
  const existing = await db.menuCategory.findUnique({ where: { slug } });
  if (existing) return { error: "A category with a similar name already exists" };

  const count = await db.menuCategory.count();
  await db.menuCategory.create({
    data: { name: parsed.data.name, slug, sortOrder: count + 1 },
  });

  revalidatePath("/admin/menu");
  return undefined;
}

export async function deleteMenuCategoryAction(categoryId: string) {
  await requireRole("ADMIN", "STAFF");
  await db.menuCategory.delete({ where: { id: categoryId } });
  revalidatePath("/admin/menu");
}

const menuItemSchema = z.object({
  name: z.string().min(2),
  description: z.string().min(3),
  price: z.coerce.number().positive(),
  isVeg: z.coerce.boolean().optional(),
});

export async function createMenuItemAction(
  categoryId: string,
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireRole("ADMIN", "STAFF");

  const parsed = menuItemSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    price: formData.get("price"),
    isVeg: formData.get("isVeg") === "on",
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const slug = `${slugify(parsed.data.name)}-${Date.now().toString(36)}`;

  await db.menuItem.create({
    data: { ...parsed.data, slug, categoryId, isVeg: parsed.data.isVeg ?? false },
  });

  revalidatePath("/admin/menu");
  return undefined;
}

export async function toggleMenuItemAvailabilityAction(
  itemId: string,
  isAvailable: boolean,
) {
  await requireRole("ADMIN", "STAFF");
  await db.menuItem.update({ where: { id: itemId }, data: { isAvailable } });
  revalidatePath("/admin/menu");
}

export async function deleteMenuItemAction(itemId: string) {
  await requireRole("ADMIN", "STAFF");
  await db.menuItem.delete({ where: { id: itemId } });
  revalidatePath("/admin/menu");
}
