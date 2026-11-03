import { NextResponse } from "next/server";
import { z } from "zod";
import { Timestamp } from "firebase-admin/firestore";
import { getAdminDb } from "@/lib/firebase/admin";
import { getStripe } from "@/lib/stripe";
import { getSession } from "@/lib/session";
import { rejectCrossSite } from "@/lib/http";
import { isRateLimited } from "@/lib/rate-limit";
import { cartLineSchema, priceCart, MAX_LINES } from "@/lib/pricing";
import { addressSchema } from "@/lib/orders";

const bodySchema = z.object({
  lines: z.array(cartLineSchema).max(MAX_LINES),
  address: addressSchema,
});

export async function POST(request: Request) {
  const rejected = rejectCrossSite(request);
  if (rejected) return rejected;

  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Please sign in to check out." }, { status: 401 });
  }
  if (!session.emailVerified) {
    return NextResponse.json({ error: "Please verify your email before checking out." }, { status: 403 });
  }

  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid checkout details" },
      { status: 400 }
    );
  }

  // Prices come from the catalogue on the server, never from the request.
  const pricing = priceCart(parsed.data.lines);
  if (!pricing.ok) {
    return NextResponse.json({ error: pricing.error }, { status: 400 });
  }

  if (await isRateLimited(`checkout:${session.uid}`, { limit: 10, windowMs: 60 * 60 * 1000 })) {
    return NextResponse.json({ error: "Too many checkout attempts. Please try again later." }, { status: 429 });
  }

  const total = pricing.subtotal; // Shipping is free in the demo store.
  const orderRef = getAdminDb().collection("orders").doc();
  await orderRef.set({
    uid: session.uid,
    email: session.email,
    lines: pricing.lines,
    subtotal: pricing.subtotal,
    total,
    address: parsed.data.address,
    status: "pending_payment",
    createdAt: Timestamp.now(),
  });

  const siteOrigin = new URL(request.url).origin;
  try {
    const checkout = await getStripe().checkout.sessions.create({
      mode: "payment",
      customer_email: session.email ?? undefined,
      line_items: pricing.lines.map((line) => ({
        quantity: line.qty,
        price_data: {
          currency: "inr",
          unit_amount: line.unitPrice * 100,
          product_data: { name: `${line.name} — ${line.size} / ${line.color}` },
        },
      })),
      metadata: { kind: "order", orderId: orderRef.id },
      success_url: `${siteOrigin}/account/orders/${orderRef.id}?status=success`,
      cancel_url: `${siteOrigin}/bag`,
    });

    await orderRef.update({ stripeSessionId: checkout.id });
    return NextResponse.json({ url: checkout.url });
  } catch (err) {
    await orderRef.update({ status: "cancelled", error: "stripe_session_failed" });
    console.error(
      "Stripe checkout session creation failed",
      orderRef.id,
      err instanceof Error ? err.message : "unknown error"
    );
    return NextResponse.json({ error: "Could not start payment. Please try again." }, { status: 502 });
  }
}
