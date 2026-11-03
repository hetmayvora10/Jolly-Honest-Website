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
    const bookingId = session.metadata?.bookingId;

    // "completed" also fires for delayed payment methods that haven't
    // cleared yet; only mark the booking paid once the money is in.
    if (bookingId && session.payment_status === "paid") {
      const ref = getAdminDb().collection("bookings").doc(bookingId);
      await getAdminDb().runTransaction(async (tx) => {
        const booking = await tx.get(ref);
        // Stripe retries and can deliver an event twice: only the first
        // delivery for a session we created should change anything.
        if (
          !booking.exists ||
          booking.get("status") !== "pending_payment" ||
          booking.get("stripeSessionId") !== session.id
        ) {
          return;
        }
        tx.update(ref, { status: "paid", paidAt: Timestamp.now() });
      });
    }
  }

  return NextResponse.json({ received: true });
}
