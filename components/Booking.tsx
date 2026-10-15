"use client";

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { SERVICES } from "@/lib/booking";

type Status = "idle" | "submitting" | "error";

export default function Booking() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setError(null);

    const form = new FormData(e.currentTarget);
    const payload = {
      name: form.get("name"),
      phone: form.get("phone"),
      email: form.get("email"),
      service: form.get("service"),
      preferredDate: form.get("preferredDate"),
      notes: form.get("notes"),
      website: form.get("website"),
    };

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }

      window.location.href = data.url;
    } catch {
      setError("Network error. Please check your connection and try again.");
      setStatus("error");
    }
  }

  return (
    <section id="book" className="bg-white">
      <div className="mx-auto max-w-3xl px-6 py-24 sm:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-burgundy/70">
            Reserve Your Slot
          </p>
          <h2 className="mt-4 font-serif text-4xl font-semibold text-ink sm:text-5xl">
            Book a Fitting
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-lg leading-relaxed text-ink/70">
            A ₹500 refundable deposit confirms your appointment and holds your
            slot with one of our master tailors.
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          onSubmit={handleSubmit}
          className="mt-12 grid gap-5 rounded-3xl border border-burgundy/10 bg-cream p-8 sm:grid-cols-2 sm:p-10"
        >
          {/* Honeypot — hidden from real users, bots tend to fill every field */}
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            className="hidden"
            aria-hidden="true"
          />

          <label className="flex flex-col gap-1.5 text-sm font-medium text-ink">
            Full Name
            <input
              name="name"
              required
              minLength={2}
              className="rounded-xl border border-burgundy/15 bg-white px-4 py-3 text-base text-ink outline-none focus:border-burgundy"
            />
          </label>

          <label className="flex flex-col gap-1.5 text-sm font-medium text-ink">
            Phone Number
            <input
              name="phone"
              type="tel"
              required
              placeholder="+91 98765 43210"
              className="rounded-xl border border-burgundy/15 bg-white px-4 py-3 text-base text-ink outline-none focus:border-burgundy"
            />
          </label>

          <label className="flex flex-col gap-1.5 text-sm font-medium text-ink">
            Email (optional)
            <input
              name="email"
              type="email"
              className="rounded-xl border border-burgundy/15 bg-white px-4 py-3 text-base text-ink outline-none focus:border-burgundy"
            />
          </label>

          <label className="flex flex-col gap-1.5 text-sm font-medium text-ink">
            Service
            <select
              name="service"
              required
              defaultValue=""
              className="rounded-xl border border-burgundy/15 bg-white px-4 py-3 text-base text-ink outline-none focus:border-burgundy"
            >
              <option value="" disabled>
                Choose a service
              </option>
              {SERVICES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1.5 text-sm font-medium text-ink sm:col-span-2">
            Preferred Date
            <input
              name="preferredDate"
              type="date"
              required
              className="rounded-xl border border-burgundy/15 bg-white px-4 py-3 text-base text-ink outline-none focus:border-burgundy"
            />
          </label>

          <label className="flex flex-col gap-1.5 text-sm font-medium text-ink sm:col-span-2">
            Notes (optional)
            <textarea
              name="notes"
              rows={3}
              maxLength={500}
              placeholder="Tell us about the occasion, fabric preference, etc."
              className="resize-none rounded-xl border border-burgundy/15 bg-white px-4 py-3 text-base text-ink outline-none focus:border-burgundy"
            />
          </label>

          {error && (
            <p className="sm:col-span-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={status === "submitting"}
            className="sm:col-span-2 mt-2 rounded-full bg-burgundy px-8 py-3.5 text-sm font-semibold tracking-wide text-cream transition-colors hover:bg-burgundy-dark disabled:opacity-60"
          >
            {status === "submitting" ? "Redirecting to payment…" : "Pay ₹500 Deposit & Book"}
          </button>
        </motion.form>
      </div>
    </section>
  );
}
