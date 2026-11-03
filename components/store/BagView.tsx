"use client";

import Link from "next/link";
import { useBag, setQty } from "@/lib/bag";
import { formatINR, getProduct } from "@/lib/catalog";
import { MAX_QTY } from "@/lib/pricing";
import ProductArt from "./ProductArt";
import { primaryButton } from "./ui";

export default function BagView() {
  const lines = useBag();
  // Display only: prices shown here come from the same catalogue the server
  // uses, but the server recomputes them at checkout regardless.
  const items = lines.flatMap((line) => {
    const product = getProduct(line.productId);
    return product ? [{ line, product }] : [];
  });
  const subtotal = items.reduce((sum, { line, product }) => sum + product.price * line.qty, 0);

  if (items.length === 0) {
    return (
      <div className="py-24 text-center">
        <p className="font-serif text-3xl font-light text-ink">Your bag is empty.</p>
        <Link href="/shop" className="mt-8 inline-flex min-h-12 items-center border-b border-ink text-[11px] uppercase tracking-[0.3em] text-ink hover:text-burgundy">
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-12 lg:grid-cols-[1.6fr_1fr]">
      <ul className="divide-y divide-ink/10 border-y border-ink/10">
        {items.map(({ line, product }) => {
          const color = product.colors.find((c) => c.name === line.color);
          const key = { productId: line.productId, size: line.size, color: line.color };
          return (
            <li key={`${line.productId}-${line.size}-${line.color}`} className="flex gap-5 py-6">
              <Link href={`/product/${product.slug}`} className="w-24 shrink-0 sm:w-32">
                <ProductArt product={product} colorHex={color?.hex} sizes="128px" />
              </Link>
              <div className="flex flex-1 flex-col">
                <div className="flex justify-between gap-4">
                  <div>
                    <Link href={`/product/${product.slug}`} className="text-sm text-ink hover:underline hover:underline-offset-4">
                      {product.name}
                    </Link>
                    <p className="mt-1 text-xs text-ink/60">
                      {line.color} · Size {line.size}
                    </p>
                  </div>
                  <p className="text-sm text-ink">{formatINR(product.price * line.qty)}</p>
                </div>
                <div className="mt-auto flex items-center justify-between pt-4">
                  <div className="flex items-center border border-ink/15">
                    <button type="button" aria-label={`Decrease quantity of ${product.name}`} onClick={() => setQty(key, line.qty - 1)} className="h-10 w-10 text-ink hover:bg-ink/5">
                      −
                    </button>
                    <span aria-label="Quantity" className="w-8 text-center text-sm">{line.qty}</span>
                    <button
                      type="button"
                      aria-label={`Increase quantity of ${product.name}`}
                      disabled={line.qty >= MAX_QTY}
                      onClick={() => setQty(key, line.qty + 1)}
                      className="h-10 w-10 text-ink hover:bg-ink/5 disabled:opacity-40"
                    >
                      +
                    </button>
                  </div>
                  <button type="button" onClick={() => setQty(key, 0)} className="min-h-10 text-xs uppercase tracking-[0.2em] text-ink/60 underline-offset-4 hover:text-burgundy hover:underline">
                    Remove
                  </button>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      <aside className="h-fit bg-cream p-8">
        <h2 className="font-serif text-2xl text-ink">Order Summary</h2>
        <dl className="mt-6 space-y-3 text-sm">
          <div className="flex justify-between"><dt className="text-ink/70">Subtotal</dt><dd>{formatINR(subtotal)}</dd></div>
          <div className="flex justify-between"><dt className="text-ink/70">Delivery</dt><dd>Complimentary</dd></div>
          <div className="flex justify-between border-t border-ink/10 pt-3 text-base"><dt>Total</dt><dd>{formatINR(subtotal)}</dd></div>
        </dl>
        <Link href="/checkout" className={`${primaryButton} mt-8`}>
          Checkout
        </Link>
        <p className="mt-4 text-center text-xs text-ink/60">Demo store · Stripe test mode</p>
      </aside>
    </div>
  );
}
