import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { getOrderFor } from "@/lib/customer-data";
import OrderDetail from "@/components/store/OrderDetail";

export const metadata: Metadata = { title: "Order", robots: { index: false } };

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ status?: string }>;
};

export default async function OrderPage({ params, searchParams }: Props) {
  const { id } = await params;
  const session = await getSession();
  if (!session) redirect(`/signin?next=/account/orders/${encodeURIComponent(id)}`);

  // Someone else's order ID gives the same 404 as a made-up one, so order
  // IDs can't be probed to learn whether they exist.
  const order = await getOrderFor(session.uid, id);
  if (!order) notFound();

  const justPaid = (await searchParams).status === "success";

  return (
    <OrderDetail
      order={order}
      justPaid={justPaid}
      back={
        <Link href="/account" className="text-[11px] uppercase tracking-[0.2em] text-ink/60 hover:text-burgundy">
          ← My Account
        </Link>
      }
    />
  );
}
