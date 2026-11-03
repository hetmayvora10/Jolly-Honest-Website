import type { OrderStatus as Status } from "@/lib/orders";

const LABELS: Record<Status, { text: string; className: string }> = {
  paid: { text: "Paid", className: "bg-emerald-100 text-emerald-800" },
  pending_payment: { text: "Awaiting payment", className: "bg-amber-100 text-amber-800" },
  cancelled: { text: "Cancelled", className: "bg-zinc-200 text-zinc-700" },
};

export default function OrderStatus({ status }: { status: Status }) {
  const label = LABELS[status] ?? { text: status, className: "bg-zinc-100 text-zinc-700" };
  return (
    <span className={`inline-block px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] ${label.className}`}>
      {label.text}
    </span>
  );
}
