"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { getSession, requireRole } from "@/lib/auth";
import { findAvailableRoom } from "@/lib/availability";
import { generateBookingCode, nightsBetween } from "@/lib/utils";
import { BOOKING_STATUSES, type BookingStatus } from "@/lib/enums";

export type FormState = { error?: string } | undefined;

const bookingSchema = z
  .object({
    roomTypeId: z.string().min(1),
    checkIn: z.string().min(1, "Choose a check-in date"),
    checkOut: z.string().min(1, "Choose a check-out date"),
    guests: z.coerce.number().int().min(1, "At least 1 guest"),
    specialRequests: z.string().optional(),
  })
  .refine((data) => new Date(data.checkOut) > new Date(data.checkIn), {
    message: "Check-out must be after check-in",
    path: ["checkOut"],
  })
  .refine(
    (data) => new Date(data.checkIn) >= new Date(new Date().toDateString()),
    { message: "Check-in date can't be in the past", path: ["checkIn"] },
  );

export async function createBookingAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const session = await getSession();
  if (!session) {
    redirect(`/login?next=/rooms`);
  }

  const parsed = bookingSchema.safeParse({
    roomTypeId: formData.get("roomTypeId"),
    checkIn: formData.get("checkIn"),
    checkOut: formData.get("checkOut"),
    guests: formData.get("guests"),
    specialRequests: formData.get("specialRequests") || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const { roomTypeId, guests, specialRequests } = parsed.data;
  const checkIn = new Date(parsed.data.checkIn);
  const checkOut = new Date(parsed.data.checkOut);

  const roomType = await db.roomType.findUnique({ where: { id: roomTypeId } });
  if (!roomType) return { error: "Room type not found" };
  if (guests > roomType.capacity) {
    return { error: `This room sleeps up to ${roomType.capacity} guests` };
  }

  const room = await findAvailableRoom(roomTypeId, checkIn, checkOut);
  if (!room) {
    return { error: "No rooms of this type are available for those dates" };
  }

  const nights = nightsBetween(checkIn, checkOut);
  const totalPrice = roomType.basePrice * nights;

  const booking = await db.booking.create({
    data: {
      code: generateBookingCode(),
      checkIn,
      checkOut,
      guests,
      specialRequests,
      totalPrice,
      status: "CONFIRMED",
      userId: session.sub,
      roomId: room.id,
      payment: {
        create: {
          amount: totalPrice,
          method: "PAY_AT_PROPERTY",
          status: "PENDING",
        },
      },
    },
  });

  redirect(`/account/bookings/${booking.id}?new=1`);
}

export async function cancelOwnBookingAction(bookingId: string) {
  const session = await getSession();
  if (!session) redirect("/login");

  const booking = await db.booking.findUnique({ where: { id: bookingId } });
  if (!booking || booking.userId !== session.sub) {
    throw new Error("Not found");
  }
  if (booking.status === "CHECKED_OUT" || booking.status === "CANCELLED") {
    return;
  }

  await db.booking.update({
    where: { id: bookingId },
    data: { status: "CANCELLED" },
  });
  revalidatePath(`/account/bookings/${bookingId}`);
  revalidatePath("/account/bookings");
}

export async function updateBookingStatusAction(
  bookingId: string,
  status: BookingStatus,
) {
  await requireRole("ADMIN", "STAFF");
  if (!BOOKING_STATUSES.includes(status)) throw new Error("Invalid status");

  await db.booking.update({ where: { id: bookingId }, data: { status } });
  revalidatePath("/admin/bookings");
}
