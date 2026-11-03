import Image from "next/image";
import Link from "next/link";

const COLUMNS = [
  {
    heading: "Shop",
    links: [
      { href: "/shop/men", label: "Men" },
      { href: "/shop/women", label: "Women" },
      { href: "/shop/kids", label: "Kids" },
      { href: "/shop/traditional", label: "Indian Traditional" },
    ],
  },
  {
    heading: "Tailoring",
    links: [
      { href: "/#services", label: "Services" },
      { href: "/#book", label: "Book a Fitting" },
      { href: "/#visit", label: "Visit the Shop" },
    ],
  },
  {
    heading: "Account",
    links: [
      { href: "/account", label: "My Account" },
      { href: "/bag", label: "Bag" },
      { href: "/signin", label: "Sign In" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="surface-dark bg-burgundy-dark text-cream/80">
      <div className="mx-auto grid max-w-6xl gap-12 px-6 py-16 sm:px-10 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div>
          <div className="flex items-center gap-3">
            <Image src="/images/logo.jpg" alt="Jolly & Honest" width={36} height={36} className="rounded-full" />
            <span className="font-serif text-xl font-semibold text-cream">Jolly &amp; Honest</span>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed">
            Bespoke gents tailoring in Navrangpura, Ahmedabad — 74 years of honest craftsmanship.
          </p>
        </div>
        {COLUMNS.map((col) => (
          <div key={col.heading}>
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gold">{col.heading}</p>
            <ul className="mt-4 space-y-1">
              {col.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="inline-flex min-h-9 items-center text-sm hover:text-cream">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-cream/10">
        <p className="mx-auto max-w-6xl px-6 py-6 text-xs text-cream/70 sm:px-10">
          © {new Date().getFullYear()} Jolly &amp; Honest. The online store is a portfolio demo;
          bespoke tailoring and fittings are real.
        </p>
      </div>
    </footer>
  );
}
