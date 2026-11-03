"use client";

import { useMemo, useState } from "react";
import type { Product } from "@/lib/catalog";
import ProductCard from "./ProductCard";

type Sort = "featured" | "price-asc" | "price-desc";

export default function CategoryGrid({ products }: { products: Product[] }) {
  const types = useMemo(() => [...new Set(products.map((p) => p.type))], [products]);
  const [type, setType] = useState<string | null>(null);
  const [sort, setSort] = useState<Sort>("featured");

  const shown = useMemo(() => {
    const filtered = type ? products.filter((p) => p.type === type) : products;
    if (sort === "featured") return filtered;
    return [...filtered].sort((a, b) => (sort === "price-asc" ? a.price - b.price : b.price - a.price));
  }, [products, type, sort]);

  const chip = (active: boolean) =>
    `inline-flex min-h-10 items-center border px-4 text-[11px] uppercase tracking-[0.2em] transition-colors ${
      active ? "border-ink bg-ink text-cream" : "border-ink/15 text-ink/80 hover:border-ink/50"
    }`;

  return (
    <>
      <div className="flex flex-col gap-4 border-y border-ink/10 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div role="group" aria-label="Filter by type" className="flex flex-wrap gap-2">
          <button type="button" aria-pressed={type === null} onClick={() => setType(null)} className={chip(type === null)}>
            All
          </button>
          {types.map((t) => (
            <button key={t} type="button" aria-pressed={type === t} onClick={() => setType(t)} className={chip(type === t)}>
              {t}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-4">
          <p aria-live="polite" className="text-xs text-ink/60">
            {shown.length} {shown.length === 1 ? "piece" : "pieces"}
          </p>
          <label className="flex items-center gap-2 text-xs text-ink/70">
            Sort
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as Sort)}
              className="min-h-10 border border-ink/15 bg-transparent px-3 text-xs uppercase tracking-[0.15em] text-ink"
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price: low to high</option>
              <option value="price-desc">Price: high to low</option>
            </select>
          </label>
        </div>
      </div>

      <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-3 lg:grid-cols-4">
        {shown.map((product, i) => (
          <ProductCard key={product.id} product={product} priority={i < 4} />
        ))}
      </div>
    </>
  );
}
