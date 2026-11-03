import { NextResponse } from "next/server";
import { Timestamp } from "firebase-admin/firestore";
import { getAdminDb } from "@/lib/firebase/admin";
import { getStripe } from "@/lib/stripe";
import type Stripe from "stripe";

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return NextResponse.json({ error: "Missing webhook signature" }, { status: 400 });
  }

  const payload = await request.text();
  const stripe = getStripe();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (err) {
    console.error(
      "Stripe webhook signature verification failed",
      err instanceof Error ? err.message : "unknown error"
    );
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    // "completed" also fires for delayed payment methods that haven't
    // cleared yet; only mark anything paid once the money is in.
    if (session.payment_status === "paid") {
      if (session.metadata?.kind === "order" && session.metadata.orderId) {
        await markPaid("orders", session.metadata.orderId, session, "total");
      } else if (session.metadata?.bookingId) {
        await markPaid("bookings", session.metadata.bookingId, session, "depositAmount");
      }
    }
  }

  return NextResponse.json({ received: true });
}

async function markPaid(
  collection: "orders" | "bookings",
  id: string,
  session: Stripe.Checkout.Session,
  amountField: "total" | "depositAmount"
) {
  const ref = getAdminDb().collection(collection).doc(id);
  await getAdminDb().runTransaction(async (tx) => {
    const doc = await tx.get(ref);
    // Stripe retries and can deliver an event twice: only the first delivery
    // for a session we created, for the amount we expected, changes anything.
    if (
      !doc.exists ||
      doc.get("status") !== "pending_payment" ||
      doc.get("stripeSessionId") !== session.id
    ) {
      return;
    }
    if (session.amount_total !== doc.get(amountField) * 100) {
      console.error("Stripe amount mismatch", collection, id);
      return;
    }
    tx.update(ref, { status: "paid", paidAt: Timestamp.now() });
  });
}
