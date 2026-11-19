import React from 'react';

/** Product FAQ copy — the same list feeds the FAQPage JSON-LD. Research context only. */
export function productFaq(product) {
  const lot = product?.coa_lot || 'the lot printed on the vial';
  const lab = product?.lab_name || 'Vanguard Laboratory';

  return [
    {
      question: 'What does the certificate of analysis cover for this lot?',
      answer: product?.coa_url
        ? `The released report for lot ${lot} covers identity by mass spectrometry, HPLC purity, net content, endotoxin (USP <85>), sterility and heavy metals by ICP-MS. It is hosted by ${lab} and linked from the batch analysis panel.`
        : `The report for lot ${lot} has not been released by ${lab} yet. Until it is, every panel row is shown as pending and no result is published.`,
    },
    {
      question: 'How is volume pricing calculated?',
      answer:
        'Pricing is per line, applied automatically in the cart: 1–2 units at the unit price, 3–5 units at the middle tier, 6 or more at the lowest tier. No code or coupon is needed.',
    },
    {
      question: 'How is the material shipped and stored?',
      answer:
        'Units ship from the USA in sealed vials with an adult signature required. Store desiccated, protected from light, at the temperature stated on the product record.',
    },
    {
      question: 'Who can order from this catalog?',
      answer:
        'Qualified researchers and laboratories, 21 or older. Every order confirms that materials are for in-vitro laboratory research and will not be administered to humans or animals.',
    },
  ];
}

export default function ProductFaq({ product }) {
  const faqs = productFaq(product);

  return (
    <section className="mt-12 border-t border-ruo-ink pt-8">
      <h2 className="font-mono text-[10px] uppercase tracking-[0.18em] text-ruo-muted">Questions</h2>
      <dl className="mt-4 divide-y divide-ruo-line">
        {faqs.map((item) => (
          <div key={item.question} className="py-5">
            <dt className="text-[13px] font-semibold leading-snug text-ruo-ink">{item.question}</dt>
            <dd className="mt-2 max-w-2xl text-[12px] leading-relaxed text-ruo-muted">{item.answer}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}