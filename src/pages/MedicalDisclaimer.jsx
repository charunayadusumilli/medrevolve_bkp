import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function MedicalDisclaimer() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] py-12 px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-6">
            <AlertTriangle className="w-8 h-8 text-amber-500" />
            <h1 className="text-4xl font-light text-[#2D3A2D]">Medical Disclaimer</h1>
          </div>
          <p className="text-[#5A6B5A] mb-8">Last Updated: May 2026</p>

          <div className="bg-red-50 border border-red-200 rounded-xl p-5 mb-8">
            <p className="text-red-800 font-semibold text-sm">IMPORTANT: If you are experiencing a medical emergency, call 911 or go to your nearest emergency room immediately. Do not use this website to seek emergency medical advice.</p>
          </div>

          <div className="prose prose-slate max-w-none space-y-8">

            <section>
              <h2 className="text-2xl font-light text-[#2D3A2D] mb-3">Not Medical Advice</h2>
              <p className="text-[#5A6B5A] leading-relaxed">
                The content on MedRevolve.com — including text, graphics, images, blog posts, case studies, testimonials, educational materials, and any other materials — is provided for <strong>general informational and educational purposes only</strong>. It does not constitute medical advice, diagnosis, treatment recommendation, or a substitute for professional medical consultation from a qualified, licensed healthcare provider who has examined you and has knowledge of your medical history.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-light text-[#2D3A2D] mb-3">No Doctor-Patient Relationship</h2>
              <p className="text-[#5A6B5A] leading-relaxed">
                Accessing information on this website, submitting a contact form, or engaging with our AI assistant does NOT create a doctor-patient relationship. A licensed provider-patient relationship is only established when a licensed healthcare provider on our platform formally accepts your case following a completed clinical intake process and telehealth consultation.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-light text-[#2D3A2D] mb-3">Individual Results Vary</h2>
              <p className="text-[#5A6B5A] leading-relaxed">
                Any testimonials, results, or success stories featured on this website represent individual experiences and are not intended to guarantee, promise, or imply that others will achieve identical or similar results. Medical treatments including GLP-1 therapies, hormone optimization, and peptide protocols produce variable results depending on individual factors including genetics, lifestyle, adherence to treatment, and underlying health conditions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-light text-[#2D3A2D] mb-3">Medication and Treatment Information</h2>
              <p className="text-[#5A6B5A] leading-relaxed">
                Information about medications, dosages, and treatment protocols on this site is for educational purposes only. Prescription medications including GLP-1 agonists (semaglutide, tirzepatide), testosterone, and compounded treatments require a valid prescription from a licensed prescriber who has conducted a clinical evaluation. Self-medicating based on website content is dangerous and illegal. Never start, stop, or change any medication regimen without consulting a qualified healthcare provider.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-light text-[#2D3A2D] mb-3">Research Use Only (RUO) Products</h2>
              <p className="text-[#5A6B5A] leading-relaxed">
                Any references to research compounds or peptides on this site (including BPC-157, TB-500, CJC-1295, etc.) are strictly for educational and informational purposes related to the scientific research community. These products are NOT sold on MedRevolve.com and are NOT intended for human or veterinary use. MedRevolve maintains strict separation between consumer/Rx product content and RUO product content in compliance with FDA guidance and LegitScript requirements.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-light text-[#2D3A2D] mb-3">Third-Party Links and Information</h2>
              <p className="text-[#5A6B5A] leading-relaxed">
                This website may contain links to third-party websites, research studies, or external resources. MedRevolve does not endorse, guarantee, or assume responsibility for the accuracy of information on third-party sites. These links are provided for convenience only.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-light text-[#2D3A2D] mb-3">When to Seek Immediate Care</h2>
              <p className="text-[#5A6B5A] leading-relaxed mb-3">Seek immediate emergency medical care if you experience any of the following:</p>
              <ul className="list-disc pl-6 text-[#5A6B5A] space-y-1">
                <li>Chest pain, shortness of breath, or difficulty breathing</li>
                <li>Severe allergic reaction (anaphylaxis)</li>
                <li>Signs of stroke (FAST: Face drooping, Arm weakness, Speech difficulty, Time to call 911)</li>
                <li>Severe abdominal pain, including pancreatitis symptoms</li>
                <li>Suicidal or self-harm ideation</li>
                <li>Severe adverse reactions to any medication</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-light text-[#2D3A2D] mb-3">Questions</h2>
              <p className="text-[#5A6B5A]">
                For medical questions or to book a consultation with a licensed provider, visit our{' '}
                <Link to={createPageUrl('BookAppointment')} className="text-[#4A6741] underline">booking page</Link> or contact{' '}
                <a href="mailto:support@medrevolve.com" className="text-[#4A6741] underline">support@medrevolve.com</a>.
              </p>
            </section>

          </div>
        </motion.div>
      </div>
    </div>
  );
}