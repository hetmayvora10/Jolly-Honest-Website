import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { readGuestOrderIds } from "@/lib/session";
import { getGuestOrder } from "@/lib/customer-data";
import OrderDetail from "@/components/store/OrderDetail";

export const metadata: Metadata = { title: "Order", robots: { index: false } };

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ status?: string }>;
};

// Guest order confirmation. Viewable only from the browser that placed the
// order (its signed guest-orders cookie); anyone else gets a 404.
export default async function GuestOrderPage({ params, searchParams }: Props) {
  const { id } = await params;
  const order = await getGuestOrder(id, await readGuestOrderIds());
  if (!order) notFound();

  const justPaid = (await searchParams).status === "success";

  return (
    <>
      <OrderDetail
        order={order}
        justPaid={justPaid}
        back={
          <Link href="/shop" className="text-[11px] uppercase tracking-[0.2em] text-ink/60 hover:text-burgundy">
            ← Continue shopping
          </Link>
        }
      />
      <div className="mx-auto mb-16 w-full max-w-4xl px-4 sm:px-8">
        <p className="bg-cream p-6 text-sm leading-relaxed text-ink/75">
          You checked out as a guest, so this page is only available on this device. Want to keep
          track of future orders?{" "}
          <Link href="/signup" className="text-ink underline underline-offset-4 hover:text-burgundy">
            Create an account
          </Link>
          .
        </p>
      </div>
    </>
  );
}
