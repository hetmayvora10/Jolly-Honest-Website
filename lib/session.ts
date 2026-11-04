import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

// Customer and admin sessions live in an HttpOnly cookie that page scripts
// can't read, rather than as Firebase tokens in browser storage. Firebase
// only proves who someone is at sign-in; after that this cookie is the
// credential, signed with SESSION_SECRET (server-only, never NEXT_PUBLIC_).

export const SESSION_COOKIE = "jh_session";
const SESSION_DAYS = 7;
const ISSUER = "jollyhonest";
const AUDIENCE = "jollyhonest:session";

export type Session = {
  uid: string;
  email: string | null;
  emailVerified: boolean;
};

function secretKey(): Uint8Array {
  const secret = process.env.SESSION_SECRET;
  // 32+ bytes of randomness; a short or missing secret fails closed.
  if (!secret || secret.length < 32) {
    throw new Error("SESSION_SECRET must be set to at least 32 characters");
  }
  return new TextEncoder().encode(secret);
}

export async function createSessionToken(session: Session): Promise<string> {
  return new SignJWT({ email: session.email, ev: session.emailVerified })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(session.uid)
    .setIssuer(ISSUER)
    .setAudience(AUDIENCE)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DAYS}d`)
    .sign(secretKey());
}

export async function readSessionToken(token: string | undefined): Promise<Session | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secretKey(), {
      issuer: ISSUER,
      audience: AUDIENCE,
      algorithms: ["HS256"],
    });
    if (!payload.sub) return null;
    return {
      uid: payload.sub,
      email: typeof payload.email === "string" ? payload.email : null,
      emailVerified: payload.ev === true,
    };
  } catch {
    return null;
  }
}

export const sessionCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  // Lax: the cookie isn't sent on cross-site POSTs, which is the first layer
  // of CSRF protection. Every state-changing route also checks Origin.
  sameSite: "lax" as const,
  path: "/",
  maxAge: SESSION_DAYS * 24 * 60 * 60,
};

/** For server components, pages and route handlers. */
export async function getSession(): Promise<Session | null> {
  const store = await cookies();
  return readSessionToken(store.get(SESSION_COOKIE)?.value);
}

// ── Guest orders ──────────────────────────────────────────────────────────
// A guest has no account to prove ownership with, so the browser that placed
// the order gets a signed, HttpOnly cookie listing its order IDs. Only that
// browser can view those orders; knowing an order ID alone is not enough.

export const GUEST_ORDERS_COOKIE = "jh_guest_orders";
const GUEST_AUDIENCE = "jollyhonest:guest-orders";
const GUEST_DAYS = 30;
const MAX_GUEST_ORDERS = 20;

export async function readGuestOrderIds(): Promise<string[]> {
  const token = (await cookies()).get(GUEST_ORDERS_COOKIE)?.value;
  if (!token) return [];
  try {
    const { payload } = await jwtVerify(token, secretKey(), {
      issuer: ISSUER,
      audience: GUEST_AUDIENCE,
      algorithms: ["HS256"],
    });
    return Array.isArray(payload.orders) ? payload.orders.filter((id) => typeof id === "string") : [];
  } catch {
    return [];
  }
}

export async function createGuestOrdersToken(orderIds: string[]): Promise<string> {
  return new SignJWT({ orders: orderIds.slice(-MAX_GUEST_ORDERS) })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuer(ISSUER)
    .setAudience(GUEST_AUDIENCE)
    .setIssuedAt()
    .setExpirationTime(`${GUEST_DAYS}d`)
    .sign(secretKey());
}

export const guestOrdersCookieOptions = { ...sessionCookieOptions, maxAge: GUEST_DAYS * 24 * 60 * 60 };
