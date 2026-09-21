import React from 'react';
import SEOHead from '@/components/SEOHead';
import FAQSection from '@/components/home/FAQSection';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Phone, Layers, CreditCard, Users, Headset } from 'lucide-react';

const FAQS = [
  { question: 'Do I need clinical knowledge to launch?', answer: 'No — licensed physicians and compliance are part of the platform; you bring the brand and the audience.' },
  { question: 'Does it work with an existing content funnel?', answer: 'Yes — offers, intake, payments, and CRM connect to your existing traffic.' },
];

const WHAT_YOU_GET = [
  { icon: Layers, title: 'White-label services', desc: 'Intake, licensed physicians, pharmacy fulfillment, EMR, and compliance monitoring — under YOUR brand.' },
  { icon: CreditCard, title: 'Payments built for telehealth', desc: 'High-risk payment processing built in, so a processor shutdown never kills your brand.' },
  { icon: Users, title: 'Unified CRM', desc: 'Every customer relationship — leads, patients, conversations, pipelines — in one place.' },
  { icon: Headset, title: '24/7 support to resolution', desc: 'You run it yourself with 24/7 support to resolution — no operations team needed.' },
];

export default function ForCreatorsLP() {
  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      <SEOHead
        title="For Creators: Launch Your Own Telehealth Brand | MedRevolve"
        description="Creators: turn your audience into a telehealth brand. Self-run white-label platform with services, payments, and CRM built in. 24/7 support."
      />

      <section className="bg-[#060606] pt-20 pb-24 px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-widest text-[#A8C99B] mb-4">For Creators</p>
          <h1 className="text-4xl md:text-5xl font-light text-white mb-5 leading-tight">
            Turn your audience into<br /><span className="font-semibold text-[#A8C99B]">a brand of your own</span>
          </h1>
          <p className="text-xl text-white/45 max-w-2xl mx-auto mb-10">
            You've built an audience. The highest-value thing you can offer them next is a brand of your own.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/ForBusiness"><Button size="lg" className="bg-white text-black hover:bg-white/90 rounded-none px-10 font-bold text-base">Apply for White-Label <ArrowRight className="ml-2 w-5 h-5" /></Button></Link>
            <a href="tel:+12403875224"><Button size="lg" variant="ghost" className="text-white border border-white/20 hover:bg-white/10 rounded-none px-10 text-base"><Phone className="mr-2 w-4 h-4" /> (240) 387-5224</Button></a>
          </div>
          <p className="text-white/30 text-xs mt-6">Tell us about your audience.</p>
        </div>
      </section>

      <section className="py-24 px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-light text-[#2D3A2D] mb-4 text-center">Why creators win in telehealth</h2>
          <p className="text-[#5A6B5A] text-lg text-center max-w-2xl mx-auto mb-12">You already have trust and distribution. The missing piece is the regulated backend. MedRevolve provides it.</p>
          <div className="grid sm:grid-cols-2 gap-6">
            {WHAT_YOU_GET.map(w => {
              const Icon = w.icon;
              return (
                <div key={w.title} className="bg-white rounded-2xl border border-[#E8E0D5] p-7 shadow-sm">
                  <div className="w-12 h-12 rounded-xl bg-[#D4E5D7] flex items-center justify-center mb-4"><Icon className="w-6 h-6 text-[#4A6741]" /></div>
                  <h3 className="text-lg font-semibold text-[#2D3A2D] mb-2">{w.title}</h3>
                  <p className="text-[#5A6B5A] text-sm leading-relaxed">{w.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 lg:px-8 bg-[#F5F0E8]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-light text-[#2D3A2D] mb-4">How it works</h2>
          <p className="text-[#5A6B5A] text-lg leading-relaxed">Bring your audience and brand. The platform handles the rest. You run it yourself with 24/7 support to resolution — no operations team needed.</p>
        </div>
      </section>

      <section className="py-20 px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-light text-[#2D3A2D] mb-4">The economics</h2>
          <p className="text-[#5A6B5A] text-lg leading-relaxed">Full Platform Bundle <span className="font-semibold text-[#2D3A2D]">$4,000 setup + $250/mo</span>. Your brand, your pricing, your margin.</p>
        </div>
      </section>

      <FAQSection tag="FAQ" title="For Creators FAQ" faqs={FAQS} />

      <section className="py-20 px-6 lg:px-8 bg-gradient-to-br from-[#4A6741] via-[#3D5636] to-[#2D3A2D]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-light text-white mb-4">Apply at medrevolve.com/ForBusiness or call (240) 387-5224 — tell us about your audience.</h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Link to="/ForBusiness"><Button size="lg" className="bg-white text-[#2D3A2D] hover:bg-white/90 rounded-none px-12 font-bold text-base">Apply Now <ArrowRight className="ml-2 w-5 h-5" /></Button></Link>
            <a href="tel:+12403875224"><Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10 rounded-none px-12 text-base"><Phone className="mr-2 w-4 h-4" /> (240) 387-5224</Button></a>
          </div>
        </div>
      </section>
    </div>
  );
}