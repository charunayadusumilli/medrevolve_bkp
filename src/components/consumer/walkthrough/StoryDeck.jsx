import React, { useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function StoryDeck({ slides }) {
  const [index, setIndex] = useState(0);
  const slide = slides[index];
  const go = (next) => setIndex((next + slides.length) % slides.length);

  return (
    <div className="overflow-hidden rounded-xl border border-site-line bg-site-surface">
      <div className="px-6 pb-6 pt-5 sm:px-8">
        <div className="flex items-center gap-1.5">
          {slides.map((item, i) => (
            <button
              key={item.title}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={cn(
                'h-[3px] flex-1 rounded-full transition-colors duration-200',
                i === index ? 'bg-site-rust' : 'bg-site-line hover:bg-site-greige/40'
              )}
            />
          ))}
        </div>

        <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.08em] text-site-rust">
          Slide {index + 1} of {slides.length}
        </p>
        <h3 className="mt-2 font-display text-[25px] leading-[1.15] tracking-tight text-site-moss sm:text-[32px]">
          {slide.title}
        </h3>
        <p className="mt-3 max-w-2xl text-[14px] leading-relaxed text-site-greige">{slide.body}</p>
      </div>

      <ul className="grid gap-x-8 gap-y-3 border-t border-site-line px-6 py-6 sm:grid-cols-2 sm:px-8">
        {slide.points.map((point) => (
          <li key={point} className="flex gap-2.5 text-[13px] leading-relaxed text-site-moss">
            <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-site-rust" />
            <span>{point}</span>
          </li>
        ))}
      </ul>

      <div className="flex items-center justify-between gap-4 border-t border-site-line px-6 py-4 sm:px-8">
        <p className="max-w-lg text-[11px] leading-relaxed text-site-greige">{slide.source}</p>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => go(index - 1)}
            aria-label="Previous slide"
            className="grid h-9 w-9 place-items-center rounded-lg border border-site-line text-site-moss transition-colors duration-200 hover:bg-site-cream"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => go(index + 1)}
            aria-label="Next slide"
            className="grid h-9 w-9 place-items-center rounded-lg bg-site-moss text-site-cream transition-opacity duration-200 hover:opacity-90"
          >
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}