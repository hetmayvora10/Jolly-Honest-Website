import type { Metadata } from "next";
import { getSession } from "@/lib/session";
import CheckoutForm from "@/components/store/CheckoutForm";
import CheckoutChoice from "@/components/store/CheckoutChoice";

export const metadata: Metadata = { title: "Checkout", robots: { index: false } };

export default async function CheckoutPage() {
  // Decided on the server; /api/checkout repeats the same checks independently.
  const session = await getSession();

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-8">
      <h1 className="mb-10 font-serif text-5xl font-light text-ink">Checkout</h1>
      {session?.emailVerified ? (
        <CheckoutForm mode={{ kind: "account", email: session.email }} />
      ) : (
        <CheckoutChoice unverifiedEmail={session?.email} />
      )}
    </div>
  );
}
