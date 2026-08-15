"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { getSession, requireRole } from "@/lib/auth";
import { findAvailableTable, RESERVATION_SLOTS } from "@/lib/availability";
import { generateReservationCode } from "@/lib/utils";
import { RESERVATION_STATUSES, type ReservationStatus } from "@/lib/enums";

export type FormState = { error?: string } | undefined;

const reservationSchema = z
  .object({
    date: z.string().min(1, "Choose a date"),
    time: z.enum(RESERVATION_SLOTS as unknown as [string, ...string[]], {
      message: "Choose a valid time slot",
    }),
    partySize: z.coerce.number().int().min(1).max(20),
    specialRequests: z.string().optional(),
  })
  .refine(
    (data) => new Date(data.date) >= new Date(new Date().toDateString()),
    { message: "Date can't be in the past", path: ["date"] },
  );

export async function createReservationAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const session = await getSession();
  if (!session) redirect("/login?next=/reservations/new");

  const parsed = reservationSchema.safeParse({
    date: formData.get("date"),
    time: formData.get("time"),
    partySize: formData.get("partySize"),
    specialRequests: formData.get("specialRequests") || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const { partySize, time, specialRequests } = parsed.data;
  const date = new Date(parsed.data.date);

  const table = await findAvailableTable(partySize, date, time);
  if (!table) {
    return {
      error: "No tables available for that time — try another slot or party size",
    };
  }

  const reservation = await db.reservation.create({
    data: {
      code: generateReservationCode(),
      date,
      time,
      partySize,
      specialRequests,
      status: "CONFIRMED",
      userId: session.sub,
      tableId: table.id,
    },
  });

  redirect(`/account/reservations/${reservation.id}?new=1`);
}

export async function cancelOwnReservationAction(reservationId: string) {
  const session = await getSession();
  if (!session) redirect("/login");

  const reservation = await db.reservation.findUnique({
    where: { id: reservationId },
  });
  if (!reservation || reservation.userId !== session.sub) {
    throw new Error("Not found");
  }
  if (["COMPLETED", "CANCELLED", "NO_SHOW"].includes(reservation.status)) {
    return;
  }

  await db.reservation.update({
    where: { id: reservationId },
    data: { status: "CANCELLED" },
  });
  revalidatePath(`/account/reservations/${reservationId}`);
  revalidatePath("/account/reservations");
}

export async function updateReservationStatusAction(
  reservationId: string,
  status: ReservationStatus,
) {
  await requireRole("ADMIN", "STAFF");
  if (!RESERVATION_STATUSES.includes(status)) throw new Error("Invalid status");

  await db.reservation.update({ where: { id: reservationId }, data: { status } });
  revalidatePath("/admin/reservations");
}
