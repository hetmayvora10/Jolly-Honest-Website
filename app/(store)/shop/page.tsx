import type { Metadata } from "next";
import Link from "next/link";
import { CATEGORIES, CATEGORY_IDS, getProduct } from "@/lib/catalog";
import ProductArt from "@/components/store/ProductArt";
import ProductCard from "@/components/store/ProductCard";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "The Collections",
  description: "Menswear, womenswear, kidswear and Indian traditional — the Jolly & Honest demo store.",
};

const COVER: Record<string, string> = {
  men: "m-navy-pinstripe-suit",
  women: "w-slip-dress",
  kids: "k-bandhgala-set",
  traditional: "t-maroon-sherwani",
};

const FEATURED = ["t-ivory-sherwani", "w-tailored-blazer", "m-charcoal-herringbone-blazer", "t-anarkali"];

export default function ShopPage() {
  return (
    <>
      <section className="mx-auto w-full max-w-7xl px-4 pb-16 pt-16 text-center sm:px-8 sm:pt-24">
        <Reveal onMount>
          <p className="text-[11px] font-medium uppercase tracking-[0.4em] text-burgundy">Autumn – Winter</p>
          <h1 className="mx-auto mt-6 max-w-4xl font-serif text-5xl font-light leading-[1.05] text-ink sm:text-7xl md:text-8xl">
            The Collections
          </h1>
          <div aria-hidden="true" className="mx-auto mt-8 h-px w-16 bg-gold-dark" />
          <p className="mx-auto mt-8 max-w-xl text-base leading-relaxed text-ink/70 sm:text-lg">
            Seventy-four years of cutting cloth in Navrangpura, translated into a wardrobe
            for the whole family.
          </p>
        </Reveal>
      </section>

      <section aria-label="Shop by category" className="mx-auto grid w-full max-w-7xl gap-3 px-4 sm:grid-cols-2 sm:px-8 lg:grid-cols-4">
        {CATEGORY_IDS.map((id, i) => {
          const cover = getProduct(COVER[id])!;
          return (
            <Reveal key={id} delay={i * 0.06}>
              <Link href={`/shop/${id}`} className="group relative block overflow-hidden">
                <ProductArt
                  product={cover}
                  priority={i < 2}
                  className="transition-transform duration-700 ease-[var(--ease-out)] group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-6 pt-24 text-cream">
                  <p className="font-serif text-3xl">{CATEGORIES[id].label}</p>
                  <p className="mt-2 text-[11px] uppercase tracking-[0.3em] underline-offset-4 group-hover:underline">Shop now</p>
                </div>
              </Link>
            </Reveal>
          );
        })}
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-24 sm:px-8">
        <div className="flex items-end justify-between gap-6 border-b border-ink/10 pb-6">
          <h2 className="font-serif text-4xl font-light text-ink sm:text-5xl">Signature Pieces</h2>
          <Link href="/shop/traditional" className="hidden text-[11px] uppercase tracking-[0.3em] text-ink/70 underline-offset-4 hover:underline sm:inline">
            View all
          </Link>
        </div>
        <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-12 lg:grid-cols-4">
          {FEATURED.map((id) => (
            <ProductCard key={id} product={getProduct(id)!} />
          ))}
        </div>
      </section>

      <section className="surface-dark bg-burgundy text-cream">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-24 sm:px-8 md:grid-cols-2">
          <div>
            <p className="text-[11px] uppercase tracking-[0.4em] text-gold">The Bespoke Service</p>
            <h2 className="mt-6 font-serif text-4xl font-light leading-tight sm:text-6xl">
              Made for you, <em className="text-gold">by hand.</em>
            </h2>
          </div>
          <div>
            <p className="text-lg leading-relaxed text-cream/85">
              Every piece in our shop on Navrangpura Cross Roads is measured, cut and stitched
              to order. Book a fitting and one of our master tailors will take it from there.
            </p>
            <Link href="/#book" className="pressable mt-8 inline-flex min-h-12 items-center border border-cream/60 px-8 text-[11px] font-semibold uppercase tracking-[0.3em] hover:bg-cream hover:text-burgundy">
              Book a Fitting
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
