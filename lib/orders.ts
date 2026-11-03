import { z } from "zod";
import type { PricedLine } from "@/lib/pricing";

export const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Delhi", "Goa",
  "Gujarat", "Haryana", "Himachal Pradesh", "Jammu & Kashmir", "Jharkhand", "Karnataka",
  "Kerala", "Ladakh", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Puducherry", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
] as const;

export const addressSchema = z.object({
  fullName: z.string().trim().min(2, "Enter the recipient's full name").max(100),
  phone: z.string().trim().regex(/^[0-9+\s-]{7,15}$/, "Enter a valid phone number"),
  line1: z.string().trim().min(3, "Enter the street address").max(150),
  line2: z.string().trim().max(150).optional(),
  city: z.string().trim().min(2, "Enter the city").max(60),
  state: z.enum(INDIAN_STATES, { error: "Choose a state" }),
  pincode: z.string().trim().regex(/^[1-9][0-9]{5}$/, "Enter a 6-digit PIN code"),
});

export type Address = z.infer<typeof addressSchema>;

export type OrderStatus = "pending_payment" | "paid" | "cancelled";

export type OrderRecord = {
  id: string;
  uid: string;
  email: string | null;
  lines: PricedLine[];
  subtotal: number;
  total: number;
  address: Address;
  status: OrderStatus;
  createdAt: string;
  paidAt?: string;
};

// Firestore → plain object safe to pass to client components.
export function toOrderRecord(id: string, data: FirebaseFirestore.DocumentData): OrderRecord {
  return {
    id,
    uid: data.uid,
    email: data.email ?? null,
    lines: data.lines ?? [],
    subtotal: data.subtotal,
    total: data.total,
    address: data.address,
    status: data.status,
    createdAt: data.createdAt?.toDate?.().toISOString() ?? "",
    paidAt: data.paidAt?.toDate?.().toISOString() ?? undefined,
  };
}
