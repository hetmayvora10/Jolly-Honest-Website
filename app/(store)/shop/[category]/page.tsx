import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CATEGORIES, CATEGORY_IDS, isCategory, productsIn } from "@/lib/catalog";
import CategoryGrid from "@/components/store/CategoryGrid";

type Props = { params: Promise<{ category: string }> };

export function generateStaticParams() {
  return CATEGORY_IDS.map((category) => ({ category }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  if (!isCategory(category)) return {};
  return { title: CATEGORIES[category].title, description: CATEGORIES[category].blurb };
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  if (!isCategory(category)) notFound();
  const { title, blurb } = CATEGORIES[category];

  return (
    <div className="mx-auto w-full max-w-7xl px-4 pb-24 sm:px-8">
      <nav aria-label="Breadcrumb" className="pt-8 text-[11px] uppercase tracking-[0.2em] text-ink/60">
        <Link href="/shop" className="hover:text-burgundy">Shop</Link>
        <span aria-hidden="true" className="mx-2">/</span>
        <span aria-current="page" className="text-ink">{CATEGORIES[category].label}</span>
      </nav>
      <header className="py-12 text-center sm:py-16">
        <h1 className="font-serif text-5xl font-light text-ink sm:text-7xl">{title}</h1>
        <p className="mx-auto mt-6 max-w-xl leading-relaxed text-ink/70">{blurb}</p>
      </header>
      <CategoryGrid products={productsIn(category)} />
    </div>
  );
}
