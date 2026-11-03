import { getAdminDb } from "@/lib/firebase/admin";
import { toOrderRecord, type OrderRecord } from "@/lib/orders";

// Every read is scoped to the signed-in user's uid. The Admin SDK bypasses
// Firestore rules, so this ownership check is the authorization.

export async function listOrdersFor(uid: string): Promise<OrderRecord[]> {
  // Filter only (no orderBy) so no composite index is needed; sorted here.
  const snapshot = await getAdminDb().collection("orders").where("uid", "==", uid).limit(100).get();
  return snapshot.docs
    .map((doc) => toOrderRecord(doc.id, doc.data()))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

/** Returns null both when the order doesn't exist and when it isn't theirs. */
export async function getOrderFor(uid: string, orderId: string): Promise<OrderRecord | null> {
  if (!/^[A-Za-z0-9]{1,64}$/.test(orderId)) return null;
  const doc = await getAdminDb().collection("orders").doc(orderId).get();
  if (!doc.exists || doc.get("uid") !== uid) return null;
  return toOrderRecord(doc.id, doc.data()!);
}
