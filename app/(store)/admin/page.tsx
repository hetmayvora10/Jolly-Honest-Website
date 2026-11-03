import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { isAdminEmail } from "@/lib/firebase/verify-token";
import { listBookings, listOrders } from "@/lib/admin-data";
import { formatINR } from "@/lib/catalog";
import SignOutButton from "@/components/store/SignOutButton";
import OrderStatus from "@/components/store/OrderStatus";

export const metadata: Metadata = { title: "Admin", robots: { index: false } };

const BOOKING_STYLES: Record<string, string> = {
  paid: "bg-emerald-100 text-emerald-800",
  pending_payment: "bg-amber-100 text-amber-800",
  cancelled: "bg-zinc-200 text-zinc-700",
};

const dateTime = (iso: string) =>
  iso ? new Date(iso).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }) : "—";

export default async function AdminPage() {
  // Checked on the server before any customer data is read. The data never
  // reaches the browser unless both checks pass.
  const session = await getSession();
  if (!session) redirect("/signin?next=/admin");

  if (!isAdminEmail(session.email)) {
    return (
      <div className="mx-auto w-full max-w-md px-4 py-28 text-center">
        <h1 className="font-serif text-4xl font-light text-ink">Not authorised</h1>
        <p role="alert" className="mt-4 text-ink/70">This account is not authorised to view the admin dashboard.</p>
        <div className="mt-8"><SignOutButton /></div>
      </div>
    );
  }

  const [bookings, orders] = await Promise.all([listBookings(), listOrders()]);
  const th = "px-5 py-3 font-medium";
  const td = "px-5 py-3 text-ink/75";

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.4em] text-burgundy">Admin</p>
          <h1 className="mt-3 font-serif text-5xl font-light text-ink">Dashboard</h1>
          <p className="mt-2 text-sm text-ink/60">Signed in as {session.email}</p>
        </div>
        <SignOutButton />
      </div>

      <section className="mt-14">
        <h2 className="font-serif text-3xl font-light text-ink">Fitting Bookings</h2>
        <div className="mt-6 overflow-x-auto border border-ink/10 bg-white">
          {bookings.length === 0 ? (
            <p className="p-6 text-sm text-ink/60">No bookings yet.</p>
          ) : (
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead>
                <tr className="border-b border-ink/10 text-[11px] uppercase tracking-[0.15em] text-ink/60">
                  <th className={th}>Name</th><th className={th}>Phone</th><th className={th}>Service</th>
                  <th className={th}>Preferred Date</th><th className={th}>Status</th><th className={th}>Deposit</th><th className={th}>Submitted</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b.id} className="border-b border-ink/5 last:border-0">
                    <td className="px-5 py-3 font-medium text-ink">{b.name}</td>
                    <td className={td}>{b.phone}</td>
                    <td className={td}>{b.service}</td>
                    <td className={td}>{b.preferredDate}</td>
                    <td className="px-5 py-3">
                      <span className={`px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] ${BOOKING_STYLES[b.status] ?? "bg-zinc-100 text-zinc-700"}`}>
                        {b.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className={td}>{formatINR(b.depositAmount)}</td>
                    <td className={td}>{dateTime(b.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>

      <section className="mt-14">
        <h2 className="font-serif text-3xl font-light text-ink">Store Orders <span className="text-base text-ink/50">(demo)</span></h2>
        <div className="mt-6 overflow-x-auto border border-ink/10 bg-white">
          {orders.length === 0 ? (
            <p className="p-6 text-sm text-ink/60">No orders yet.</p>
          ) : (
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead>
                <tr className="border-b border-ink/10 text-[11px] uppercase tracking-[0.15em] text-ink/60">
                  <th className={th}>Order</th><th className={th}>Customer</th><th className={th}>Items</th>
                  <th className={th}>Status</th><th className={th}>Total</th><th className={th}>Placed</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id} className="border-b border-ink/5 last:border-0">
                    <td className="px-5 py-3 font-medium text-ink">{o.id.slice(0, 8).toUpperCase()}</td>
                    <td className={td}>{o.address?.fullName}<br /><span className="text-xs">{o.email}</span></td>
                    <td className={td}>{o.lines.reduce((n, l) => n + l.qty, 0)}</td>
                    <td className="px-5 py-3"><OrderStatus status={o.status} /></td>
                    <td className={td}>{formatINR(o.total)}</td>
                    <td className={td}>{dateTime(o.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </div>
  );
}
