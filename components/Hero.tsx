import Image from "next/image";
import Link from "next/link";
import Reveal from "./Reveal";

const STAGGER = 0.06;

export default function Hero() {
  return (
    <section
      id="top"
      className="surface-dark relative flex min-h-[calc(100svh-69px)] items-center overflow-hidden bg-burgundy text-cream"
    >
      {/* Fine woven texture and a soft light source, like cloth under a lamp. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, var(--color-cream) 0 1px, transparent 1px 9px), repeating-linear-gradient(-45deg, var(--color-cream) 0 1px, transparent 1px 9px)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(ellipse at 50% 30%, rgba(205,169,103,0.18), transparent 60%)" }}
      />
      {/* Inset hairline frame. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-4 border border-gold/25 sm:inset-8" />

      <div className="relative mx-auto flex max-w-5xl flex-col items-center px-6 py-24 text-center sm:px-10">
        <Reveal onMount from="scale">
          <Image
            src="/images/logo.jpg"
            alt="Jolly & Honest monogram"
            width={104}
            height={104}
            className="mx-auto rounded-full shadow-[0_0_0_1px_rgba(205,169,103,0.5),0_0_0_7px_rgba(205,169,103,0.08)]"
            priority
          />
        </Reveal>

        <Reveal onMount delay={STAGGER} className="mt-10 flex items-center gap-4">
          <span aria-hidden="true" className="hidden h-px w-10 bg-gold/60 sm:block" />
          <p className="whitespace-nowrap text-[11px] font-medium uppercase tracking-[0.3em] text-gold sm:tracking-[0.45em]">
            Navrangpura · Ahmedabad
          </p>
          <span aria-hidden="true" className="hidden h-px w-10 bg-gold/60 sm:block" />
        </Reveal>

        <Reveal onMount delay={STAGGER * 2}>
          <h1 className="mt-8 font-serif text-6xl font-light leading-[0.95] tracking-tight sm:text-8xl md:text-9xl">
            Jolly &amp; Honest
          </h1>
        </Reveal>

        <Reveal onMount delay={STAGGER * 3}>
          <p className="mt-8 font-serif text-2xl italic text-gold sm:text-3xl">
            Seventy-four years of the tailor&apos;s art
          </p>
          <p className="mx-auto mt-6 max-w-xl text-balance text-base leading-relaxed text-cream/80 sm:text-lg">
            Bespoke sherwanis, shirts, coats, suits and trousers — measured, cut and stitched by
            hand for a fit that is entirely yours.
          </p>
        </Reveal>

        <Reveal onMount delay={STAGGER * 4} className="mt-12 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:gap-4">
          <a
            href="#book"
            className="pressable inline-flex min-h-14 items-center justify-center bg-cream px-10 text-[11px] font-semibold uppercase tracking-[0.3em] text-burgundy hover:bg-white"
          >
            Book a Fitting
          </a>
          <Link
            href="/shop"
            className="pressable inline-flex min-h-14 items-center justify-center border border-cream/50 px-10 text-[11px] font-semibold uppercase tracking-[0.3em] text-cream hover:border-cream hover:bg-cream/10"
          >
            Shop the Collections
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
