import { getSession } from "@/lib/auth";
import { CartView } from "@/components/restaurant/cart-view";

export default async function CartPage() {
  const session = await getSession();

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="font-serif text-3xl font-semibold text-espresso">
        Your cart
      </h1>
      <div className="mt-8">
        <CartView loggedIn={Boolean(session)} />
      </div>
    </div>
  );
}
