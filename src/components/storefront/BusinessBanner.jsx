import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function BusinessBanner() {
  return (
    <section className="border-y border-sf-line bg-sf-paper">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-5 py-6 sm:px-8">
        <p className="text-[13px] text-sf-muted">
          <span className="font-semibold text-sf-ink">Building a clinic or brand?</span> MedRevolve powers
          white-label telehealth for operators.
        </p>
        <Link
          to="/ForBusiness"
          className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-sf-accent hover:underline"
        >
          Explore the B2B platform
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </section>
  );
}