"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden bg-burgundy text-cream"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, var(--color-cream) 1px, transparent 0)",
          backgroundSize: "28px 28px",
        }}
      />
      <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-gold/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-24 h-96 w-96 rounded-full bg-burgundy-light/20 blur-3xl" />

      <div className="relative mx-auto flex max-w-6xl flex-col items-center gap-8 px-6 py-24 text-center sm:px-10 sm:py-32">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <Image
            src="/images/logo.jpg"
            alt="Jolly & Honest monogram"
            width={112}
            height={112}
            className="mx-auto rounded-full shadow-[0_0_0_1px_rgba(255,245,236,0.25)]"
            priority
          />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="text-xs font-medium uppercase tracking-[0.35em] text-gold"
        >
          Est. Navrangpura, Ahmedabad
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="max-w-3xl font-serif text-5xl font-semibold leading-tight sm:text-6xl md:text-7xl"
        >
          Jolly &amp; Honest
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="max-w-xl text-balance text-lg leading-relaxed text-cream/85 sm:text-xl"
        >
          Seventy-four years of bespoke gents tailoring — sherwanis, shirts,
          coats, suits and trousers, cut and stitched by hand for a fit
          that&apos;s truly yours.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45 }}
          className="mt-2 flex flex-col gap-4 sm:flex-row"
        >
          <a
            href="#book"
            className="rounded-full bg-cream px-8 py-3.5 text-sm font-semibold tracking-wide text-burgundy shadow-lg transition-transform hover:scale-[1.03]"
          >
            Book a Fitting
          </a>
          <a
            href="#services"
            className="rounded-full border border-cream/40 px-8 py-3.5 text-sm font-semibold tracking-wide text-cream transition-colors hover:bg-cream/10"
          >
            Explore Services
          </a>
        </motion.div>
      </div>
    </section>
  );
}
