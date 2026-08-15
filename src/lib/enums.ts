// Single source of truth for the string-enum-like fields stored in the DB.
// Kept as plain string unions (rather than Prisma `enum`) so the schema stays
// portable between SQLite (dev) and PostgreSQL (production) without native
// enum/array support.

export const ROLES = ["CUSTOMER", "STAFF", "ADMIN"] as const;
export type Role = (typeof ROLES)[number];

export const ROOM_STATUSES = ["AVAILABLE", "MAINTENANCE", "OUT_OF_SERVICE"] as const;
export type RoomStatus = (typeof ROOM_STATUSES)[number];

export const BOOKING_STATUSES = [
  "PENDING",
  "CONFIRMED",
  "CHECKED_IN",
  "CHECKED_OUT",
  "CANCELLED",
] as const;
export type BookingStatus = (typeof BOOKING_STATUSES)[number];

export const TABLE_LOCATIONS = ["INDOOR", "OUTDOOR", "PRIVATE"] as const;
export type TableLocation = (typeof TABLE_LOCATIONS)[number];

export const TABLE_STATUSES = ["AVAILABLE", "MAINTENANCE"] as const;
export type TableStatus = (typeof TABLE_STATUSES)[number];

export const RESERVATION_STATUSES = [
  "PENDING",
  "CONFIRMED",
  "SEATED",
  "COMPLETED",
  "CANCELLED",
  "NO_SHOW",
] as const;
export type ReservationStatus = (typeof RESERVATION_STATUSES)[number];

export const ORDER_TYPES = ["DINE_IN", "TAKEAWAY", "DELIVERY"] as const;
export type OrderType = (typeof ORDER_TYPES)[number];

export const ORDER_STATUSES = [
  "PENDING",
  "CONFIRMED",
  "PREPARING",
  "READY",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "COMPLETED",
  "CANCELLED",
] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const PAYMENT_METHODS = [
  "CARD",
  "CASH",
  "PAY_AT_PROPERTY",
  "PAY_ON_DELIVERY",
] as const;
export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

export const PAYMENT_STATUSES = ["PENDING", "PAID", "FAILED", "REFUNDED"] as const;
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

export const RESERVATION_SLOTS = [
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "18:00",
  "18:30",
  "19:00",
  "19:30",
  "20:00",
  "20:30",
  "21:00",
] as const;
