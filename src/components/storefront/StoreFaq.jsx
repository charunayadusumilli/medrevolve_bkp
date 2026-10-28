import React from 'react';
import { Link } from 'react-router-dom';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const FAQS = [
  {
    q: 'How does the MedRevolve visit work?',
    a: 'You answer a short medical questionnaire, then a US-licensed provider reviews it — usually the same day. If treatment is appropriate, the prescription is sent to a licensed pharmacy and shipped to your door. If it is not, you are not charged for medication.',
  },
  {
    q: 'Do I need insurance?',
    a: 'No. Every price on the storefront is a cash-pay price. You can use an HSA or FSA card where eligible, but nothing is billed to insurance and there is no prior-authorization process.',
  },
  {
    q: 'What is the difference between FDA-approved and compounded treatments?',
    a: 'FDA-approved products have been reviewed by the FDA for safety, effectiveness and quality. Compounded products are prepared by state-licensed 503A pharmacies and are not FDA-approved; the FDA does not review them for safety, effectiveness or quality. Your provider will explain which option fits your situation.',
  },
  {
    q: 'Which states can you ship to?',
    a: 'We serve all 50 states and Washington, DC. A few compounded preparations — NAD+, glutathione and cold-chain kits — cannot ship to Alaska or Hawaii. Enter your state in the basket to confirm eligibility before checkout.',
  },
  {
    q: 'How fast is shipping?',
    a: 'Direct-purchase products leave the warehouse in 1–2 business days. Prescription items ship after provider approval and pharmacy dispensing, typically 3–5 business days. Shipping is free on orders over $50 and everything arrives in discreet packaging.',
  },
  {
    q: 'Can I cancel a subscription?',
    a: 'Yes. Refill subscriptions can be paused, rescheduled or cancelled from your account at any time before the next shipment — there is no cancellation fee.',
  },
  {
    q: 'Is my health information private?',
    a: 'Yes. Intake data is handled under HIPAA and is shared only with the licensed provider reviewing your case and the dispensing pharmacy. See our HIPAA Notice and Privacy Policy for the full detail.',
  },
];

export default function StoreFaq() {
  return (
    <section className="mx-auto max-w-4xl px-5 py-16 sm:px-8">
      <div className="text-center">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-sf-muted">Questions</p>
        <h2 className="mt-2 font-display text-[30px] tracking-tight sm:text-[38px]">Before you start</h2>
      </div>

      <Accordion type="single" collapsible className="mt-8">
        {FAQS.map((item, index) => (
          <AccordionItem key={item.q} value={`faq-${index}`} className="border-sf-line">
            <AccordionTrigger className="py-4 text-left text-[14px] font-semibold hover:no-underline">
              {item.q}
            </AccordionTrigger>
            <AccordionContent className="pb-4 text-[13px] leading-relaxed text-sf-muted">
              {item.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <p className="mt-8 text-center text-[12px] text-sf-muted">
        Still deciding?{' '}
        <Link to="/patient-faq" className="font-semibold text-sf-accent underline">
          Read the full patient FAQ
        </Link>
      </p>
    </section>
  );
}