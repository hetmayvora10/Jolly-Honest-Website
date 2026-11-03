import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { listOrdersFor } from "@/lib/customer-data";
import { isAdminEmail } from "@/lib/firebase/verify-token";
import { formatINR } from "@/lib/catalog";
import SignOutButton from "@/components/store/SignOutButton";
import OrderStatus from "@/components/store/OrderStatus";

export const metadata: Metadata = { title: "My Account", robots: { index: false } };

type Props = { searchParams: Promise<{ welcome?: string }> };

export default async function AccountPage({ searchParams }: Props) {
  const session = await getSession();
  if (!session) redirect("/signin?next=/account");

  const welcome = (await searchParams).welcome === "1";
  const orders = await listOrdersFor(session.uid);

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-16 sm:px-8">
      <div className="flex flex-col gap-6 border-b border-ink/10 pb-10 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[0.4em] text-burgundy">My Account</p>
          <h1 className="mt-4 font-serif text-5xl font-light text-ink">{welcome ? "Welcome" : "Hello"}</h1>
          <p className="mt-3 text-sm text-ink/70">{session.email}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          {isAdminEmail(session.email) && (
            <Link href="/admin" className="inline-flex min-h-12 items-center border border-burgundy px-6 text-[11px] font-semibold uppercase tracking-[0.25em] text-burgundy">
              Admin Dashboard
            </Link>
          )}
          <SignOutButton />
        </div>
      </div>

      {!session.emailVerified && (
        <p role="status" className="mt-8 border-l-2 border-gold-dark bg-cream px-5 py-4 text-sm leading-relaxed text-ink">
          {welcome ? "Your account is ready. " : ""}We&apos;ve emailed a verification link to{" "}
          <strong>{session.email}</strong>. Click it, then sign in again to unlock checkout.
        </p>
      )}

      <section className="mt-12">
        <h2 className="font-serif text-3xl font-light text-ink">Orders</h2>
        {orders.length === 0 ? (
          <p className="mt-6 text-ink/70">
            No orders yet.{" "}
            <Link href="/shop" className="text-ink underline underline-offset-4 hover:text-burgundy">Explore the collections</Link>
          </p>
        ) : (
          <ul className="mt-6 divide-y divide-ink/10 border-y border-ink/10">
            {orders.map((order) => (
              <li key={order.id}>
                <Link href={`/account/orders/${order.id}`} className="flex flex-wrap items-center justify-between gap-4 py-5 hover:bg-cream/60">
                  <div>
                    <p className="text-sm text-ink">Order {order.id.slice(0, 8).toUpperCase()}</p>
                    <p className="mt-1 text-xs text-ink/60">
                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString("en-IN", { dateStyle: "medium" }) : "—"} ·{" "}
                      {order.lines.reduce((n, l) => n + l.qty, 0)} items
                    </p>
                  </div>
                  <div className="flex items-center gap-6">
                    <OrderStatus status={order.status} />
                    <span className="text-sm text-ink">{formatINR(order.total)}</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
