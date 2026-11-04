import { NextResponse } from "next/server";
import { z } from "zod";
import { Timestamp } from "firebase-admin/firestore";
import { getAdminDb } from "@/lib/firebase/admin";
import { getStripe } from "@/lib/stripe";
import {
  getSession,
  readGuestOrderIds,
  createGuestOrdersToken,
  GUEST_ORDERS_COOKIE,
  guestOrdersCookieOptions,
} from "@/lib/session";
import { rejectCrossSite } from "@/lib/http";
import { isRateLimited, clientIp } from "@/lib/rate-limit";
import { cartLineSchema, priceCart, MAX_LINES } from "@/lib/pricing";
import { addressSchema } from "@/lib/orders";

const bodySchema = z.object({
  lines: z.array(cartLineSchema).max(MAX_LINES),
  address: addressSchema,
  // Present only for guest checkout.
  guestEmail: z.email("Enter a valid email address").trim().toLowerCase().max(254).optional(),
  // Honeypot: real shoppers never see or fill this.
  website: z.string().max(0).optional(),
});

export async function POST(request: Request) {
  const rejected = rejectCrossSite(request);
  if (rejected) return rejected;

  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid checkout details" },
      { status: 400 }
    );
  }
  const { lines, address, guestEmail } = parsed.data;

  // Who is buying: a verified account holder, or a guest who gave an email.
  const session = await getSession();
  const asGuest = guestEmail !== undefined;
  if (!asGuest) {
    if (!session) {
      return NextResponse.json({ error: "Please sign in or continue as a guest." }, { status: 401 });
    }
    if (!session.emailVerified) {
      return NextResponse.json(
        { error: "Please verify your email, or continue as a guest." },
        { status: 403 }
      );
    }
  }

  // Prices come from the catalogue on the server, never from the request.
  const pricing = priceCart(lines);
  if (!pricing.ok) {
    return NextResponse.json({ error: pricing.error }, { status: 400 });
  }

  // Guests have no account to rate limit, so limit by IP instead.
  const limitKey = asGuest ? `checkout:ip:${clientIp(request)}` : `checkout:${session!.uid}`;
  if (await isRateLimited(limitKey, { limit: 10, windowMs: 60 * 60 * 1000 })) {
    return NextResponse.json({ error: "Too many checkout attempts. Please try again later." }, { status: 429 });
  }

  const total = pricing.subtotal; // Shipping is free in the demo store.
  const orderRef = getAdminDb().collection("orders").doc();
  await orderRef.set({
    uid: asGuest ? null : session!.uid,
    guest: asGuest,
    email: asGuest ? guestEmail : session!.email,
    lines: pricing.lines,
    subtotal: pricing.subtotal,
    total,
    address,
    status: "pending_payment",
    createdAt: Timestamp.now(),
  });

  const siteOrigin = new URL(request.url).origin;
  const orderPath = asGuest ? `/orders/${orderRef.id}` : `/account/orders/${orderRef.id}`;
  try {
    const checkout = await getStripe().checkout.sessions.create({
      mode: "payment",
      customer_email: (asGuest ? guestEmail : session!.email) ?? undefined,
      line_items: pricing.lines.map((line) => ({
        quantity: line.qty,
        price_data: {
          currency: "inr",
          unit_amount: line.unitPrice * 100,
          product_data: { name: `${line.name} — ${line.size} / ${line.color}` },
        },
      })),
      metadata: { kind: "order", orderId: orderRef.id },
      success_url: `${siteOrigin}${orderPath}?status=success`,
      cancel_url: `${siteOrigin}/bag`,
    });

    await orderRef.update({ stripeSessionId: checkout.id });

    const res = NextResponse.json({ url: checkout.url });
    if (asGuest) {
      const ids = [...(await readGuestOrderIds()), orderRef.id];
      res.cookies.set(GUEST_ORDERS_COOKIE, await createGuestOrdersToken(ids), guestOrdersCookieOptions);
    }
    return res;
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
