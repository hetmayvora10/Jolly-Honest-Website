"use client";

import { useEffect, useState, type FormEvent } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from "firebase/auth";
import { getClientAuth } from "@/lib/firebase/client";
import type { BookingRecord } from "@/lib/booking";

const STATUS_STYLES: Record<string, string> = {
  paid: "bg-emerald-100 text-emerald-700",
  pending_payment: "bg-amber-100 text-amber-700",
  cancelled: "bg-zinc-200 text-zinc-600",
};

function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const form = new FormData(e.currentTarget);
    try {
      await signInWithEmailAndPassword(
        getClientAuth(),
        String(form.get("email")),
        String(form.get("password"))
      );
    } catch {
      setError("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex flex-1 items-center justify-center bg-cream px-6 py-24">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-3xl border border-burgundy/10 bg-white p-8 shadow-sm"
      >
        <h1 className="font-serif text-2xl font-semibold text-ink">Admin Sign In</h1>
        <p className="mt-1 text-sm text-ink/60">Jolly &amp; Honest bookings dashboard</p>

        <label className="mt-6 flex flex-col gap-1.5 text-sm font-medium text-ink">
          Email
          <input
            name="email"
            type="email"
            required
            className="rounded-xl border border-burgundy/15 px-4 py-2.5 text-base focus:border-burgundy"
          />
        </label>
        <label className="mt-4 flex flex-col gap-1.5 text-sm font-medium text-ink">
          Password
          <input
            name="password"
            type="password"
            required
            className="rounded-xl border border-burgundy/15 px-4 py-2.5 text-base focus:border-burgundy"
          />
        </label>

        {error && <p role="alert" className="mt-4 text-sm text-red-700">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-full bg-burgundy px-6 py-3 text-sm font-semibold text-cream pressable hover:bg-burgundy-dark disabled:opacity-60"
        >
          {loading ? "Signing in…" : "Sign In"}
        </button>
      </form>
    </main>
  );
}

function Dashboard({ user }: { user: User }) {
  const [bookings, setBookings] = useState<BookingRecord[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const idToken = await user.getIdToken();
        const res = await fetch("/api/admin/bookings", {
          headers: { Authorization: `Bearer ${idToken}` },
        });
        if (!res.ok) throw new Error("Failed to load bookings");
        const data = await res.json();
        if (!cancelled) setBookings(data.bookings);
      } catch {
        if (!cancelled) setError("Could not load bookings.");
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [user]);

  return (
    <main className="flex flex-1 flex-col bg-cream px-6 py-10 sm:px-10">
      <div className="mx-auto w-full max-w-5xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-serif text-3xl font-semibold text-ink">Bookings</h1>
            <p className="text-sm text-ink/60">Signed in as {user.email}</p>
          </div>
          <button
            onClick={() => signOut(getClientAuth())}
            className="min-h-11 rounded-full border border-burgundy/30 px-5 text-sm font-semibold text-burgundy pressable hover:bg-burgundy/5"
          >
            Sign Out
          </button>
        </div>

        <div className="mt-8 overflow-x-auto rounded-2xl border border-burgundy/10 bg-white">
          {error && <p role="alert" className="p-6 text-sm text-red-700">{error}</p>}
          {!error && !bookings && <p className="p-6 text-sm text-ink/60">Loading…</p>}
          {!error && bookings && bookings.length === 0 && (
            <p className="p-6 text-sm text-ink/60">No bookings yet.</p>
          )}
          {!error && bookings && bookings.length > 0 && (
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead>
                <tr className="border-b border-burgundy/10 text-xs uppercase tracking-wide text-ink/60">
                  <th className="px-5 py-3">Name</th>
                  <th className="px-5 py-3">Phone</th>
                  <th className="px-5 py-3">Service</th>
                  <th className="px-5 py-3">Preferred Date</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Deposit</th>
                  <th className="px-5 py-3">Submitted</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b.id} className="border-b border-burgundy/5 last:border-0">
                    <td className="px-5 py-3 font-medium text-ink">{b.name}</td>
                    <td className="px-5 py-3 text-ink/70">{b.phone}</td>
                    <td className="px-5 py-3 text-ink/70">{b.service}</td>
                    <td className="px-5 py-3 text-ink/70">{b.preferredDate}</td>
                    <td className="px-5 py-3">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          STATUS_STYLES[b.status] ?? "bg-zinc-100 text-zinc-600"
                        }`}
                      >
                        {b.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-ink/70">₹{b.depositAmount}</td>
                    <td className="px-5 py-3 text-ink/60">
                      {b.createdAt ? new Date(b.createdAt).toLocaleString() : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </main>
  );
}

export default function AdminPage() {
  const [user, setUser] = useState<User | null | undefined>(undefined);

  useEffect(() => onAuthStateChanged(getClientAuth(), setUser), []);

  if (user === undefined) {
    return (
      <main className="flex flex-1 items-center justify-center bg-cream">
        <p className="text-sm text-ink/60">Loading…</p>
      </main>
    );
  }

  return user ? <Dashboard user={user} /> : <LoginForm />;
}
