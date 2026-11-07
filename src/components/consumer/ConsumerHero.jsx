import React from 'react';
import { Link } from 'react-router-dom';
import { Stethoscope, FlaskConical, ShieldCheck, Truck } from 'lucide-react';

const HERO_IMAGE =
  'https://media.base44.com/images/public/698bb392815cbad420c2ec1a/e9a1c45e1_generated_image.png';

const MARKS = [
  { icon: Stethoscope, label: 'US-licensed clinicians' },
  { icon: FlaskConical, label: 'Lab-tested lots' },
  { icon: ShieldCheck, label: 'LegitScript certified' },
  { icon: Truck, label: 'Discreet delivery' },
];

export default function ConsumerHero() {
  return (
    <section className="mx-auto max-w-7xl px-5 pb-16 pt-10 sm:px-8 md:pb-24 md:pt-16">
      <div className="grid items-center gap-12 md:grid-cols-[1.05fr_0.95fr] md:gap-14">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-site-rust">
            Lab-verified telehealth · US licensed
          </p>
          <h1 className="mt-4 max-w-xl font-display text-[42px] leading-[1.03] tracking-tight text-site-moss sm:text-[58px]">
            Know what's in it before it's in you.
          </h1>
          <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-site-greige">
            Every compounded lot is tested by an accredited lab, filled by a state-licensed 503A pharmacy, and
            prescribed by a clinician who has read your intake. The certificate, the studies and the dose
            schedule sit on the same page as the price.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              to="/start"
              className="rounded-lg bg-site-rust px-6 py-3.5 text-[14px] font-semibold text-site-cream transition-opacity duration-200 hover:opacity-90"
            >
              Start my intake — 10 min
            </Link>
            <Link
              to="/#safety"
              className="text-[14px] font-semibold text-site-moss underline decoration-site-line decoration-1 underline-offset-4 transition-colors duration-200 hover:decoration-site-rust"
            >
              Walk me through the evidence
            </Link>
          </div>

          <p className="mt-5 text-[12px] text-site-greige">
            No insurance required · Free shipping over $99 · A prescription is not guaranteed
          </p>

          <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-3 border-t border-site-line pt-6">
            {MARKS.map(({ icon: Icon, label }) => (
              <p key={label} className="flex items-center gap-2 text-[12px] font-medium text-site-moss">
                <Icon className="h-3.5 w-3.5 shrink-0 text-site-rust" strokeWidth={1.7} />
                {label}
              </p>
            ))}
          </div>
        </div>

        <div className="relative">
          <img
            src={HERO_IMAGE}
            alt="MedRevolve prescription packaging on a cream linen surface"
            className="aspect-[4/5] w-full rounded-xl object-cover shadow-[0_18px_50px_-30px_rgba(31,45,39,0.5)]"
          />
          <div className="absolute inset-x-4 bottom-4 rounded-xl border border-site-line bg-site-cream/95 p-4 backdrop-blur sm:inset-x-auto sm:left-5 sm:w-[262px]">
            <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-site-rust">
              Included with every Rx order
            </p>
            <ul className="mt-2 space-y-1.5 text-[12px] leading-snug text-site-moss">
              <li>Lot number printed on the vial</li>
              <li>Certificate of analysis on file</li>
              <li>A clinician check-in at every dose step</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}