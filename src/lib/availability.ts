import "server-only";

import { db } from "@/lib/db";
import { RESERVATION_SLOTS } from "@/lib/enums";

export { RESERVATION_SLOTS };

const ACTIVE_BOOKING_STATUSES = ["PENDING", "CONFIRMED", "CHECKED_IN"];
const ACTIVE_RESERVATION_STATUSES = ["PENDING", "CONFIRMED", "SEATED"];

/** Finds one available room of the given room type for the date range, or null. */
export async function findAvailableRoom(
  roomTypeId: string,
  checkIn: Date,
  checkOut: Date,
) {
  const rooms = await db.room.findMany({
    where: { roomTypeId, status: "AVAILABLE" },
    include: {
      bookings: {
        where: {
          status: { in: ACTIVE_BOOKING_STATUSES },
          // overlap test: existing.checkIn < newCheckOut AND existing.checkOut > newCheckIn
          checkIn: { lt: checkOut },
          checkOut: { gt: checkIn },
        },
        select: { id: true },
      },
    },
  });

  return rooms.find((room) => room.bookings.length === 0) ?? null;
}

export async function countAvailableRooms(
  roomTypeId: string,
  checkIn: Date,
  checkOut: Date,
) {
  const rooms = await db.room.findMany({
    where: { roomTypeId, status: "AVAILABLE" },
    include: {
      bookings: {
        where: {
          status: { in: ACTIVE_BOOKING_STATUSES },
          checkIn: { lt: checkOut },
          checkOut: { gt: checkIn },
        },
        select: { id: true },
      },
    },
  });

  return rooms.filter((room) => room.bookings.length === 0).length;
}

/** Finds one available table for the given date/time/party size, or null. */
export async function findAvailableTable(
  partySize: number,
  date: Date,
  time: string,
) {
  const dayStart = new Date(date);
  dayStart.setHours(0, 0, 0, 0);
  const dayEnd = new Date(dayStart);
  dayEnd.setDate(dayEnd.getDate() + 1);

  const tables = await db.restaurantTable.findMany({
    where: {
      status: "AVAILABLE",
      capacity: { gte: partySize },
    },
    include: {
      reservations: {
        where: {
          status: { in: ACTIVE_RESERVATION_STATUSES },
          time,
          date: { gte: dayStart, lt: dayEnd },
        },
        select: { id: true },
      },
    },
    orderBy: { capacity: "asc" },
  });

  return tables.find((table) => table.reservations.length === 0) ?? null;
}
