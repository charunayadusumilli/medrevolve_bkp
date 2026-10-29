import React from 'react';
import { Link } from 'react-router-dom';
import { RUO_STATEMENT } from '@/lib/ruo/storefront';

const SECTIONS = [
  {
    heading: 'Intended use',
    body: [
      RUO_STATEMENT,
      'Materials are supplied to qualified researchers and laboratories. Purchasers confirm at checkout that they are 21 or older and that materials will not be administered to humans or animals.',
    ],
  },
  {
    heading: 'Lots and certificates of analysis',
    body: [
      'Every unit is labelled with a lot number. Released lots carry a purity result from an independent laboratory, and the report itself is hosted by that laboratory — not by us.',
      'Where a lot shows COA pending, the laboratory has not released the report yet. Those lots can be ordered, but the purity figure is not published until release.',
    ],
  },
  {
    heading: 'Handling and storage',
    body: [
      'Lyophilized materials ship at ambient temperature in sealed vials and should be stored desiccated, protected from light, at the temperature stated on the product record. Reconstitution, if performed, is the purchaser’s responsibility under their own laboratory protocol.',
    ],
  },
  {
    heading: 'Shipping and lead time',
    body: [
      'Orders dispatch from the lead time stated per item, in business days. Tracking is emailed at dispatch. Shipments require an adult signature and are addressed to the purchasing business only.',
    ],
  },
  {
    heading: 'Payment and terms',
    body: [
      'Card payment is available on every order. ACH and wire are available on orders of $2,000 and above; the order is reserved and settlement instructions are emailed within one business day.',
      'Bulk orders paid by Zelle or wire are confirmed manually before dispatch. No order ships before funds clear.',
    ],
  },
  {
    heading: 'Returns',
    body: [
      'Opened vials cannot be returned. Damaged or mis-shipped units are replaced against a photograph of the vial and label within 48 hours of delivery.',
    ],
  },
];

export default function RuoDocumentationPage() {
  return (
    <div className="max-w-3xl">
      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-ruo-muted">Documentation</p>
      <h1 className="mt-2 text-[28px] font-semibold tracking-tight sm:text-[34px]">
        Supply and compliance notes
      </h1>

      <div className="mt-8 divide-y divide-ruo-line border-t border-ruo-ink">
        {SECTIONS.map((section) => (
          <section key={section.heading} className="py-6">
            <h2 className="font-mono text-[10px] uppercase tracking-[0.16em] text-ruo-muted">
              {section.heading}
            </h2>
            <div className="mt-3 space-y-3 text-[13px] leading-relaxed">
              {section.body.map((paragraph) => (
                <p key={paragraph.slice(0, 24)}>{paragraph}</p>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap gap-4 border-t border-ruo-line pt-6 font-mono text-[10px] uppercase tracking-[0.12em]">
        <Link to="/ruo/coas" className="underline underline-offset-4">COA library</Link>
        <Link to="/ruo/verify" className="underline underline-offset-4">Verify a lot</Link>
        <Link to="/ruo/wholesale" className="underline underline-offset-4">Wholesale</Link>
        <a href="mailto:support@medrevolveruo.com" className="underline underline-offset-4">
          support@medrevolveruo.com
        </a>
      </div>
    </div>
  );
}