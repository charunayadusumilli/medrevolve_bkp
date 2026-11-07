import React from 'react';
import { FIRST_QUESTIONS } from '@/lib/consumer/education';

export default function FirstWeekQuestions() {
  return (
    <section className="border-t border-site-line bg-site-cream">
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 md:py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-xl">
            <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-site-rust">Ask it plainly</p>
            <h2 className="mt-3 font-display text-[32px] leading-[1.1] tracking-tight text-site-moss sm:text-[40px]">
              The six questions behind most first orders.
            </h2>
          </div>
          <p className="max-w-xs text-[12px] leading-relaxed text-site-greige">
            Swipe through. Each answer is the short version a clinician would give you on a call, with the
            long version one tap away.
          </p>
        </div>

        <div className="mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {FIRST_QUESTIONS.map((item, i) => (
            <article
              key={item.question}
              className="flex min-h-[280px] w-[280px] shrink-0 snap-start flex-col rounded-xl border border-site-line bg-site-surface p-5 sm:w-[320px]"
            >
              <span className="font-body text-[11px] font-semibold tabular-nums text-site-rust">
                0{i + 1}
              </span>
              <p className="mt-3 text-[15px] font-semibold leading-snug text-site-moss">“{item.question}”</p>
              <p className="mt-3 border-l-2 border-site-rust pl-3 text-[13px] font-semibold text-site-moss">
                {item.tldr}
              </p>
              <p className="mt-3 text-[12px] leading-relaxed text-site-greige">{item.detail}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}