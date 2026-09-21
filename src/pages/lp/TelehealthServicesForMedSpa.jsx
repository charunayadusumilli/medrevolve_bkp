import React from 'react';
import SEOHead from '@/components/SEOHead';
import FAQSection from '@/components/home/FAQSection';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Phone, Layers, CreditCard, Users, Headset, X, CheckCircle } from 'lucide-react';

const FAQS = [
  { question: 'Can a medspa offer telehealth under its own brand?', answer: 'Yes — white-label means your brand, your clients, your pricing; MedRevolve is the backend.' },
  { question: 'What does it cost?', answer: '$4,000 setup + $250/mo for the Full Platform Bundle; modules individually.' },
];

const HARD_PARTS = [
  'Physician network',
  'Pharmacy',
  'Compliance',
  'High-risk payments',
  'Patient systems',
];

const PLATFORM_ALT = [
  { icon: Layers, title: 'White-label services', desc: 'White-label services run under your brand — intake, physicians, pharmacy, EMR, compliance.' },
  { icon: CreditCard, title: 'Payments that won\'t shut down', desc: 'Payment processing that won\'t get shut down, built for high-risk telehealth.' },
  { icon: Users, title: 'Unified CRM', desc: 'A unified CRM connecting your existing clients to new service pipelines.' },
  { icon: Headset, title: 'Self-run + supported', desc: 'Your team operates it; 24/7 support to resolution has your back.' },
];

export default function TelehealthServicesForMedSpa() {
  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      <SEOHead
        title="Add Telehealth Services to Your Med Spa — Under Your Brand | MedRevolve"
        description="Medspa owners: add white-label telehealth services without building infrastructure. Services, payments, and CRM in one platform. 24/7 support."
      />

      <section className="bg-[#060606] pt-20 pb-24 px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-widest text-[#A8C99B] mb-4">For Med Spas</p>
          <h1 className="text-4xl md:text-5xl font-light text-white mb-5 leading-tight">
            Multiply revenue per client<br /><span className="font-semibold text-[#A8C99B]">without adding chairs or rooms</span>
          </h1>
          <p className="text-xl text-white/45 max-w-2xl mx-auto mb-10">
            Your medspa already has trust and foot traffic. Adding telehealth services multiplies revenue per client without adding chairs, rooms, or staff.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/ForBusiness"><Button size="lg" className="bg-white text-black hover:bg-white/90 rounded-none px-10 font-bold text-base">Apply for White-Label <ArrowRight className="ml-2 w-5 h-5" /></Button></Link>
            <a href="tel:+12403875224"><Button size="lg" variant="ghost" className="text-white border border-white/20 hover:bg-white/10 rounded-none px-10 text-base"><Phone className="mr-2 w-4 h-4" /> (240) 387-5224</Button></a>
          </div>
        </div>
      </section>

      <section className="py-24 px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-light text-[#2D3A2D] mb-8 text-center">The five hard parts of doing it yourself</h2>
          <div className="space-y-3 mb-6">
            {HARD_PARTS.map(h => (
              <div key={h} className="flex items-center gap-3 bg-white rounded-xl border border-[#E8E0D5] px-5 py-3.5">
                <X className="w-5 h-5 text-red-400 flex-shrink-0" />
                <span className="text-[#2D3A2D] font-medium">{h}</span>
              </div>
            ))}
          </div>
          <p className="text-center text-[#5A6B5A] text-lg">$30K-$50K and 6-12 months.</p>
        </div>
      </section>

      <section className="py-24 px-6 lg:px-8 bg-[#F5F0E8]">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-light text-[#2D3A2D] mb-12 text-center">The platform alternative</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {PLATFORM_ALT.map(p => {
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

      <section className="py-20 px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-light text-[#2D3A2D] mb-4">Self-run + supported</h2>
          <p className="text-[#5A6B5A] text-lg leading-relaxed">Your team operates it; 24/7 support to resolution has your back.</p>
        </div>
      </section>

      <FAQSection tag="FAQ" title="Med Spa Telehealth FAQ" faqs={FAQS} />

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