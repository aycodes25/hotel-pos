import { getSession } from "@/lib/auth";
import { Card } from "@/components/ui/card";
import { ReservationForm } from "@/components/reservations/reservation-form";

export default async function NewReservationPage() {
  const session = await getSession();

  return (
    <div className="mx-auto max-w-md px-6 py-12">
      <h1 className="font-serif text-3xl font-semibold text-espresso">
        Reserve a table
      </h1>
      <p className="mt-2 text-muted">
        Lunch service 11:00–14:00, dinner service 18:00–21:30.
      </p>
      <Card className="mt-8 p-6">
        <ReservationForm loggedIn={Boolean(session)} />
      </Card>
    </div>
  );
}
