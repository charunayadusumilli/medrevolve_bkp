import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function ServicesCloseOut() {
  return (
    <section className="border-t border-site-line bg-site-surface">
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 md:py-20">
        <div className="max-w-2xl">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-site-rust">
            Start here
          </p>
          <h2 className="mt-3 font-display text-[30px] leading-tight tracking-tight text-site-moss sm:text-[38px]">
            Not sure which one? Start with the $500 audit.
          </h2>
          <p className="mt-4 text-[14px] leading-relaxed text-site-greige">
            Every engagement begins with a written scope. Nothing hourly starts before a fixed-price audit is
            complete.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-4">
            <Link
              to="/audit"
              className="inline-flex items-center gap-2 rounded-lg bg-site-rust px-6 py-3.5 text-[14px] font-semibold text-site-cream transition-opacity hover:opacity-90"
            >
              See the $500 audit <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/partners"
              className="text-[13px] font-semibold text-site-moss underline decoration-site-line underline-offset-4 hover:decoration-site-moss"
            >
              Referred by a partner?
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}