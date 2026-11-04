"use client";

import Link from "next/link";
import { useState } from "react";
import CheckoutForm from "./CheckoutForm";
import { primaryButton, secondaryButton } from "./ui";

const NEXT = encodeURIComponent("/checkout");

// Shown at checkout to anyone without a verified account session.
export default function CheckoutChoice({ unverifiedEmail }: { unverifiedEmail?: string | null }) {
  const [guest, setGuest] = useState(false);

  if (guest) {
    return (
      <>
        <button
          type="button"
          onClick={() => setGuest(false)}
          className="mb-8 min-h-10 text-[11px] uppercase tracking-[0.2em] text-ink/60 hover:text-burgundy"
        >
          ← Other checkout options
        </button>
        <CheckoutForm mode={{ kind: "guest" }} />
      </>
    );
  }

  return (
    <div className="grid gap-px border border-ink/10 bg-ink/10 md:grid-cols-2">
      <section className="flex flex-col bg-background p-8 sm:p-10">
        <p className="text-[11px] uppercase tracking-[0.3em] text-burgundy">No account needed</p>
        <h2 className="mt-3 font-serif text-3xl font-light text-ink">Checkout as Guest</h2>
        <p className="mt-4 flex-1 text-sm leading-relaxed text-ink/70">
          Pay with just your email and delivery address. You can create an account afterwards.
        </p>
        <button type="button" onClick={() => setGuest(true)} className={`${primaryButton} mt-8`}>
          Continue as Guest
        </button>
      </section>

      <section className="flex flex-col bg-background p-8 sm:p-10">
        <p className="text-[11px] uppercase tracking-[0.3em] text-burgundy">Members</p>
        <h2 className="mt-3 font-serif text-3xl font-light text-ink">Sign In or Join</h2>
        {unverifiedEmail ? (
          <p className="mt-4 flex-1 text-sm leading-relaxed text-ink/70">
            You&apos;re signed in as <strong>{unverifiedEmail}</strong>, but your email isn&apos;t
            verified yet. Click the link we emailed you, then sign in again — or continue as a guest.
          </p>
        ) : (
          <p className="mt-4 flex-1 text-sm leading-relaxed text-ink/70">
            Sign in to keep your orders in one place, or create an account in under a minute.
          </p>
        )}
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <Link href={`/signin?next=${NEXT}`} className={secondaryButton}>
            {unverifiedEmail ? "Sign In Again" : "Sign In"}
          </Link>
          {!unverifiedEmail && (
            <Link href={`/signup?next=${NEXT}`} className={secondaryButton}>
              Create Account
            </Link>
          )}
        </div>
      </section>
    </div>
  );
}
