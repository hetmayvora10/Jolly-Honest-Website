import { createHash } from "node:crypto";
import { Timestamp } from "firebase-admin/firestore";
import { getAdminDb } from "@/lib/firebase/admin";

// Serverless instances don't share memory, so an in-process counter would
// reset on every cold start. Counting in Firestore holds across instances.
// IPs are hashed so raw addresses never get stored.
export async function isRateLimited(
  key: string,
  { limit, windowMs }: { limit: number; windowMs: number }
): Promise<boolean> {
  const id = createHash("sha256").update(key).digest("hex");
  const ref = getAdminDb().collection("rateLimits").doc(id);
  const now = Date.now();

  return getAdminDb().runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    const windowStart = snap.get("windowStart") as Timestamp | undefined;
    const count = (snap.get("count") as number | undefined) ?? 0;

    if (!windowStart || now - windowStart.toMillis() >= windowMs) {
      tx.set(ref, {
        count: 1,
        windowStart: Timestamp.fromMillis(now),
        // Lets a Firestore TTL policy on `expiresAt` clean up old entries.
        expiresAt: Timestamp.fromMillis(now + windowMs),
      });
      return false;
    }

    if (count >= limit) return true;
    tx.update(ref, { count: count + 1 });
    return false;
  });
}

// On Vercel these headers are set by the edge and can't be spoofed by the client.
export function clientIp(request: Request): string {
  return (
    request.headers.get("x-real-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown"
  );
}
