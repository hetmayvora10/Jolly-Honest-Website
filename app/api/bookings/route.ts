import { NextResponse } from "next/server";
import { Timestamp } from "firebase-admin/firestore";
import { getAdminDb } from "@/lib/firebase/admin";
import { getStripe, DEPOSIT_AMOUNT_INR } from "@/lib/stripe";
import { bookingSchema } from "@/lib/booking";

const DUPLICATE_WINDOW_MINUTES = 10;

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = bookingSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid submission" },
      { status: 400 }
    );
  }

  // Honeypot field was filled in — silently pretend success so bots don't learn.
  if (parsed.data.website) {
    return NextResponse.json({ url: "/" });
  }

  const { name, phone, email, service, preferredDate, notes } = parsed.data;

  const db = getAdminDb();

  const cutoff = Timestamp.fromMillis(Date.now() - DUPLICATE_WINDOW_MINUTES * 60 * 1000);
  const recentDuplicate = await db
    .collection("bookings")
    .where("phone", "==", phone)
    .where("createdAt", ">", cutoff)
    .limit(1)
    .get();

  if (!recentDuplicate.empty) {
    return NextResponse.json(
      { error: "A booking request from this number was just submitted. Please wait a few minutes." },
      { status: 429 }
    );
  }

  const bookingRef = db.collection("bookings").doc();
  await bookingRef.set({
    name,
    phone,
    email: email || null,
    service,
    preferredDate,
    notes: notes || null,
    status: "pending_payment",
    depositAmount: DEPOSIT_AMOUNT_INR,
    createdAt: Timestamp.now(),
  });

  const origin = request.headers.get("origin") ?? new URL(request.url).origin;

  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "inr",
            unit_amount: DEPOSIT_AMOUNT_INR * 100,
            product_data: {
              name: `Fitting Deposit — ${service}`,
              description: "Refundable deposit to confirm your fitting appointment at Jolly & Honest.",
            },
          },
          quantity: 1,
        },
      ],
      metadata: { bookingId: bookingRef.id },
      success_url: `${origin}/booking/success?booking_id=${bookingRef.id}`,
      cancel_url: `${origin}/#book`,
    });

    await bookingRef.update({ stripeSessionId: session.id });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    await bookingRef.update({ status: "cancelled", error: "stripe_session_failed" });
    console.error("Stripe checkout session creation failed", err);
    return NextResponse.json(
      { error: "Could not start payment. Please try again or call us directly." },
      { status: 502 }
    );
  }
}
