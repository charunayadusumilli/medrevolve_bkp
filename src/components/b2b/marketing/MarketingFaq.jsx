import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { MARKETING_FAQ } from '@/lib/partner/marketingPage';

export default function MarketingFaq() {
  return (
    <section className="border-t border-site-line bg-site-cream">
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 md:py-20">
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-site-rust">
          Questions
        </p>
        <h2 className="mt-3 max-w-2xl font-display text-[30px] leading-tight tracking-tight text-site-moss sm:text-[40px]">
          Telehealth marketing, answered
        </h2>

        <Accordion type="single" collapsible className="mt-8 max-w-3xl border-t border-site-line">
          {MARKETING_FAQ.map((item, i) => (
            <AccordionItem key={item.question} value={`faq-${i}`} className="border-b border-site-line">
              <AccordionTrigger className="py-4 text-left text-[14px] font-semibold text-site-moss hover:no-underline">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="pb-4 text-[13px] leading-relaxed text-site-greige">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}