import { z } from "zod";

export const SERVICES = [
  "Sherwani Tailoring",
  "Shirt Tailoring",
  "Coats & Suits",
  "Trouser Tailoring",
  "Custom Tailoring",
  "At-Home Measurement",
] as const;

export const bookingSchema = z.object({
  name: z.string().trim().min(2, "Enter your full name").max(100),
  phone: z
    .string()
    .trim()
    .regex(/^[0-9+\s-]{7,15}$/, "Enter a valid phone number"),
  email: z.union([z.literal(""), z.string().trim().email()]).optional(),
  service: z.enum(SERVICES),
  preferredDate: z.string().trim().min(1, "Pick a preferred date"),
  notes: z.string().trim().max(500).optional(),
  // Honeypot: real users never fill this in; bots usually do.
  website: z.string().max(0, "Spam detected").optional(),
});

export type BookingInput = z.infer<typeof bookingSchema>;

export type BookingStatus = "pending_payment" | "paid" | "cancelled";

export type BookingRecord = {
  id: string;
  name: string;
  phone: string;
  email?: string;
  service: string;
  preferredDate: string;
  notes?: string;
  status: BookingStatus;
  depositAmount: number;
  stripeSessionId?: string;
  createdAt: string;
  paidAt?: string;
};
