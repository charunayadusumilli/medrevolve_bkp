import React from 'react';
import { Link } from 'react-router-dom';
import { FlaskConical, FileCheck2, Barcode } from 'lucide-react';
import { LAB_STEPS } from '@/lib/consumer/education';

const MARKS = [
  { icon: FlaskConical, label: 'Accredited lab', note: 'Identity, strength and sterility tested per lot' },
  { icon: FileCheck2, label: '503A partner pharmacy', note: 'State-licensed, patient-specific compounding' },
  { icon: Barcode, label: 'Lot on the vial', note: 'Batch number matches the certificate on file' },
];

export default function LabVerifiedBand() {
  return (
    <section id="lab-verified" className="scroll-mt-20 border-y border-site-line bg-site-surface">
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 md:py-20">
        <div className="max-w-2xl">
          <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-site-rust">Traceable to the vial</p>
          <h2 className="mt-3 font-display text-[32px] leading-[1.1] tracking-tight text-site-moss sm:text-[40px]">
            The certificate comes before the claim.
          </h2>
          <p className="mt-4 text-[14px] leading-relaxed text-site-greige">
            Anyone can print “third-party tested”. What matters is a named pharmacy, a lot number on your vial,
            and a lab report you can ask for and read.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {MARKS.map(({ icon: Icon, label, note }) => (
            <div key={label} className="rounded-xl border border-site-line bg-site-cream p-6">
              <Icon className="h-5 w-5 text-site-rust" strokeWidth={1.6} />
              <p className="mt-4 text-[14px] font-semibold text-site-moss">{label}</p>
              <p className="mt-1.5 text-[13px] leading-relaxed text-site-greige">{note}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 grid gap-px overflow-hidden rounded-xl border border-site-line bg-site-line sm:grid-cols-2 lg:grid-cols-4">
          {LAB_STEPS.map((item) => (
            <div key={item.step} className="bg-site-surface p-5">
              <p className="font-body text-[11px] font-semibold tabular-nums text-site-rust">{item.step}</p>
              <p className="mt-2 text-[13px] font-semibold text-site-moss">{item.title}</p>
              <p className="mt-1.5 text-[12px] leading-relaxed text-site-greige">{item.body}</p>
            </div>
          ))}
        </div>

        <p className="mt-6 text-[12px] leading-relaxed text-site-greige">
          Need the certificate for a lot you already received?{' '}
          <Link to="/patient-faq" className="font-semibold text-site-moss underline decoration-site-line underline-offset-4 hover:decoration-site-rust">
            How to request a lot COA
          </Link>
        </p>
      </div>
    </section>
  );
}