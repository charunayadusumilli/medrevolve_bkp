import React from 'react';
import SEOHead from '@/components/SEOHead';
import FAQSection from '@/components/home/FAQSection';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Phone, Layers, CreditCard, Users, Headset, Rocket } from 'lucide-react';

const FAQS = [
  { question: 'How fast can I launch?', answer: 'Days to weeks — the backend is already built and licensed.' },
  { question: 'What do I give up by not building custom?', answer: 'Nothing you\'d miss: you keep brand, pricing, and relationships; you skip the $30-50K build and the vendor management.' },
];

const DAY_ONE = [
  { icon: Layers, title: 'White-label services', desc: 'Intake, physicians in all 50 states, pharmacy fulfillment, EMR, and compliance monitoring.' },
  { icon: CreditCard, title: 'Payment processing', desc: 'High-risk payment processing for telehealth, built in from day one.' },
  { icon: Users, title: 'Unified CRM', desc: 'A unified CRM running your entire customer base.' },
  { icon: Headset, title: 'Support to resolution', desc: '24/7, every issue tracked until fixed, so solo doesn\'t mean alone.' },
];

export default function ForEntrepreneurs() {
  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      <SEOHead
        title="For Entrepreneurs: A Self-Run Telehealth Platform, Not a Franchise | MedRevolve"
        description="Entrepreneurs: launch a telehealth brand you actually own and operate. Services, payments, and unified CRM on one self-run platform. 24/7 support to resolution."
      />

      <section className="bg-[#060606] pt-20 pb-24 px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-widest text-[#A8C99B] mb-4">For Entrepreneurs</p>
          <h1 className="text-4xl md:text-5xl font-light text-white mb-5 leading-tight">
            A self-run telehealth platform,<br /><span className="font-semibold text-[#A8C99B]">not a franchise</span>
          </h1>
          <p className="text-xl text-white/45 max-w-2xl mx-auto mb-10">
            Building a telehealth company the traditional way means $30K-$50K and 6-12 months of stitching vendors together before your first customer. MedRevolve replaces the build with a platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/ForBusiness"><Button size="lg" className="bg-white text-black hover:bg-white/90 rounded-none px-10 font-bold text-base">Apply for White-Label <ArrowRight className="ml-2 w-5 h-5" /></Button></Link>
            <a href="tel:+12403875224"><Button size="lg" variant="ghost" className="text-white border border-white/20 hover:bg-white/10 rounded-none px-10 text-base"><Phone className="mr-2 w-4 h-4" /> (240) 387-5224</Button></a>
          </div>
        </div>
      </section>

      <section className="py-24 px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-12">
            <Rocket className="w-8 h-8 text-[#4A6741]" />
            <h2 className="text-3xl md:text-4xl font-light text-[#2D3A2D]">What you get on day one</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {DAY_ONE.map(d => {
              const Icon = d.icon;
              return (
                <div key={d.title} className="bg-white rounded-2xl border border-[#E8E0D5] p-7 shadow-sm">
                  <div className="w-12 h-12 rounded-xl bg-[#D4E5D7] flex items-center justify-center mb-4"><Icon className="w-6 h-6 text-[#4A6741]" /></div>
                  <h3 className="text-lg font-semibold text-[#2D3A2D] mb-2">{d.title}</h3>
                  <p className="text-[#5A6B5A] text-sm leading-relaxed">{d.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 lg:px-8 bg-[#F5F0E8]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-light text-[#2D3A2D] mb-4">Self-run, not managed for you</h2>
          <p className="text-[#5A6B5A] text-lg leading-relaxed">You keep the brand, the pricing, the customer relationships, and the operational control. The platform is built for a founder to run solo.</p>
        </div>
      </section>

      <section className="py-20 px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-light text-[#2D3A2D] mb-4">Support to resolution</h2>
          <p className="text-[#5A6B5A] text-lg leading-relaxed">24/7, every issue tracked until fixed, so solo doesn't mean alone.</p>
        </div>
      </section>

      <section className="py-20 px-6 lg:px-8 bg-[#F5F0E8]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-light text-[#2D3A2D] mb-4">Pricing</h2>
          <p className="text-[#5A6B5A] text-lg leading-relaxed"><span className="font-semibold text-[#2D3A2D]">$4,000 setup + $250/mo</span> Full Platform Bundle; modules individually.</p>
        </div>
      </section>

      <FAQSection tag="FAQ" title="For Entrepreneurs FAQ" faqs={FAQS} />

      <section className="py-20 px-6 lg:px-8 bg-gradient-to-br from-[#4A6741] via-[#3D5636] to-[#2D3A2D]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-light text-white mb-4">medrevolve.com/ForBusiness · (240) 387-5224</h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Link to="/ForBusiness"><Button size="lg" className="bg-white text-[#2D3A2D] hover:bg-white/90 rounded-none px-12 font-bold text-base">Apply Now <ArrowRight className="ml-2 w-5 h-5" /></Button></Link>
            <a href="tel:+12403875224"><Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10 rounded-none px-12 text-base"><Phone className="mr-2 w-4 h-4" /> (240) 387-5224</Button></a>
          </div>
        </div>
      </section>
    </div>
  );
}