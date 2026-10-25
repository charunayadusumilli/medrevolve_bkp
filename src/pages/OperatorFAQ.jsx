import React from 'react';
import SEOHead from '@/components/SEOHead';
import FAQSection from '@/components/home/FAQSection';

const OPERATOR_FAQS = [
  { question: 'What is MedRevolve?', answer: 'MedRevolve Corporation is a white-label telehealth infrastructure company. We build and operate the complete back end behind your brand: AI intake, a licensed clinician network, payment processing, pharmacy fulfillment, a unified CRM, and real-time compliance monitoring.' },
  { question: 'Who is MedRevolve for?', answer: 'Entrepreneurs and creators with an audience, clinics and med spas adding service lines, and agencies or partners delivering white-label programs for their clients.' },
  { question: 'How fast can we launch?', answer: 'The standard is 7 days from a scoped contract — AI intake, CRM, payment rails, and pharmacy setup included.' },
  { question: 'Do we keep our own brand?', answer: 'Yes. Your domain, your identity, your pricing, and your customer relationships. MedRevolve is the invisible infrastructure layer.' },
  { question: 'What is included in the platform?', answer: 'AI intake and triage, a US-licensed clinician network contracted across all 50 states, high-risk payment processing with automated retries and subscriptions, 50-state licensed pharmacy fulfillment, a unified CRM with automation, and real-time compliance monitoring with audit-ready documentation.' },
  { question: 'What happens when a regulation changes?', answer: 'MedRevolve tracks FDA and federal regulatory activity in real time and alerts operators before changes take effect, with continuity plans and audit-ready logging per patient.' },
  { question: 'What does it cost?', answer: 'Service bundles and pricing are listed on the For Business page. For a scoped quote, talk to us directly.' },
  { question: 'How do we get started?', answer: 'Start on the For Business page or book a demo. You need one executive sponsor, one 30-day pilot scope, and a decision point at day 30.' },
];

export default function OperatorFAQ() {
  return (
    <div className="min-h-screen bg-[#F7F4ED]">
      <SEOHead
        title="Operator FAQ — White-Label Telehealth Infrastructure | MedRevolve"
        description="Answers for operators evaluating MedRevolve: what the platform includes, how fast you can launch, white-label branding, compliance monitoring, and how to get started."
      />

      <section className="bg-[#1F2D27] px-6 lg:px-12 pt-16 pb-20">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block text-[11px] font-black uppercase tracking-[0.25em] text-[#A66B3C] mb-6">
            Operator FAQ
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-white leading-[1.08] mb-5" style={{ letterSpacing: '-0.03em' }}>
            Questions from operators,<br />
            <span className="text-[#A66B3C]">answered directly.</span>
          </h1>
          <p className="text-white/55 text-lg max-w-2xl mx-auto leading-relaxed">
            What the platform covers, how quickly you can be live, and what a partnership actually requires.
          </p>
        </div>
      </section>

      <FAQSection
        faqs={OPERATOR_FAQS}
        bg="bg-[#F7F4ED]"
      />
    </div>
  );
}