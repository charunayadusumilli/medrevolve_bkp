import React from 'react';
import { BOOKING_URL } from '@/lib/contactConfig';
import { CheckCircle, ArrowRight } from 'lucide-react';

// Public pricing for the B2B platform. One price truth:
//   $4,000 platform launch fee (one-time), ongoing terms are set out in your proposal.
// No monthly operations figure is published.

const INCLUDED = [
  'Branded telehealth platform built on your domain',
  'Provider network connected — licensed in all 50 states',
  '503A compounding pharmacy integration and fulfilment',
  'Healthcare-ready payment processing and merchant account',
  'Patient intake, EMR, video visits and follow-up messaging',
  'Compliance setup, LegitScript readiness and monitoring',
];

const SEPARATE = [
  'Medication and pharmacy fulfilment',
  'Provider visit fees',
  'Payment processing fees',
  'LegitScript certification fees, paid to LegitScript',
  'Labs, domain and ad spend',
];

export default function PricingBundles() {
  return (
    <section id="pricing" className="py-24 px-6 lg:px-8 bg-[#F7F4ED] border-y border-[#E8E0D5]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-xs font-bold uppercase tracking-widest text-[#A66B3C] mb-3">Pricing</p>
          <h2 className="text-4xl md:text-5xl font-light text-[#2D3A2D] mb-4">
            One launch fee. <span className="font-semibold">Everything listed, nothing hidden.</span>
          </h2>
          <p className="text-[#5A6B5A] text-lg max-w-2xl mx-auto">
            The platform is built, connected and launched for a flat one-time fee. Ongoing terms are set out in your proposal.
          </p>
        </div>

        <div className="grid lg:grid-cols-[1.1fr_1fr] gap-6 items-stretch">
          {/* Launch fee */}
          <div className="bg-[#1F2D27] rounded-2xl p-8 md:p-10 flex flex-col">
            <p className="text-[#A8C99B] text-xs font-bold uppercase tracking-widest mb-4">Platform launch</p>
            <div className="flex items-end gap-3 mb-2">
              <span className="text-5xl md:text-6xl font-black text-white leading-none">$4,000</span>
              <span className="text-white/50 text-sm font-semibold pb-1.5">one-time launch fee</span>
            </div>
            <p className="text-white/60 text-sm leading-relaxed mb-7">
              Your branded telehealth business built and live in about 7 days. Ongoing platform and support terms are set out in your proposal.
            </p>
            <ul className="space-y-2.5 flex-1">
              {INCLUDED.map(item => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-white/80">
                  <CheckCircle className="w-4 h-4 text-[#A8C99B] flex-shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-white text-[#1F2D27] font-bold rounded-sm px-7 py-3.5 text-sm hover:bg-white/90 transition-colors">
                Book a 20-minute demo <ArrowRight className="w-4 h-4" />
              </a>
            </div>
            <p className="text-white/35 text-xs mt-4">
              Free to book. A demo is not a sale and no payment is taken on the call.
            </p>
          </div>

          {/* What is separate + paid consultation */}
          <div className="flex flex-col gap-6">
            <div className="bg-white rounded-2xl border border-[#E8E0D5] p-8">
              <h3 className="text-lg font-semibold text-[#2D3A2D] mb-4">Paid separately by you</h3>
              <p className="text-[#5A6B5A] text-sm mb-5">
                Third-party costs stay in your name. We walk you through each one before you commit to anything.
              </p>
              <ul className="space-y-2.5">
                {SEPARATE.map(item => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-[#3A453E]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#A66B3C] flex-shrink-0 mt-1.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-2xl border border-[#E8E0D5] p-8">
              <h3 className="text-lg font-semibold text-[#2D3A2D] mb-2">Ready to start?</h3>
              <p className="text-[#5A6B5A] text-sm mb-5">
                Book the free demo first. When you are ready to launch, the paid strategy consultation is the next step.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-[#1F2D27] text-[#F7F4ED] font-bold rounded-sm px-6 py-3 text-sm hover:opacity-90 transition-opacity">
                  Book a free demo
                </a>
                <a href="/MerchantOnboarding"
                  className="inline-flex items-center justify-center gap-2 border border-[#1F2D27]/30 text-[#2D3A2D] font-semibold rounded-sm px-6 py-3 text-sm hover:bg-[#1F2D27]/5 transition-colors">
                  Strategy Consultation (Paid)
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}