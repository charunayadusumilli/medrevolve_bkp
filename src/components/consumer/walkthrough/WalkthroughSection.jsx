import React from 'react';
import StoryDeck from './StoryDeck';

export default function WalkthroughSection({ id, eyebrow, title, intro, slides, aside }) {
  return (
    <section id={id} className="scroll-mt-20 border-t border-site-line bg-site-cream">
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 md:py-20">
        <div className="grid gap-8 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] md:gap-14">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-site-rust">{eyebrow}</p>
            <h2 className="mt-3 font-display text-[32px] leading-[1.1] tracking-tight text-site-moss sm:text-[40px]">
              {title}
            </h2>
            <p className="mt-4 text-[14px] leading-relaxed text-site-greige">{intro}</p>
            {aside && (
              <div className="mt-6 rounded-lg border border-site-line bg-site-surface p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-site-greige">
                  {aside.label}
                </p>
                <p className="mt-2 text-[13px] leading-relaxed text-site-moss">{aside.body}</p>
              </div>
            )}
          </div>
          <StoryDeck slides={slides} />
        </div>
      </div>
    </section>
  );
}