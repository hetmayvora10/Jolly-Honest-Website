"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useBag } from "@/lib/bag";
import { formatINR, getProduct } from "@/lib/catalog";
import { INDIAN_STATES } from "@/lib/orders";
import { errorBox, fieldInput, fieldLabel, primaryButton } from "./ui";

type Mode = { kind: "account"; email: string | null } | { kind: "guest" };

export default function CheckoutForm({ mode }: { mode: Mode }) {
  const lines = useBag();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const items = lines.flatMap((line) => {
    const product = getProduct(line.productId);
    return product ? [{ line, product }] : [];
  });
  const subtotal = items.reduce((sum, { line, product }) => sum + product.price * line.qty, 0);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const form = new FormData(e.currentTarget);
    const address = Object.fromEntries(
      ["fullName", "phone", "line1", "line2", "city", "state", "pincode"].map((k) => [k, String(form.get(k) ?? "")])
    );

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // References only — the server looks up every price itself.
        body: JSON.stringify({
          lines: items.map(({ line }) => line),
          address,
          ...(mode.kind === "guest"
            ? { guestEmail: String(form.get("guestEmail") ?? ""), website: String(form.get("website") ?? "") }
            : {}),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        setSubmitting(false);
        return;
      }
      window.location.assign(data.url);
    } catch {
      setError("Network error. Please check your connection and try again.");
      setSubmitting(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="font-serif text-3xl font-light text-ink">Your bag is empty.</p>
        <Link href="/shop" className="mt-8 inline-flex min-h-12 items-center border-b border-ink text-[11px] uppercase tracking-[0.3em] text-ink hover:text-burgundy">
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-12 lg:grid-cols-[1.4fr_1fr]">
      <fieldset className="grid gap-5 sm:grid-cols-2">
        <legend className="mb-6 font-serif text-2xl text-ink">Delivery Address</legend>
        {mode.kind === "account" ? (
          <p className="text-sm text-ink/70 sm:col-span-2">Signed in as {mode.email}</p>
        ) : (
          <>
            {/* Honeypot — hidden from real shoppers, bots tend to fill every field */}
            <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
            <label className={`${fieldLabel} sm:col-span-2`}>
              Email
              <input name="guestEmail" type="email" required maxLength={254} autoComplete="email" className={fieldInput} />
              <span className="normal-case tracking-normal text-ink/60">For your order confirmation from Stripe.</span>
            </label>
          </>
        )}
        <label className={`${fieldLabel} sm:col-span-2`}>
          Full name
          <input name="fullName" required minLength={2} maxLength={100} autoComplete="name" className={fieldInput} />
        </label>
        <label className={fieldLabel}>
          Phone
          <input name="phone" type="tel" required autoComplete="tel" placeholder="+91 98765 43210" className={fieldInput} />
        </label>
        <label className={fieldLabel}>
          PIN code
          <input name="pincode" required inputMode="numeric" pattern="[1-9][0-9]{5}" maxLength={6} autoComplete="postal-code" className={fieldInput} />
        </label>
        <label className={`${fieldLabel} sm:col-span-2`}>
          Address line 1
          <input name="line1" required minLength={3} maxLength={150} autoComplete="address-line1" className={fieldInput} />
        </label>
        <label className={`${fieldLabel} sm:col-span-2`}>
          Address line 2 (optional)
          <input name="line2" maxLength={150} autoComplete="address-line2" className={fieldInput} />
        </label>
        <label className={fieldLabel}>
          City
          <input name="city" required minLength={2} maxLength={60} autoComplete="address-level2" className={fieldInput} />
        </label>
        <label className={fieldLabel}>
          State
          <select name="state" required defaultValue="Gujarat" autoComplete="address-level1" className={fieldInput}>
            {INDIAN_STATES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </label>
      </fieldset>

      <aside className="h-fit bg-cream p-8">
        <h2 className="font-serif text-2xl text-ink">Your Order</h2>
        <ul className="mt-6 space-y-3 text-sm">
          {items.map(({ line, product }) => (
            <li key={`${line.productId}-${line.size}-${line.color}`} className="flex justify-between gap-4">
              <span className="text-ink/80">
                {product.name} <span className="text-ink/60">· {line.size} · ×{line.qty}</span>
              </span>
              <span>{formatINR(product.price * line.qty)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-6 flex justify-between border-t border-ink/10 pt-4 text-base">
          <span>Total</span>
          <span>{formatINR(subtotal)}</span>
        </div>
        {error && <p role="alert" className={`${errorBox} mt-6`}>{error}</p>}
        <button type="submit" disabled={submitting} className={`${primaryButton} mt-8`}>
          {submitting ? "Redirecting to payment…" : "Pay Securely with Stripe"}
        </button>
        <p className="mt-4 text-center text-xs leading-relaxed text-ink/60">
          Test mode: use card 4242 4242 4242 4242, any future date and any CVC. No real money moves.
        </p>
      </aside>
    </form>
  );
}
