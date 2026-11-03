import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { isAdminEmail } from "@/lib/firebase/verify-token";
import { listBookings } from "@/lib/admin-data";

// Customer PII: never let a browser or proxy cache this response.
const NO_STORE = { "Cache-Control": "no-store" };

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: NO_STORE });
  }
  if (!isAdminEmail(session.email)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403, headers: NO_STORE });
  }

  return NextResponse.json({ bookings: await listBookings() }, { headers: NO_STORE });
}
