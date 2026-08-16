"use client";

import { motion } from "framer-motion";

function Star({ filled }: { filled: boolean }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.5"
      className="text-gold"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m12 3 2.6 5.6 6.1.7-4.5 4.2 1.2 6-5.4-3-5.4 3 1.2-6-4.5-4.2 6.1-.7L12 3Z"
      />
    </svg>
  );
}

export default function Reviews() {
  return (
    <section id="reviews" className="bg-white">
      <div className="mx-auto max-w-4xl px-6 py-24 text-center sm:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-burgundy/70">
            Trusted in Ahmedabad
          </p>
          <h2 className="mt-4 font-serif text-4xl font-semibold text-ink sm:text-5xl">
            Rated by our customers
          </h2>

          <div className="mt-10 flex flex-col items-center gap-3 rounded-3xl border border-burgundy/10 bg-cream px-10 py-10 sm:mx-auto sm:max-w-md">
            <div className="font-serif text-6xl font-semibold text-burgundy">
              4.6
            </div>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <Star key={n} filled={n <= 5} />
              ))}
            </div>
            <p className="text-sm font-medium uppercase tracking-wide text-ink/60">
              187+ customer ratings on JustDial
            </p>
          </div>

          <p className="mx-auto mt-8 max-w-lg text-lg leading-relaxed text-ink/70">
            Generations of Ahmedabad families have trusted Jolly &amp; Honest
            for their weddings, work-wear and everyday tailoring needs.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
