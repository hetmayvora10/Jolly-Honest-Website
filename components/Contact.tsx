"use client";

import { motion } from "framer-motion";

const ADDRESS =
  "Havmor Building, Beside Havmor Restaurant, Near Hotel Armoise, Navrangpura Cross Roads, Navrangpura, Ahmedabad, Gujarat 380009";

const HOURS = [
  { day: "Monday – Saturday", time: "10:00 AM – 8:00 PM" },
  { day: "Sunday", time: "Closed" },
];

const PHONE_DISPLAY = "+91 84010 45351";
const PHONE_TEL = "+918401045351";
const PHONE_WHATSAPP = "918401045351";

export default function Contact() {
  return (
    <section id="visit" className="bg-cream">
      <div className="mx-auto max-w-6xl px-6 py-24 sm:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-burgundy/70">
            Visit the Shop
          </p>
          <h2 className="mt-4 font-serif text-4xl font-semibold text-ink sm:text-5xl">
            Come see us in Navrangpura
          </h2>
        </motion.div>

        <div className="mt-14 grid gap-8 overflow-hidden rounded-3xl border border-burgundy/10 bg-white shadow-sm lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6 }}
            className="flex flex-col justify-center gap-8 p-8 sm:p-10"
          >
            <div>
              <h3 className="font-serif text-2xl font-semibold text-ink">
                Address
              </h3>
              <p className="mt-2 leading-relaxed text-ink/70">{ADDRESS}</p>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  ADDRESS
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-block text-sm font-semibold text-burgundy underline underline-offset-4"
              >
                Get Directions
              </a>
            </div>

            <div>
              <h3 className="font-serif text-2xl font-semibold text-ink">
                Hours
              </h3>
              <dl className="mt-2 space-y-1">
                {HOURS.map((h) => (
                  <div key={h.day} className="flex justify-between gap-4 text-ink/70">
                    <dt>{h.day}</dt>
                    <dd className="font-medium text-ink">{h.time}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div>
              <h3 className="font-serif text-2xl font-semibold text-ink">
                Contact
              </h3>
              <p className="mt-2 text-ink/70">
                Call ahead to book a fitting or request a home visit.
              </p>
              <div className="mt-3 flex flex-wrap gap-3">
                <a
                  href={`tel:${PHONE_TEL}`}
                  className="inline-block rounded-full bg-burgundy px-6 py-3 text-sm font-semibold text-cream transition-colors hover:bg-burgundy-dark"
                >
                  Call {PHONE_DISPLAY}
                </a>
                <a
                  href={`https://wa.me/${PHONE_WHATSAPP}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block rounded-full border border-burgundy/30 px-6 py-3 text-sm font-semibold text-burgundy transition-colors hover:bg-burgundy/5"
                >
                  WhatsApp Us
                </a>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6 }}
            className="min-h-[320px]"
          >
            <iframe
              title="Jolly & Honest location map"
              src={`https://www.google.com/maps?q=${encodeURIComponent(
                ADDRESS
              )}&output=embed`}
              className="h-full min-h-[320px] w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
