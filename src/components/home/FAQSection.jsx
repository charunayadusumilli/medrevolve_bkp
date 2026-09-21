import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

/**
 * Reusable FAQ section with FAQPage JSON-LD structured data.
 * @param {string} title - section heading
 * @param {string} subtitle - section subheading
 * @param {Array<{question, answer}>} faqs - list of Q&As
 * @param {string} tag - small uppercase tag above title
 * @param {string} bg - tailwind bg class for the section
 */
export default function FAQSection({ title, subtitle, faqs, tag, bg = 'bg-[#FDFBF7]' }) {
  const [openIdx, setOpenIdx] = React.useState(0);

  // Inject FAQPage JSON-LD
  const jsonLd = useMemo(() => ({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.answer,
      },
    })),
  }), [faqs]);

  React.useEffect(() => {
    const id = 'faq-jsonld-' + (title || '').replace(/\s+/g, '-').toLowerCase();
    let el = document.getElementById(id);
    if (!el) {
      el = document.createElement('script');
      el.id = id;
      el.type = 'application/ld+json';
      document.head.appendChild(el);
    }
    el.textContent = JSON.stringify(jsonLd);
    return () => {
      const node = document.getElementById(id);
      if (node) node.remove();
    };
  }, [jsonLd, title]);

  return (
    <section className={`py-24 px-6 lg:px-8 ${bg}`}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-14">
          {tag && <p className="text-xs font-bold uppercase tracking-widest text-[#4A6741] mb-3">{tag}</p>}
          <h2 className="text-4xl md:text-5xl font-light text-[#2D3A2D] mb-4">{title}</h2>
          {subtitle && <p className="text-[#5A6B5A] text-lg max-w-2xl mx-auto">{subtitle}</p>}
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => {
            const isOpen = openIdx === i;
            return (
              <div key={i} className="bg-white rounded-2xl border border-[#E8E0D5] overflow-hidden shadow-sm">
                <button
                  onClick={() => setOpenIdx(isOpen ? -1 : i)}
                  className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
                >
                  <span className="font-semibold text-[#2D3A2D] text-base md:text-lg">{faq.question}</span>
                  <ChevronDown className={`w-5 h-5 text-[#4A6741] flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <p className="px-6 pb-5 text-[#5A6B5A] leading-relaxed text-[15px]">{faq.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}