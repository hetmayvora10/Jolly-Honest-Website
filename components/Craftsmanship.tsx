"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

type Feature = {
  title: string;
  description: string;
  icon: ReactNode;
};

const iconProps = {
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const FEATURES: Feature[] = [
  {
    title: "Master Craftsmen",
    description:
      "Every garment passes through the hands of tailors trained over decades, not a factory line.",
    icon: (
      <svg {...iconProps}>
        <path d="M12 3v4M6 7l3 2M18 7l-3 2M4 12h4M16 12h4M6 17l3-2M18 17l-3-2M12 17v4" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
  },
  {
    title: "Perfect-Fit Guarantee",
    description:
      "Free alterations until the fit is exactly right — because a garment should feel made for you.",
    icon: (
      <svg {...iconProps}>
        <path d="M20 6 9 17l-5-5" />
      </svg>
    ),
  },
  {
    title: "Premium Fabric Selection",
    description:
      "A curated range of fabrics sourced for durability, drape and finish, in every price range.",
    icon: (
      <svg {...iconProps}>
        <rect x="4" y="4" width="16" height="16" rx="2" />
        <path d="M4 9h16M9 4v16" />
      </svg>
    ),
  },
  {
    title: "Home & Office Visits",
    description:
      "Can't make it to the shop? Our tailors bring the measuring tape to you, by appointment.",
    icon: (
      <svg {...iconProps}>
        <path d="M3 10.5 12 3l9 7.5" />
        <path d="M5 9.5V20a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V9.5" />
      </svg>
    ),
  },
];

export default function Craftsmanship() {
  return (
    <section id="craftsmanship" className="bg-burgundy text-cream">
      <div className="mx-auto max-w-6xl px-6 py-24 sm:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">
            Why Jolly &amp; Honest
          </p>
          <h2 className="mt-4 font-serif text-4xl font-semibold sm:text-5xl">
            Craftsmanship you can trust
          </h2>
        </motion.div>

        <div className="mt-14 grid gap-8 sm:grid-cols-2">
          {FEATURES.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: (i % 2) * 0.1 }}
              className="flex gap-5 rounded-2xl border border-cream/15 bg-cream/[0.04] p-7"
            >
              <div className="flex h-12 w-12 flex-none items-center justify-center rounded-full bg-cream/10 text-gold">
                {feature.icon}
              </div>
              <div>
                <h3 className="font-serif text-xl font-semibold">
                  {feature.title}
                </h3>
                <p className="mt-2 leading-relaxed text-cream/75">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
