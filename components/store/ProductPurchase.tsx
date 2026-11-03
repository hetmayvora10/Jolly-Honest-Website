"use client";

import Link from "next/link";
import { useState } from "react";
import { formatINR, type Product } from "@/lib/catalog";
import { addToBag } from "@/lib/bag";
import ProductArt from "./ProductArt";

export default function ProductPurchase({ product }: { product: Product }) {
  const [color, setColor] = useState(product.colors[0]);
  const [size, setSize] = useState<string | null>(null);
  const [sizeError, setSizeError] = useState(false);
  const [added, setAdded] = useState(false);

  function handleAdd() {
    if (!size) {
      setSizeError(true);
      return;
    }
    addToBag({ productId: product.id, size, color: color.name });
    setAdded(true);
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
      <ProductArt product={product} colorHex={color.hex} priority sizes="(min-width: 1024px) 55vw, 100vw" />

      <div className="lg:sticky lg:top-32 lg:self-start">
        <p className="text-[11px] uppercase tracking-[0.3em] text-burgundy">{product.type}</p>
        <h1 className="mt-3 font-serif text-4xl font-light leading-tight text-ink sm:text-5xl">{product.name}</h1>
        <p className="mt-4 text-lg text-ink">{formatINR(product.price)}</p>
        <p className="mt-1 text-xs text-ink/60">Inclusive of all taxes</p>

        <fieldset className="mt-10">
          <legend className="text-[11px] uppercase tracking-[0.25em] text-ink/70">
            Colour — <span className="text-ink">{color.name}</span>
          </legend>
          <div className="mt-3 flex gap-3">
            {product.colors.map((c) => (
              <button
                key={c.name}
                type="button"
                onClick={() => {
                  setColor(c);
                  setAdded(false);
                }}
                aria-label={c.name}
                aria-pressed={c.name === color.name}
                className={`flex h-11 w-11 items-center justify-center rounded-full border transition-colors ${
                  c.name === color.name ? "border-ink" : "border-transparent hover:border-ink/30"
                }`}
              >
                <span className="h-8 w-8 rounded-full ring-1 ring-ink/15" style={{ backgroundColor: c.hex }} />
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className="mt-8">
          <legend className="text-[11px] uppercase tracking-[0.25em] text-ink/70">Size</legend>
          <div className="mt-3 grid grid-cols-5 gap-2">
            {product.sizes.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => {
                  setSize(s);
                  setSizeError(false);
                  setAdded(false);
                }}
                aria-pressed={s === size}
                className={`min-h-11 border text-xs tracking-wider transition-colors ${
                  s === size ? "border-ink bg-ink text-cream" : "border-ink/15 text-ink hover:border-ink/50"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
          {sizeError && (
            <p role="alert" className="mt-3 text-sm text-red-700">
              Please choose a size.
            </p>
          )}
        </fieldset>

        <button
          type="button"
          onClick={handleAdd}
          className="pressable mt-10 min-h-14 w-full bg-burgundy text-[11px] font-semibold uppercase tracking-[0.3em] text-cream hover:bg-burgundy-dark"
        >
          Add to Bag
        </button>
        <p role="status" className="mt-4 min-h-6 text-center text-sm text-ink">
          {added && (
            <>
              Added to your bag.{" "}
              <Link href="/bag" className="underline underline-offset-4 hover:text-burgundy">
                View bag
              </Link>
            </>
          )}
        </p>

        <div className="mt-8 divide-y divide-ink/10 border-y border-ink/10">
          <details className="group py-4" open>
            <summary className="flex min-h-8 cursor-pointer list-none items-center justify-between text-[11px] uppercase tracking-[0.25em] text-ink">
              Description <span aria-hidden="true" className="text-lg group-open:rotate-45 transition-transform">+</span>
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-ink/75">{product.description}</p>
          </details>
          <details className="group py-4">
            <summary className="flex min-h-8 cursor-pointer list-none items-center justify-between text-[11px] uppercase tracking-[0.25em] text-ink">
              Fabric &amp; Care <span aria-hidden="true" className="text-lg group-open:rotate-45 transition-transform">+</span>
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-ink/75">
              {product.fabric}. Dry clean recommended to keep the shape and finish.
            </p>
          </details>
          <details className="group py-4">
            <summary className="flex min-h-8 cursor-pointer list-none items-center justify-between text-[11px] uppercase tracking-[0.25em] text-ink">
              Delivery <span aria-hidden="true" className="text-lg group-open:rotate-45 transition-transform">+</span>
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-ink/75">
              This is a demo store: checkout runs in Stripe test mode and nothing is shipped.
              For real garments, book a fitting at our Navrangpura shop.
            </p>
          </details>
        </div>
      </div>
    </div>
  );
}
