import { getAdminDb } from "@/lib/firebase/admin";
import type { BookingRecord } from "@/lib/booking";
import { toOrderRecord, type OrderRecord } from "@/lib/orders";

// Server-only reads for the admin dashboard. Callers must have already
// checked the session against the admin allowlist.

export async function listBookings(): Promise<BookingRecord[]> {
  const snapshot = await getAdminDb()
    .collection("bookings")
    .orderBy("createdAt", "desc")
    .limit(200)
    .get();

  return snapshot.docs.map((doc) => {
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
}

export async function listOrders(): Promise<OrderRecord[]> {
  const snapshot = await getAdminDb()
    .collection("orders")
    .orderBy("createdAt", "desc")
    .limit(200)
    .get();
  return snapshot.docs.map((doc) => toOrderRecord(doc.id, doc.data()));
}
