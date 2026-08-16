"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

type Service = {
  title: string;
  description: string;
  icon: ReactNode;
};

const iconProps = {
  width: 28,
  height: 28,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const SERVICES: Service[] = [
  {
    title: "Sherwani Tailoring",
    description:
      "Hand-finished wedding and festive sherwanis, embroidered and cut to your measurements.",
    icon: (
      <svg {...iconProps}>
        <path d="M8 3l4 2 4-2 3 4-2 2v11a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V9L3 7l3-4Z" />
        <path d="M9 3v3l3 2 3-2V3" />
      </svg>
    ),
  },
  {
    title: "Shirt Tailoring",
    description:
      "Formal and casual shirts stitched to precise collar, cuff and fit specifications.",
    icon: (
      <svg {...iconProps}>
        <path d="M7 4 3 7l2 3 2-1v11h10V9l2 1 2-3-4-3-3 2h-2L7 4Z" />
      </svg>
    ),
  },
  {
    title: "Coats & Suits",
    description:
      "Two and three-piece suits with structured tailoring for weddings, work and formal wear.",
    icon: (
      <svg {...iconProps}>
        <path d="M6 4 3 8l2 2 3-2v12h8V8l3 2 2-2-3-4-4 2h-4L6 4Z" />
        <path d="M12 8v12" />
      </svg>
    ),
  },
  {
    title: "Trouser Tailoring",
    description:
      "Precisely drafted trousers in your choice of fabric, break and silhouette.",
    icon: (
      <svg {...iconProps}>
        <path d="M7 3h10l1 6-2 12h-3l-1-9-1 9H8L6 9l1-6Z" />
      </svg>
    ),
  },
  {
    title: "Custom Tailoring",
    description:
      "Fully bespoke garments designed around your fabric, style and occasion.",
    icon: (
      <svg {...iconProps}>
        <path d="M14.5 2.5a2.1 2.1 0 0 1 3 3L7 16l-4 1 1-4Z" />
        <path d="M12.5 4.5l3 3" />
      </svg>
    ),
  },
  {
    title: "At-Home Measurement",
    description:
      "Our master tailors visit your home or office to take measurements at your convenience.",
    icon: (
      <svg {...iconProps}>
        <path d="M3 21c2-6 4-9 9-9s7 3 9 9" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
];

export default function Services() {
  return (
    <section id="services" className="bg-white">
      <div className="mx-auto max-w-6xl px-6 py-24 sm:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-burgundy/70">
            What We Tailor
          </p>
          <h2 className="mt-4 font-serif text-4xl font-semibold text-ink sm:text-5xl">
            Our Services
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-ink/70">
            From celebration wear to everyday formals, every piece is
            measured, cut and finished in-house.
          </p>
        </motion.div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
              className="group rounded-2xl border border-burgundy/10 bg-cream p-8 transition-shadow hover:shadow-lg"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-burgundy text-cream transition-transform group-hover:scale-105">
                {service.icon}
              </div>
              <h3 className="mt-6 font-serif text-2xl font-semibold text-ink">
                {service.title}
              </h3>
              <p className="mt-2 leading-relaxed text-ink/70">
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
