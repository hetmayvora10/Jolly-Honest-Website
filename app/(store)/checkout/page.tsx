import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import CheckoutForm from "@/components/store/CheckoutForm";
import { secondaryButton } from "@/components/store/ui";

export const metadata: Metadata = { title: "Checkout", robots: { index: false } };

export default async function CheckoutPage() {
  // Enforced on the server: the page never renders without a valid session,
  // and /api/checkout repeats the same checks independently.
  const session = await getSession();
  if (!session) redirect("/signin?next=/checkout");

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-8">
      <h1 className="mb-10 font-serif text-5xl font-light text-ink">Checkout</h1>
      {session.emailVerified ? (
        <CheckoutForm email={session.email} />
      ) : (
        <div className="max-w-xl bg-cream p-8">
          <h2 className="font-serif text-2xl text-ink">Please verify your email</h2>
          <p className="mt-4 leading-relaxed text-ink/75">
            We sent a verification link to <strong>{session.email}</strong> when you created your
            account. Once you&apos;ve clicked it, sign in again to continue to payment.
          </p>
          <Link href="/signin?next=/checkout" className={`${secondaryButton} mt-6`}>
            I&apos;ve verified — sign in again
          </Link>
        </div>
      )}
    </div>
  );
}
