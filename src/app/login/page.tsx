import { Card } from "@/components/ui/card";
import { LoginForm } from "@/components/auth/login-form";

export default async function LoginPage({
  searchParams,
}: PageProps<"/login">) {
  const params = await searchParams;
  const next = typeof params.next === "string" ? params.next : undefined;

  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-6 py-16">
      <h1 className="font-serif text-3xl font-semibold text-espresso">
        Welcome back
      </h1>
      <p className="mt-2 text-center text-muted">
        Sign in to manage your bookings, reservations, and orders.
      </p>
      <Card className="mt-8 w-full p-6">
        <LoginForm next={next} />
      </Card>
    </div>
  );
}
