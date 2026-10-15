import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-burgundy-dark text-cream/80">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-6 py-12 text-center sm:px-10">
        <div className="flex items-center gap-3">
          <Image
            src="/images/logo.jpg"
            alt="Jolly & Honest"
            width={36}
            height={36}
            className="rounded-full"
          />
          <span className="font-serif text-lg font-semibold text-cream">
            Jolly &amp; Honest
          </span>
        </div>
        <p className="max-w-md text-sm leading-relaxed">
          Bespoke gents tailoring in Navrangpura, Ahmedabad — 74 years of
          honest craftsmanship.
        </p>
        <p className="text-xs text-cream/70">
          © {new Date().getFullYear()} Jolly &amp; Honest. All rights
          reserved.
        </p>
      </div>
    </footer>
  );
}
