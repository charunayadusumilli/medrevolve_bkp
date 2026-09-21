import React from 'react';
import SEOHead from '@/components/SEOHead';
import FAQSection from '@/components/home/FAQSection';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Phone, CheckCircle, Layers, CreditCard, Users, Headset } from 'lucide-react';

const FAQS = [
  { question: 'Who is this platform for?', answer: 'Entrepreneurs and creators launching telehealth brands, and existing clinic/medspa owners adding services — anyone who wants a self-run platform with a full backend.' },
  { question: 'Do I need a team to operate it?', answer: 'No — the platform is built to be self-run; 24/7 support backs you to resolution.' },
];

const PILLARS = [
  { icon: Layers, title: 'White-Label Services', desc: 'Intake, licensed physicians across all 50 states, pharmacy fulfillment, EMR, and real-time compliance monitoring — all under your brand.' },
  { icon: CreditCard, title: 'Built-In Payment Processing', desc: 'High-risk payment processing designed for telehealth, integrated from day one. No separate processor relationship to lose.' },
  { icon: Users, title: 'Unified CRM', desc: 'Every lead, patient, conversation, and pipeline lives in one place — one dashboard replaces five tabs.' },
  { icon: Headset, title: '24/7 Support to Resolution', desc: 'Not a ticket queue. Every issue is tracked until it is actually resolved, so solo doesn\'t mean alone.' },
];

export default function WhiteLabelTelehealthPlatform() {
  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      <SEOHead
        title="White-Label Telehealth Platform for Entrepreneurs & Creators | MedRevolve"
        description="Services, payments, and unified CRM in one self-run platform. White-label telehealth built for entrepreneurs and creators. 24/7 support to resolution."
      />

      <section className="bg-[#060606] pt-20 pb-24 px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-widest text-[#A8C99B] mb-4">White-Label Telehealth Platform</p>
          <h1 className="text-4xl md:text-5xl font-light text-white mb-5 leading-tight">
            Own a telehealth brand<br /><span className="font-semibold text-[#A8C99B]">without building the machine</span>
          </h1>
          <p className="text-xl text-white/45 max-w-2xl mx-auto mb-10">
            MedRevolve is a white-label telehealth platform built for entrepreneurs and creators who want to own a telehealth brand without building the machine.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/ForBusiness"><Button size="lg" className="bg-white text-black hover:bg-white/90 rounded-none px-10 font-bold text-base">Apply for White-Label <ArrowRight className="ml-2 w-5 h-5" /></Button></Link>
            <a href="tel:+12403875224"><Button size="lg" variant="ghost" className="text-white border border-white/20 hover:bg-white/10 rounded-none px-10 text-base"><Phone className="mr-2 w-4 h-4" /> (240) 387-5224</Button></a>
          </div>
          <p className="text-white/30 text-xs mt-6">Self-run. White-label. Supported 24/7 to resolution.</p>
        </div>
      </section>

      <section className="py-24 px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-light text-[#2D3A2D] mb-12 text-center">What you run — one self-run platform</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {PILLARS.map(p => {
              const Icon = p.icon;
              return (
                <div key={p.title} className="bg-white rounded-2xl border border-[#E8E0D5] p-7 shadow-sm">
                  <div className="w-12 h-12 rounded-xl bg-[#D4E5D7] flex items-center justify-center mb-4"><Icon className="w-6 h-6 text-[#4A6741]" /></div>
                  <h3 className="text-lg font-semibold text-[#2D3A2D] mb-2">{p.title}</h3>
                  <p className="text-[#5A6B5A] text-sm leading-relaxed">{p.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 lg:px-8 bg-[#F5F0E8]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-light text-[#2D3A2D] mb-4">Why self-run matters</h2>
          <p className="text-[#5A6B5A] text-lg leading-relaxed">You set your brand, pricing, and offers. The platform is simple enough to operate yourself. No agency retainer required to run your business.</p>
        </div>
      </section>

      <section className="py-20 px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-light text-[#2D3A2D] mb-4">Support to resolution</h2>
          <p className="text-[#5A6B5A] text-lg leading-relaxed">24/7 support is not a ticket queue. Every issue is tracked until it is actually resolved.</p>
        </div>
      </section>

      <section className="py-20 px-6 lg:px-8 bg-[#F5F0E8]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-light text-[#2D3A2D] mb-4">Pricing</h2>
          <p className="text-[#5A6B5A] text-lg leading-relaxed mb-6">Full Platform Bundle <span className="font-semibold text-[#2D3A2D]">$4,000 setup + $250/mo</span>; modules available individually.</p>
          <p className="text-[#5A6B5A] text-sm">Building the same stack yourself costs $30K-$50K and 6-12 months.</p>
        </div>
      </section>

      <FAQSection tag="FAQ" title="White-Label Platform FAQ" faqs={FAQS} />

      <section className="py-20 px-6 lg:px-8 bg-gradient-to-br from-[#4A6741] via-[#3D5636] to-[#2D3A2D]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-light text-white mb-4">Apply at medrevolve.com/ForBusiness or call (240) 387-5224</h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Link to="/ForBusiness"><Button size="lg" className="bg-white text-[#2D3A2D] hover:bg-white/90 rounded-none px-12 font-bold text-base">Apply Now <ArrowRight className="ml-2 w-5 h-5" /></Button></Link>
            <a href="tel:+12403875224"><Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10 rounded-none px-12 text-base"><Phone className="mr-2 w-4 h-4" /> (240) 387-5224</Button></a>
          </div>
        </div>
      </section>
    </div>
  );
}