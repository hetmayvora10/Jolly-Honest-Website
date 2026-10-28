import Image from "next/image";
import Reveal from "./Reveal";

const STAGGER = 0.06;

export default function Hero() {
  return (
    <section
      id="top"
      className="surface-dark relative overflow-hidden bg-burgundy text-cream"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, var(--color-cream) 1px, transparent 0)",
          backgroundSize: "28px 28px",
        }}
      />
      <div aria-hidden="true" className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-gold/10 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-40 -left-24 h-96 w-96 rounded-full bg-burgundy-light/20 blur-3xl" />

      <div className="relative mx-auto flex max-w-6xl flex-col items-center gap-8 px-6 py-24 text-center sm:px-10 sm:py-32">
        <Reveal onMount from="scale">
          <Image
            src="/images/logo.jpg"
            alt="Jolly & Honest monogram"
            width={112}
            height={112}
            className="mx-auto rounded-full shadow-[0_0_0_1px_rgba(255,245,236,0.25)]"
            priority
          />
        </Reveal>

        <Reveal onMount delay={STAGGER}>
          <p className="text-xs font-medium uppercase tracking-[0.35em] text-gold">
            Est. Navrangpura, Ahmedabad
          </p>
        </Reveal>

        <Reveal onMount delay={STAGGER * 2}>
          <h1 className="max-w-3xl font-serif text-5xl font-semibold leading-tight sm:text-6xl md:text-7xl">
            Jolly &amp; Honest
          </h1>
        </Reveal>

        <Reveal onMount delay={STAGGER * 3}>
          <p className="max-w-xl text-balance text-lg leading-relaxed text-cream/85 sm:text-xl">
            Seventy-four years of bespoke gents tailoring — sherwanis, shirts,
            coats, suits and trousers, cut and stitched by hand for a fit
            that&apos;s truly yours.
          </p>
        </Reveal>

        <Reveal onMount delay={STAGGER * 4} className="mt-2 flex flex-col gap-4 sm:flex-row">
          <a
            href="#book"
            className="pressable rounded-full bg-cream px-8 py-3.5 text-sm font-semibold tracking-wide text-burgundy shadow-lg hover:bg-white"
          >
            Book a Fitting
          </a>
          <a
            href="#services"
            className="pressable rounded-full border border-cream/40 px-8 py-3.5 text-sm font-semibold tracking-wide text-cream hover:bg-cream/10"
          >
            Explore Services
          </a>
        </Reveal>
      </div>
    </section>
  );
}
