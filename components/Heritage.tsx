import Reveal from "./Reveal";

const STATS = [
  { value: "74+", label: "Years of Craft" },
  { value: "4.6★", label: "Customer Rating" },
  { value: "187+", label: "Happy Reviews" },
  { value: "5", label: "Master Tailors" },
];

export default function Heritage() {
  return (
    <section id="heritage" className="bg-cream">
      <div className="mx-auto max-w-6xl px-6 py-24 sm:px-10">
        <div className="grid gap-14 md:grid-cols-2 md:gap-20">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-burgundy/70">
              Our Heritage
            </p>
            <h2 className="mt-4 font-serif text-4xl font-semibold leading-tight text-ink sm:text-5xl">
              Three generations of the tailor&apos;s craft
            </h2>
            <div className="mt-6 space-y-4 text-base leading-relaxed text-ink/70 sm:text-lg">
              <p>
                For seventy-four years, Jolly &amp; Honest has dressed the
                grooms, professionals and gentlemen of Ahmedabad from our
                home at Navrangpura Cross Roads. What began as a small
                tailoring counter has grown into a name trusted across the
                city — without ever losing the hand-stitched care it started
                with.
              </p>
              <p>
                Every sherwani, shirt and suit that leaves our shop is cut by
                a master tailor, fitted to the individual, and finished with
                the same honesty the name has carried since the beginning.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.06} className="grid grid-cols-2 gap-5">
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-burgundy/10 bg-white px-6 py-8 text-center shadow-sm"
              >
                <div className="font-serif text-4xl font-semibold text-burgundy sm:text-5xl">
                  {stat.value}
                </div>
                <div className="mt-2 text-sm font-medium uppercase tracking-wide text-ink/60">
                  {stat.label}
                </div>
              </div>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
