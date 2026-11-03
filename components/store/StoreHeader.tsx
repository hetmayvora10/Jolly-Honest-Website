"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { CATEGORIES, CATEGORY_IDS } from "@/lib/catalog";
import { useBag, bagCount } from "@/lib/bag";

const LINKS = CATEGORY_IDS.map((id) => ({ href: `/shop/${id}`, label: CATEGORIES[id].label }));

function BagIcon() {
  return (
    <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
      <path d="M5 8h14l-1.2 12H6.2L5 8Z" strokeLinejoin="round" />
      <path d="M9 8V6.5a3 3 0 0 1 6 0V8" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
      <circle cx="12" cy="8.5" r="3.5" />
      <path d="M5 20c1.2-3.5 4-5 7-5s5.8 1.5 7 5" strokeLinecap="round" />
    </svg>
  );
}

export default function StoreHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const count = bagCount(useBag());

  return (
    <header className="sticky top-0 z-50 border-b border-ink/10 bg-background/95 backdrop-blur-sm">
      <div className="bg-burgundy-dark px-4 py-2 text-center text-[11px] leading-snug tracking-wide text-cream/90">
        <span className="sm:hidden">Portfolio demo store · illustrative products · Stripe test mode</span>
        <span className="hidden sm:inline">
          Portfolio demo store — products are illustrative and payments run in Stripe test mode
          (card 4242&nbsp;4242&nbsp;4242&nbsp;4242). No orders are made or shipped.
        </span>
      </div>

      <nav aria-label="Store" className="mx-auto grid max-w-7xl grid-cols-[1fr_auto_1fr] items-center px-4 py-3 sm:px-8">
        <div className="flex items-center">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={open}
            aria-controls="store-menu"
            className="-ml-2 flex h-11 w-11 flex-col items-center justify-center gap-1.5 lg:hidden"
          >
            <span className={`h-px w-5 bg-ink transition-transform ${open ? "translate-y-[3.5px] rotate-45" : ""}`} />
            <span className={`h-px w-5 bg-ink transition-transform ${open ? "-translate-y-[3.5px] -rotate-45" : ""}`} />
          </button>
          <ul className="hidden items-center gap-8 lg:flex">
            {LINKS.map((link) => {
              const active = pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={`inline-flex min-h-11 items-center text-[11px] font-medium uppercase tracking-[0.25em] transition-colors hover:text-burgundy ${
                      active ? "text-burgundy" : "text-ink/80"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        <Link href="/shop" className="flex flex-col items-center px-2 text-center">
          <span className="whitespace-nowrap font-serif text-lg font-medium tracking-[0.12em] text-burgundy sm:text-3xl sm:tracking-[0.18em]">
            JOLLY &amp; HONEST
          </span>
          <span className="text-[9px] uppercase tracking-[0.5em] text-ink/60">Ahmedabad</span>
        </Link>

        <div className="flex items-center justify-end gap-1">
          <Link href="/" className="hidden min-h-11 items-center px-3 text-[11px] font-medium uppercase tracking-[0.25em] text-ink/80 hover:text-burgundy xl:inline-flex">
            Tailoring
          </Link>
          <Link href="/account" aria-label="Account" className="flex h-11 w-11 items-center justify-center text-ink/80 hover:text-burgundy">
            <UserIcon />
          </Link>
          <Link
            href="/bag"
            aria-label={`Bag, ${count} ${count === 1 ? "item" : "items"}`}
            className="relative flex h-11 w-11 items-center justify-center text-ink/80 hover:text-burgundy"
          >
            <BagIcon />
            {count > 0 && (
              <span aria-hidden="true" className="absolute right-1 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-burgundy px-1 text-[10px] font-semibold text-cream">
                {count}
              </span>
            )}
          </Link>
        </div>
      </nav>

      {open && (
        <div id="store-menu" className="border-t border-ink/10 bg-background px-4 pb-6 lg:hidden">
          <ul className="flex flex-col pt-2">
            {[...LINKS, { href: "/", label: "Bespoke Tailoring" }].map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="flex min-h-12 items-center border-b border-ink/5 font-serif text-2xl text-ink"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
