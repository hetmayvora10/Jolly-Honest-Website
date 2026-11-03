"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const NAV_LINKS = [
  { href: "/shop", label: "Shop" },
  { href: "#heritage", label: "Heritage" },
  { href: "#services", label: "Services" },
  { href: "#craftsmanship", label: "Craftsmanship" },
  { href: "#reviews", label: "Reviews" },
  { href: "#visit", label: "Visit Us" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b transition-colors duration-200 ${
        scrolled
          ? "border-burgundy/10 bg-cream/95 backdrop-blur-sm"
          : "border-transparent bg-cream"
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3 sm:px-10">
        <a href="#top" className="flex items-center gap-3">
          <Image
            src="/images/logo.jpg"
            alt="Jolly & Honest"
            width={44}
            height={44}
            className="rounded-full ring-1 ring-burgundy/20"
            priority
          />
          <span className="font-serif text-xl font-medium tracking-[0.08em] text-burgundy sm:text-2xl">
            Jolly &amp; Honest
          </span>
        </a>

        <ul className="hidden items-center gap-7 lg:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="inline-flex min-h-7 items-center text-[11px] font-medium uppercase tracking-[0.22em] text-ink/80 transition-colors hover:text-burgundy"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href="#book"
          className="hidden min-h-11 items-center bg-burgundy px-6 text-[11px] font-semibold uppercase tracking-[0.25em] text-cream pressable hover:bg-burgundy-dark md:inline-flex"
        >
          Book a Fitting
        </a>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={open}
          aria-controls="mobile-menu"
          className="flex h-11 w-11 flex-col items-center justify-center gap-1.5 lg:hidden"
        >
          <span
            className={`h-[1.5px] w-6 bg-burgundy transition-transform ${
              open ? "translate-y-[7px] rotate-45" : ""
            }`}
          />
          <span
            className={`h-[1.5px] w-6 bg-burgundy transition-opacity ${
              open ? "opacity-0" : "opacity-100"
            }`}
          />
          <span
            className={`h-[1.5px] w-6 bg-burgundy transition-transform ${
              open ? "-translate-y-[7px] -rotate-45" : ""
            }`}
          />
        </button>
      </nav>

      {open && (
        <div id="mobile-menu" className="border-t border-burgundy/10 bg-cream px-6 pb-6 lg:hidden">
          <ul className="flex flex-col gap-1 pt-4">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-2 py-3 text-base font-medium text-ink/80 transition-colors hover:bg-burgundy/5 hover:text-burgundy"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <a
            href="#book"
            onClick={() => setOpen(false)}
            className="mt-3 flex min-h-12 items-center justify-center bg-burgundy px-5 text-[11px] font-semibold uppercase tracking-[0.25em] text-cream pressable hover:bg-burgundy-dark"
          >
            Book a Fitting
          </a>
        </div>
      )}
    </header>
  );
}
