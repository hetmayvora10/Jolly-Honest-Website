import Link from "next/link";
import { CATEGORIES, CATEGORY_IDS, getProduct } from "@/lib/catalog";
import ProductArt from "./store/ProductArt";
import Reveal from "./Reveal";

const COVER: Record<string, string> = {
  men: "m-charcoal-herringbone-blazer",
  women: "w-tailored-blazer",
  kids: "k-lehenga",
  traditional: "t-ivory-sherwani",
};

export default function Collections() {
  return (
    <section id="collections" className="bg-background">
      <div className="mx-auto max-w-7xl px-6 py-24 sm:px-10">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-burgundy/70">The House Collections</p>
          <h2 className="mt-4 font-serif text-4xl font-light text-ink sm:text-5xl">Dressed for every occasion</h2>
          <p className="mt-5 text-ink/70">
            Explore our online store — a portfolio demo of ready-to-wear for men, women, children
            and the wedding season.
          </p>
        </Reveal>

        <div className="mt-14 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {CATEGORY_IDS.map((id, i) => (
            <Reveal key={id} delay={i * 0.06}>
              <Link href={`/shop/${id}`} className="group relative block overflow-hidden">
                <ProductArt
                  product={getProduct(COVER[id])!}
                  className="transition-transform duration-700 ease-[var(--ease-out)] group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-5 pt-20 text-cream">
                  <p className="font-serif text-2xl sm:text-3xl">{CATEGORIES[id].label}</p>
                  <p className="mt-1 text-[10px] uppercase tracking-[0.3em] underline-offset-4 group-hover:underline">Discover</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
