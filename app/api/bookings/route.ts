import { NextResponse } from "next/server";
import { Timestamp } from "firebase-admin/firestore";
import { getAdminDb } from "@/lib/firebase/admin";
import { getStripe, DEPOSIT_AMOUNT_INR } from "@/lib/stripe";
import { bookingSchema } from "@/lib/booking";
import { isRateLimited, clientIp } from "@/lib/rate-limit";
import { rejectCrossSite } from "@/lib/http";

const DUPLICATE_WINDOW_MINUTES = 10;
const BOOKINGS_PER_IP_PER_HOUR = 5;

export async function POST(request: Request) {
  const rejected = rejectCrossSite(request);
  if (rejected) return rejected;
  const siteOrigin = new URL(request.url).origin;

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

  // The phone-number duplicate check below is trivially dodged by varying the
  // number, so cap how many bookings (and Stripe sessions) one IP can create.
  if (
    await isRateLimited(`booking:${clientIp(request)}`, {
      limit: BOOKINGS_PER_IP_PER_HOUR,
      windowMs: 60 * 60 * 1000,
    })
  ) {
    return NextResponse.json(
      { error: "Too many booking attempts. Please try again later or call us directly." },
      { status: 429 }
    );
  }

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
      // Built from the request URL, not the client-controlled Origin header,
      // so a forged header can't send customers to another site after paying.
      success_url: `${siteOrigin}/booking/success?booking_id=${bookingRef.id}`,
      cancel_url: `${siteOrigin}/#book`,
    });

    await bookingRef.update({ stripeSessionId: session.id });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    await bookingRef.update({ status: "cancelled", error: "stripe_session_failed" });
    // Message only: the full error object can carry request details.
    console.error(
      "Stripe checkout session creation failed",
      bookingRef.id,
      err instanceof Error ? err.message : "unknown error"
    );
    return NextResponse.json(
      { error: "Could not start payment. Please try again or call us directly." },
      { status: 502 }
    );
  }
}
