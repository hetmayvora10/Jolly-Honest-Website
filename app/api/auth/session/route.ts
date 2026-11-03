import { NextResponse } from "next/server";
import { z } from "zod";
import { verifyFirebaseIdToken } from "@/lib/firebase/verify-token";
import { createSessionToken, SESSION_COOKIE, sessionCookieOptions } from "@/lib/session";
import { rejectCrossSite } from "@/lib/http";
import { isRateLimited, clientIp } from "@/lib/rate-limit";

// Only accept tokens from a sign-in that just happened, so an old ID token
// lifted from somewhere can't be traded in for a fresh week-long session.
const MAX_SIGN_IN_AGE_SECONDS = 5 * 60;

const bodySchema = z.object({ idToken: z.string().min(1).max(4096) });

// Sign in: exchange a fresh Firebase ID token for an HttpOnly session cookie.
export async function POST(request: Request) {
  const rejected = rejectCrossSite(request);
  if (rejected) return rejected;

  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  if (await isRateLimited(`session:${clientIp(request)}`, { limit: 20, windowMs: 10 * 60 * 1000 })) {
    return NextResponse.json({ error: "Too many sign-in attempts. Please wait a few minutes." }, { status: 429 });
  }

  let token;
  try {
    token = await verifyFirebaseIdToken(parsed.data.idToken);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (Date.now() / 1000 - token.authTime > MAX_SIGN_IN_AGE_SECONDS) {
    return NextResponse.json({ error: "Please sign in again." }, { status: 401 });
  }

  const session = await createSessionToken({
    uid: token.uid,
    email: token.email,
    emailVerified: token.emailVerified,
  });

  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, session, sessionCookieOptions);
  return res;
}

// Sign out.
export async function DELETE(request: Request) {
  const siteOrigin = new URL(request.url).origin;
  const origin = request.headers.get("origin");
  if (origin && origin !== siteOrigin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, "", { ...sessionCookieOptions, maxAge: 0 });
  return res;
}
