import { NextResponse } from "next/server";

/**
 * CSRF guard for every state-changing API route. Session cookies are
 * SameSite=Lax, and on top of that:
 *  - a request from another site carries that site's Origin, so it's refused;
 *  - a cross-site <form> can't send application/json, so non-JSON is refused.
 * Returns an error response to send, or null when the request may proceed.
 */
export function rejectCrossSite(request: Request): NextResponse | null {
  const siteOrigin = new URL(request.url).origin;
  const origin = request.headers.get("origin");
  if (origin && origin !== siteOrigin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  if (request.headers.get("content-type")?.split(";")[0].trim() !== "application/json") {
    return NextResponse.json({ error: "Unsupported content type" }, { status: 415 });
  }
  return null;
}

/** Only allow redirects to paths on this site (no "//evil.com", no "https://…"). */
export function safeNextPath(next: string | null | undefined, fallback = "/account"): string {
  if (!next || !next.startsWith("/") || next.startsWith("//") || next.startsWith("/\\")) {
    return fallback;
  }
  return next;
}
