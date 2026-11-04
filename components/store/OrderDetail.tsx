import type { ReactNode } from "react";
import { formatINR } from "@/lib/catalog";
import type { OrderRecord } from "@/lib/orders";
import OrderStatus from "./OrderStatus";
import ClearBagOnSuccess from "./ClearBagOnSuccess";

export default function OrderDetail({
  order,
  justPaid,
  back,
}: {
  order: OrderRecord;
  justPaid: boolean;
  back: ReactNode;
}) {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-16 sm:px-8">
      {justPaid && <ClearBagOnSuccess />}
      {back}

      {justPaid && (
        <div className="mt-8 bg-cream p-8 text-center">
          <p className="text-[11px] uppercase tracking-[0.4em] text-burgundy">Thank you</p>
          <p className="mt-3 font-serif text-4xl font-light text-ink">Your order is placed</p>
          <p className="mt-3 text-sm text-ink/70">
            {order.status === "paid"
              ? "Payment confirmed."
              : "We're confirming your payment with Stripe — refresh in a moment to see it update."}{" "}
            This is a demo store, so nothing will be shipped.
          </p>
        </div>
      )}

      <div className="mt-10 flex flex-wrap items-end justify-between gap-4 border-b border-ink/10 pb-6">
        <div>
          <h1 className="font-serif text-4xl font-light text-ink">Order {order.id.slice(0, 8).toUpperCase()}</h1>
          <p className="mt-2 text-xs text-ink/60">
            Placed {order.createdAt ? new Date(order.createdAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }) : "—"}
          </p>
        </div>
        <OrderStatus status={order.status} />
      </div>

      <ul className="divide-y divide-ink/10">
        {order.lines.map((line) => (
          <li key={`${line.productId}-${line.size}-${line.color}`} className="flex justify-between gap-4 py-5 text-sm">
            <div>
              <p className="text-ink">{line.name}</p>
              <p className="mt-1 text-xs text-ink/60">
                {line.color} · Size {line.size} · Qty {line.qty}
              </p>
            </div>
            <p className="text-ink">{formatINR(line.lineTotal)}</p>
          </li>
        ))}
      </ul>

      <div className="grid gap-10 border-t border-ink/10 pt-8 sm:grid-cols-2">
        <div>
          <h2 className="text-[11px] uppercase tracking-[0.25em] text-ink/70">Delivery address</h2>
          <address className="mt-3 text-sm not-italic leading-relaxed text-ink">
            {order.address.fullName}<br />
            {order.address.line1}<br />
            {order.address.line2 && <>{order.address.line2}<br /></>}
            {order.address.city}, {order.address.state} {order.address.pincode}<br />
            {order.address.phone}
          </address>
        </div>
        <dl className="space-y-2 text-sm sm:text-right">
          <div className="flex justify-between sm:justify-end sm:gap-10"><dt className="text-ink/70">Subtotal</dt><dd>{formatINR(order.subtotal)}</dd></div>
          <div className="flex justify-between sm:justify-end sm:gap-10"><dt className="text-ink/70">Delivery</dt><dd>Complimentary</dd></div>
          <div className="flex justify-between text-base sm:justify-end sm:gap-10"><dt>Total</dt><dd>{formatINR(order.total)}</dd></div>
        </dl>
      </div>
    </div>
  );
}
