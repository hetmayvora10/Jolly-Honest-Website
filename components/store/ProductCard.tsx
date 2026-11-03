import Link from "next/link";
import { formatINR, type Product } from "@/lib/catalog";
import ProductArt from "./ProductArt";

export default function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  return (
    <Link href={`/product/${product.slug}`} className="group block">
      <div className="overflow-hidden">
        <ProductArt
          product={product}
          priority={priority}
          className="transition-transform duration-500 ease-[var(--ease-out)] group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
        />
      </div>
      <div className="mt-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm text-ink group-hover:underline group-hover:underline-offset-4">{product.name}</h3>
          <p className="mt-1 text-xs text-ink/60">
            {product.colors.length > 1 ? `${product.colors.length} colours` : product.colors[0].name}
          </p>
        </div>
        <p className="shrink-0 text-sm text-ink">{formatINR(product.price)}</p>
      </div>
    </Link>
  );
}
