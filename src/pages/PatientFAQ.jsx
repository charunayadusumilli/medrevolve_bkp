import React from 'react';
import SEOHead from '@/components/SEOHead';
import FAQSection from '@/components/home/FAQSection';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Phone, ArrowRight } from 'lucide-react';

const PATIENT_FAQS = [
  { question: 'What is peptide therapy?', answer: 'Peptides are short chains of amino acids that signal your body to repair tissue, reduce inflammation, and support recovery. Clinician-guided peptide therapy uses these signals as part of a broader wellness protocol — not a replacement for healthy habits or a quick fix.' },
  { question: 'Are peptides safe?', answer: 'Safety depends on sourcing, dosing, and medical supervision. MedRevolve sources exclusively from licensed 503A/503B compounding pharmacies with certificates of analysis on every batch, and every protocol is reviewed by a licensed clinician.' },
  { question: 'Do I need a prescription for peptides?', answer: 'Yes. Any legitimate peptide therapy program requires evaluation and prescription by a licensed clinician. MedRevolve\'s intake includes clinician review before anything is prescribed.' },
  { question: 'How do I know if I qualify for peptide therapy?', answer: 'Complete the online intake. A licensed clinician reviews your history, labs where needed, and goals. If you are not a candidate, you are told honestly.' },
  { question: 'Is peptide therapy legal?', answer: 'Peptide therapy prescribed by a licensed clinician and dispensed by a licensed compounding pharmacy is legal under the applicable regulatory framework. MedRevolve tracks FDA, PCAC, and Federal Register activity in real time and adjusts its catalog to stay compliant.' },
  { question: 'What should I avoid when buying peptides online?', answer: 'Avoid sellers without pharmacy licensure, no COAs, no clinician involvement, or anyone who skips a medical history. Legitimate programs always have a licensed clinician, a licensed pharmacy, and batch testing.' },
  { question: 'What is compounded semaglutide (GLP-1)?', answer: 'The same active ingredient as brand-name GLP-1 medications, prepared by a licensed compounding pharmacy at strengths prescribed by your clinician. Availability depends on current FDA shortage status — MedRevolve monitors this continuously.' },
  { question: 'Do I qualify for GLP-1 therapy?', answer: 'Qualification is based on clinical criteria reviewed by a licensed clinician — start the intake and the clinician review answers it.' },
  { question: 'How much does GLP-1 therapy cost?', answer: 'Pricing depends on protocol and is presented transparently at checkout before you pay.' },
  { question: 'What is TRT/HRT (hormone therapy)?', answer: 'Testosterone and hormone replacement therapy restore hormones to optimal ranges when clinical labs show deficiency. It starts with labs, then clinician review, then an individualized protocol.' },
  { question: 'How do I know if my hormones are off?', answer: 'Symptoms suggest it, but only labs confirm it. MedRevolve orders and reviews labs before any protocol.' },
  { question: 'What is NAD+ therapy?', answer: 'NAD+ is a coenzyme involved in cellular energy and repair. Clinician-guided NAD+ therapy supports cellular health and healthy aging as part of a longevity protocol — pharmacy-sourced, clinician-supervised.' },
  { question: 'Are these treatments a replacement for my doctor?', answer: 'No. MedRevolve programs are clinician-guided and complement your existing healthcare. Always inform your primary physician of any protocols you begin.' },
  { question: 'Do you accept insurance?', answer: 'MedRevolve programs are cash-pay and transparent. Pricing is presented at checkout before you pay, with no hidden fees.' },
  { question: 'How do I start?', answer: 'Complete the online intake. A licensed clinician reviews your case and, if you qualify, your protocol is prepared by a licensed compounding pharmacy. Call (240) 387-5224 with any questions.' },
];

export default function PatientFAQ() {
  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      <SEOHead
        title="Patient FAQ | Peptide Therapy, GLP-1, Hormones, NAD+ | MedRevolve"
        description="Answers to common questions about peptide therapy, GLP-1, hormone optimization, and NAD+ at MedRevolve. Clinician-guided, pharmacy-sourced, compliant."
      />

      {/* Hero */}
      <section className="bg-[#060606] pt-20 pb-20 px-6 lg:px-8 text-center">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-widest text-[#A8C99B] mb-4">Patient Resource Center</p>
          <h1 className="text-4xl md:text-5xl font-light text-white mb-5">
            Your Questions, <span className="font-semibold text-[#A8C99B]">Answered</span>
          </h1>
          <p className="text-xl text-white/45 max-w-2xl mx-auto mb-8">
            Everything you need to know about peptide therapy, GLP-1, hormones, and NAD+ — before you start your intake.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/CustomerIntake">
              <Button size="lg" className="bg-white text-black hover:bg-white/90 rounded-none px-10 font-bold text-base">
                Start Your Intake <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <a href="tel:+12403875224">
              <Button size="lg" variant="ghost" className="text-white border border-white/20 hover:bg-white/10 rounded-none px-10 text-base">
                <Phone className="mr-2 w-4 h-4" /> (240) 387-5224
              </Button>
            </a>
          </div>
        </div>
      </section>

      <FAQSection
        tag="Frequently Asked Questions"
        title="Patient FAQ"
        subtitle="Clinician-guided, pharmacy-sourced, fully compliant — here are the answers to the questions we hear most."
        faqs={PATIENT_FAQS}
      />

      {/* CTA */}
      <section className="py-20 px-6 lg:px-8 bg-gradient-to-br from-[#4A6741] via-[#3D5636] to-[#2D3A2D]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-light text-white mb-4">Ready to take the next step?</h2>
          <p className="text-white/55 text-lg mb-8">Start your intake — a licensed clinician will review your case.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/CustomerIntake">
              <Button size="lg" className="bg-white text-[#2D3A2D] hover:bg-white/90 rounded-none px-12 font-bold text-base shadow-xl">
                Start Your Intake <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <a href="tel:+12403875224">
              <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10 rounded-none px-12 text-base">
                <Phone className="mr-2 w-4 h-4" /> Call (240) 387-5224
              </Button>
            </a>
          </div>
          <p className="text-white/30 text-xs mt-6">MedRevolve does not provide medical advice via this page. All clinical decisions are made by licensed clinicians after intake review.</p>
        </div>
      </section>
    </div>
  );
}