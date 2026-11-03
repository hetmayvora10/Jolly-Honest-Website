import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CATEGORIES, PRODUCTS, getProductBySlug, productsIn } from "@/lib/catalog";
import ProductPurchase from "@/components/store/ProductPurchase";
import ProductCard from "@/components/store/ProductCard";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = getProductBySlug((await params).slug);
  if (!product) return {};
  return { title: product.name, description: product.description };
}

export default async function ProductPage({ params }: Props) {
  const product = getProductBySlug((await params).slug);
  if (!product) notFound();

  const related = productsIn(product.category).filter((p) => p.id !== product.id).slice(0, 4);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 pb-24 sm:px-8">
      <nav aria-label="Breadcrumb" className="py-8 text-[11px] uppercase tracking-[0.2em] text-ink/60">
        <Link href="/shop" className="hover:text-burgundy">Shop</Link>
        <span aria-hidden="true" className="mx-2">/</span>
        <Link href={`/shop/${product.category}`} className="hover:text-burgundy">
          {CATEGORIES[product.category].label}
        </Link>
        <span aria-hidden="true" className="mx-2">/</span>
        <span aria-current="page" className="text-ink">{product.name}</span>
      </nav>

      <ProductPurchase product={product} />

      {related.length > 0 && (
        <section className="mt-28">
          <h2 className="border-b border-ink/10 pb-6 font-serif text-3xl font-light text-ink sm:text-4xl">
            You may also like
          </h2>
          <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-12 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
