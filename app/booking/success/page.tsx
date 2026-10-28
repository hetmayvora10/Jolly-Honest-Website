import Link from "next/link";

export default function BookingSuccessPage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center bg-cream px-6 py-24 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-burgundy text-cream">
        <svg aria-hidden="true" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="m20 6-11 11-5-5" />
        </svg>
      </div>
      <h1 className="mt-6 font-serif text-4xl font-semibold text-ink">
        Your Fitting is Confirmed
      </h1>
      <p className="mx-auto mt-4 max-w-md text-lg leading-relaxed text-ink/70">
        We&apos;ve received your deposit and locked in your slot. One of our
        tailors will call you shortly to confirm the details.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-full bg-burgundy px-8 py-3.5 text-sm font-semibold tracking-wide text-cream pressable hover:bg-burgundy-dark"
      >
        Back to Home
      </Link>
    </main>
  );
}
