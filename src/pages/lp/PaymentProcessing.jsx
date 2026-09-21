import React from 'react';
import SEOHead from '@/components/SEOHead';
import FAQSection from '@/components/home/FAQSection';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Phone, CreditCard, ShieldCheck, BarChart3, Zap } from 'lucide-react';

const FAQS = [
  { question: 'Why do mainstream processors shut down telehealth accounts?', answer: 'Telehealth is classified high-risk by mainstream processors; MedRevolve uses processing built for the category so your revenue doesn\'t depend on a provider that will exit.' },
  { question: 'Is the payment system integrated with the CRM?', answer: 'Yes — checkout, subscriptions, and payment history live in the same unified CRM as your leads and patients.' },
];

const FEATURES = [
  { icon: ShieldCheck, title: 'Built for high-risk telehealth', desc: 'High-risk merchant processing designed for telehealth categories — not a mainstream processor that will exit.' },
  { icon: CreditCard, title: 'Integrated checkout & subscriptions', desc: 'Checkout and subscriptions built in from day one, no separate processor relationship to lose.' },
  { icon: BarChart3, title: 'Revenue tracked per service', desc: 'Payments data flows into the same unified CRM where you run the business.' },
  { icon: Zap, title: 'No integrations to break', desc: 'Built-in beats bolt-on — no separate processor, no integrations to break, no revenue at risk.' },
];

export default function PaymentProcessing() {
  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      <SEOHead
        title="Telehealth Payment Processing That Won't Shut You Down | MedRevolve"
        description="High-risk payment processing built into the MedRevolve platform — built for telehealth so mainstream processor shutdowns don't kill your brand."
      />

      <section className="bg-[#060606] pt-20 pb-24 px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-widest text-[#A8C99B] mb-4">Payment Processing</p>
          <h1 className="text-4xl md:text-5xl font-light text-white mb-5 leading-tight">
            Payment processing that<br /><span className="font-semibold text-[#A8C99B]">won't shut you down</span>
          </h1>
          <p className="text-xl text-white/45 max-w-2xl mx-auto mb-10">
            The fastest way to kill a telehealth brand is a payment processor shutdown — mainstream processors routinely terminate telehealth accounts after launch. MedRevolve builds payment processing in from day one.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/ForBusiness"><Button size="lg" className="bg-white text-black hover:bg-white/90 rounded-none px-10 font-bold text-base">Apply for White-Label <ArrowRight className="ml-2 w-5 h-5" /></Button></Link>
            <a href="tel:+12403875224"><Button size="lg" variant="ghost" className="text-white border border-white/20 hover:bg-white/10 rounded-none px-10 text-base"><Phone className="mr-2 w-4 h-4" /> (240) 387-5224</Button></a>
          </div>
        </div>
      </section>

      <section className="py-24 px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-light text-[#2D3A2D] mb-12 text-center">What's included</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {FEATURES.map(f => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="bg-white rounded-2xl border border-[#E8E0D5] p-7 shadow-sm">
                  <div className="w-12 h-12 rounded-xl bg-[#D4E5D7] flex items-center justify-center mb-4"><Icon className="w-6 h-6 text-[#4A6741]" /></div>
                  <h3 className="text-lg font-semibold text-[#2D3A2D] mb-2">{f.title}</h3>
                  <p className="text-[#5A6B5A] text-sm leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 lg:px-8 bg-[#F5F0E8]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-light text-[#2D3A2D] mb-4">Why built-in beats bolt-on</h2>
          <p className="text-[#5A6B5A] text-lg leading-relaxed">No separate processor relationship to lose, no integrations to break, and payments data flows into the same CRM where you run the business.</p>
        </div>
      </section>

      <section className="py-20 px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-light text-[#2D3A2D] mb-4">The self-run advantage</h2>
          <p className="text-[#5A6B5A] text-lg leading-relaxed">You see revenue, failed payments, and subscriptions in one dashboard and get 24/7 support to resolution when anything breaks.</p>
        </div>
      </section>

      <FAQSection tag="FAQ" title="Payment Processing FAQ" faqs={FAQS} />

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