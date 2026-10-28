import Reveal from "./Reveal";

const RATING = 4.6;
const STAR_PATH =
  "m12 3 2.6 5.6 6.1.7-4.5 4.2 1.2 6-5.4-3-5.4 3 1.2-6-4.5-4.2 6.1-.7L12 3Z";

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={STAR_PATH} />
    </svg>
  );
}

function Star({ fill }: { fill: number }) {
  return (
    <span className="relative inline-block text-gold-dark">
      <StarIcon filled={false} />
      <span className="absolute inset-y-0 left-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
        <StarIcon filled />
      </span>
    </span>
  );
}

export default function Reviews() {
  return (
    <section id="reviews" className="bg-white">
      <div className="mx-auto max-w-4xl px-6 py-24 text-center sm:px-10">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-burgundy/70">
            Trusted in Ahmedabad
          </p>
          <h2 className="mt-4 font-serif text-4xl font-semibold text-ink sm:text-5xl">
            Rated by our customers
          </h2>

          <div className="mt-10 flex flex-col items-center gap-3 rounded-3xl border border-burgundy/10 bg-cream px-10 py-10 sm:mx-auto sm:max-w-md">
            <div aria-hidden="true" className="font-serif text-6xl font-semibold text-burgundy">
              {RATING}
            </div>
            <div role="img" aria-label={`Rated ${RATING} out of 5`} className="flex gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <Star key={n} fill={Math.min(Math.max(RATING - (n - 1), 0), 1)} />
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
        </Reveal>
      </div>
    </section>
  );
}
