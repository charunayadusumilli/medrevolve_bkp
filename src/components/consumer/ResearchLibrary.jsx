import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { RESEARCH } from '@/lib/consumer/education';

export default function ResearchLibrary() {
  return (
    <section id="research" className="scroll-mt-20 border-t border-site-line bg-site-surface">
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 md:py-20">
        <div className="max-w-2xl">
          <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-site-rust">Read it yourself</p>
          <h2 className="mt-3 font-display text-[32px] leading-[1.1] tracking-tight text-site-moss sm:text-[40px]">
            The studies behind the shelf.
          </h2>
          <p className="mt-4 text-[14px] leading-relaxed text-site-greige">
            Every product page points back to the published trial data. These are the ones patients ask about
            most — read the abstract before you read our marketing.
          </p>
        </div>

        <div className="mt-10 grid gap-px overflow-hidden rounded-xl border border-site-line bg-site-line md:grid-cols-2">
          {RESEARCH.map((study) => (
            <a
              key={study.title}
              href={`https://pubmed.ncbi.nlm.nih.gov/?term=${study.term}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col bg-site-cream p-6 transition-colors duration-200 hover:bg-site-surface"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-site-rust">
                  {study.area}
                </span>
                <ArrowUpRight className="h-4 w-4 text-site-greige transition-colors duration-200 group-hover:text-site-moss" />
              </div>
              <p className="mt-3 text-[14px] font-semibold leading-snug text-site-moss">{study.title}</p>
              <p className="mt-2 text-[13px] leading-relaxed text-site-greige">{study.finding}</p>
              <p className="mt-4 border-t border-site-line pt-3 text-[11px] text-site-greige">{study.cite}</p>
            </a>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-[12px] text-site-greige">
          <a
            href="https://clinicaltrials.gov/search?term=obesity%20pharmacotherapy"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-site-moss underline decoration-site-line underline-offset-4 hover:decoration-site-rust"
          >
            Open trials on ClinicalTrials.gov
          </a>
          <span>Citations link to PubMed abstracts, not to us.</span>
        </div>
      </div>
    </section>
  );
}