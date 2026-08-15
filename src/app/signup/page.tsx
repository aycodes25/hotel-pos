import { Card } from "@/components/ui/card";
import { SignupForm } from "@/components/auth/signup-form";

export default async function SignupPage({
  searchParams,
}: PageProps<"/signup">) {
  const params = await searchParams;
  const next = typeof params.next === "string" ? params.next : undefined;

  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-6 py-16">
      <h1 className="font-serif text-3xl font-semibold text-espresso">
        Create your account
      </h1>
      <p className="mt-2 text-center text-muted">
        Book rooms, reserve tables, and order food — all from one account.
      </p>
      <Card className="mt-8 w-full p-6">
        <SignupForm next={next} />
      </Card>
    </div>
  );
}
