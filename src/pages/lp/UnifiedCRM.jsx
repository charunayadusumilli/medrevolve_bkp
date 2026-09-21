import React from 'react';
import SEOHead from '@/components/SEOHead';
import FAQSection from '@/components/home/FAQSection';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Phone, Users, MessageCircle, GitBranch, BarChart3 } from 'lucide-react';

const FAQS = [
  { question: 'Does the CRM include WhatsApp?', answer: 'Yes — WhatsApp conversations are a first-class channel alongside site chat, forms, and phone.' },
  { question: 'Can I run it myself without a team?', answer: 'Yes — pipelines and automations are built for solo operators, with 24/7 support to resolution.' },
];

const UNIFIED = [
  { icon: Users, title: 'Every lead in one pipeline', desc: 'Site chat, phone, WhatsApp, and forms — every captured lead lands in one pipeline.' },
  { icon: BarChart3, title: 'One patient profile', desc: 'Patient records, intake status, conversations, and payment history are a single profile.' },
  { icon: GitBranch, title: 'Automated follow-up', desc: 'Automations move leads through follow-up without manual chasing.' },
  { icon: MessageCircle, title: 'WhatsApp first-class', desc: 'WhatsApp conversations live alongside every other channel in the same CRM.' },
];

export default function UnifiedCRM() {
  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      <SEOHead
        title="Unified CRM for Telehealth: Leads, Patients & Payments in One Place | MedRevolve"
        description="Every lead, patient, WhatsApp conversation, pipeline, and automation in one unified CRM — built into the MedRevolve telehealth platform."
      />

      <section className="bg-[#060606] pt-20 pb-24 px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-widest text-[#A8C99B] mb-4">Unified CRM</p>
          <h1 className="text-4xl md:text-5xl font-light text-white mb-5 leading-tight">
            Five tools, collapsed<br /><span className="font-semibold text-[#A8C99B]">into one CRM</span>
          </h1>
          <p className="text-xl text-white/45 max-w-2xl mx-auto mb-10">
            Most telehealth operators run their business across five disconnected tools: a form builder, a spreadsheet, a WhatsApp inbox, a payment processor, and an EMR. MedRevolve collapses all of it into one unified CRM.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/ForBusiness"><Button size="lg" className="bg-white text-black hover:bg-white/90 rounded-none px-10 font-bold text-base">Apply for White-Label <ArrowRight className="ml-2 w-5 h-5" /></Button></Link>
            <a href="tel:+12403875224"><Button size="lg" variant="ghost" className="text-white border border-white/20 hover:bg-white/10 rounded-none px-10 text-base"><Phone className="mr-2 w-4 h-4" /> (240) 387-5224</Button></a>
          </div>
        </div>
      </section>

      <section className="py-24 px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-light text-[#2D3A2D] mb-12 text-center">What's unified</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {UNIFIED.map(u => {
              const Icon = u.icon;
              return (
                <div key={u.title} className="bg-white rounded-2xl border border-[#E8E0D5] p-7 shadow-sm">
                  <div className="w-12 h-12 rounded-xl bg-[#D4E5D7] flex items-center justify-center mb-4"><Icon className="w-6 h-6 text-[#4A6741]" /></div>
                  <h3 className="text-lg font-semibold text-[#2D3A2D] mb-2">{u.title}</h3>
                  <p className="text-[#5A6B5A] text-sm leading-relaxed">{u.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 lg:px-8 bg-[#F5F0E8]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-light text-[#2D3A2D] mb-4">Why it matters</h2>
          <p className="text-[#5A6B5A] text-lg leading-relaxed">Nothing leaks. You see exactly who is ready to pay. One dashboard replaces five tabs.</p>
        </div>
      </section>

      <section className="py-20 px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-light text-[#2D3A2D] mb-4">Self-run + supported</h2>
          <p className="text-[#5A6B5A] text-lg leading-relaxed">The CRM is designed for a solo founder to operate, with 24/7 support to resolution when anything needs attention.</p>
        </div>
      </section>

      <FAQSection tag="FAQ" title="Unified CRM FAQ" faqs={FAQS} />

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