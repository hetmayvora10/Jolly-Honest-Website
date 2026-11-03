import { z } from "zod";
import { getProduct } from "@/lib/catalog";

export const MAX_LINES = 20;
export const MAX_QTY = 10;

// What the browser sends: references only. Any price or name it includes is
// ignored — everything billable is looked up from the catalogue on the server.
export const cartLineSchema = z.object({
  productId: z.string().min(1).max(100),
  size: z.string().min(1).max(20),
  color: z.string().min(1).max(50),
  qty: z.number().int().min(1).max(MAX_QTY),
});

export type CartLine = z.infer<typeof cartLineSchema>;

export type PricedLine = CartLine & { name: string; unitPrice: number; lineTotal: number };

export type PricingResult =
  | { ok: true; lines: PricedLine[]; subtotal: number }
  | { ok: false; error: string };

export function priceCart(lines: CartLine[]): PricingResult {
  if (lines.length === 0) return { ok: false, error: "Your bag is empty." };
  if (lines.length > MAX_LINES) return { ok: false, error: "Too many items in your bag." };

  const priced: PricedLine[] = [];
  for (const line of lines) {
    const product = getProduct(line.productId);
    if (!product) return { ok: false, error: "An item in your bag is no longer available." };
    if (!product.sizes.includes(line.size)) return { ok: false, error: `Size ${line.size} isn't available for ${product.name}.` };
    if (!product.colors.some((c) => c.name === line.color)) {
      return { ok: false, error: `${line.color} isn't available for ${product.name}.` };
    }
    priced.push({
      ...line,
      name: product.name,
      unitPrice: product.price,
      lineTotal: product.price * line.qty,
    });
  }

  return { ok: true, lines: priced, subtotal: priced.reduce((sum, l) => sum + l.lineTotal, 0) };
}
