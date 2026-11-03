import type { ReactNode } from "react";

export default function AuthShell({
  eyebrow,
  title,
  children,
  footer,
}: {
  eyebrow: string;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="mx-auto w-full max-w-md px-4 py-20 sm:py-28">
      <p className="text-center text-[11px] uppercase tracking-[0.4em] text-burgundy">{eyebrow}</p>
      <h1 className="mt-4 text-center font-serif text-5xl font-light text-ink">{title}</h1>
      <div aria-hidden="true" className="mx-auto mb-10 mt-6 h-px w-12 bg-gold-dark" />
      {children}
      {footer && <div className="mt-10 border-t border-ink/10 pt-8 text-center text-sm text-ink/70">{footer}</div>}
    </div>
  );
}
