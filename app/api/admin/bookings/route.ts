import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase/admin";
import { verifyFirebaseIdToken, isAdminEmail } from "@/lib/firebase/verify-token";
import type { BookingRecord } from "@/lib/booking";

// Customer PII: never let a browser or proxy cache this response.
const NO_STORE = { "Cache-Control": "no-store" };

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  const idToken = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!idToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: NO_STORE });
  }

  let email: string | null;
  try {
    ({ email } = await verifyFirebaseIdToken(idToken));
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: NO_STORE });
  }

  if (!isAdminEmail(email)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403, headers: NO_STORE });
  }

  const snapshot = await getAdminDb()
    .collection("bookings")
    .orderBy("createdAt", "desc")
    .limit(200)
    .get();

  const bookings: BookingRecord[] = snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      name: data.name,
      phone: data.phone,
      email: data.email ?? undefined,
      service: data.service,
      preferredDate: data.preferredDate,
      notes: data.notes ?? undefined,
      status: data.status,
      depositAmount: data.depositAmount,
      stripeSessionId: data.stripeSessionId ?? undefined,
      createdAt: data.createdAt?.toDate?.().toISOString() ?? "",
      paidAt: data.paidAt?.toDate?.().toISOString() ?? undefined,
    };
  });

  return NextResponse.json({ bookings }, { headers: NO_STORE });
}
