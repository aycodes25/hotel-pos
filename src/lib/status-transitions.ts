import type { BookingStatus, ReservationStatus, OrderStatus, OrderType } from "@/lib/enums";

export function nextBookingActions(status: BookingStatus) {
  switch (status) {
    case "PENDING":
      return [
        { label: "Confirm", status: "CONFIRMED" as const },
        { label: "Cancel", status: "CANCELLED" as const },
      ];
    case "CONFIRMED":
      return [
        { label: "Check in", status: "CHECKED_IN" as const },
        { label: "Cancel", status: "CANCELLED" as const },
      ];
    case "CHECKED_IN":
      return [{ label: "Check out", status: "CHECKED_OUT" as const }];
    default:
      return [];
  }
}

export function nextReservationActions(status: ReservationStatus) {
  switch (status) {
    case "PENDING":
      return [
        { label: "Confirm", status: "CONFIRMED" as const },
        { label: "Cancel", status: "CANCELLED" as const },
      ];
    case "CONFIRMED":
      return [
        { label: "Seat", status: "SEATED" as const },
        { label: "No-show", status: "NO_SHOW" as const },
        { label: "Cancel", status: "CANCELLED" as const },
      ];
    case "SEATED":
      return [{ label: "Complete", status: "COMPLETED" as const }];
    default:
      return [];
  }
}

export function nextOrderActions(status: OrderStatus, type: OrderType) {
  switch (status) {
    case "PENDING":
      return [
        { label: "Confirm", status: "CONFIRMED" as const },
        { label: "Cancel", status: "CANCELLED" as const },
      ];
    case "CONFIRMED":
      return [{ label: "Start preparing", status: "PREPARING" as const }];
    case "PREPARING":
      return [{ label: "Mark ready", status: "READY" as const }];
    case "READY":
      return type === "DELIVERY"
        ? [{ label: "Out for delivery", status: "OUT_FOR_DELIVERY" as const }]
        : [{ label: "Complete", status: "COMPLETED" as const }];
    case "OUT_FOR_DELIVERY":
      return [{ label: "Delivered", status: "DELIVERED" as const }];
    case "DELIVERED":
      return [{ label: "Complete", status: "COMPLETED" as const }];
    default:
      return [];
  }
}
