import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const FAQS = [
  { q: 'Is this LegiScript certified?', a: 'Yes. MedRevolve operates through a LegiScript-certified process, ensuring all advertising and patient acquisition meets healthcare advertising compliance standards. We never advertise specific drug names or make unsubstantiated claims.' },
  { q: 'Are the providers actually licensed?', a: 'Every provider in our network is a US-licensed, board-certified physician or nurse practitioner with prescriptive authority in your state. You\'ll meet with a real provider via video or phone — never a chatbot.' },
  { q: 'How does the medication get delivered?', a: 'Your prescription is filled by an NABP-verified, FDA-compliant 503A pharmacy and shipped directly to your door in discreet, temperature-controlled packaging. Most orders arrive within 3-5 business days.' },
  { q: 'Do I need insurance?', a: 'No. All of our programs are cash-pay with transparent monthly pricing. No insurance, no copays, no surprises. You see the price upfront before you start.' },
  { q: 'What if I\'m not approved for treatment?', a: 'If your provider determines that treatment isn\'t appropriate for you, you\'ll only be charged for the consultation. We never charge for medication that isn\'t prescribed.' },
  { q: 'Can I cancel anytime?', a: 'Yes. All monthly subscriptions can be cancelled anytime — no long-term contracts, no cancellation fees. You\'re in control of your health journey.' },
  { q: 'Is my health information secure?', a: 'Absolutely. Our platform is HIPAA-compliant. Your health data is encrypted, never shared with third parties, and only accessible to your assigned provider and care team.' },
  { q: 'Which states do you serve?', a: 'We operate in all 50 US states. Our provider network includes physicians licensed in every state, so you can access care wherever you are.' },
];

export default function DTCFAQ() {
  const [open, setOpen] = useState(0);

  return (
    <section className="py-16 lg:py-24 px-5 lg:px-12 bg-white">
      <div className="max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
          className="text-center mb-10">
          <span className="inline-block text-xs font-black uppercase tracking-widest text-[#0B8B7A] border border-[#0B8B7A]/20 rounded-full px-4 py-1.5 mb-4">
            Questions & Answers
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-[#0A0A0A] mb-3" style={{ letterSpacing: '-0.03em' }}>
            Everything you need<br />
            <span className="text-[#0B8B7A]">to know.</span>
          </h2>
        </motion.div>

        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <div key={i} className="border border-gray-100 rounded-xl overflow-hidden bg-white hover:border-gray-200 transition-colors">
              <button onClick={() => setOpen(open === i ? -1 : i)}
                className="w-full flex items-center justify-between p-5 text-left">
                <span className="text-sm md:text-base font-bold text-[#0A0A0A]">{faq.q}</span>
                <ChevronDown className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform ${open === i ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {open === i && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }} className="overflow-hidden">
                    <p className="px-5 pb-5 text-sm text-gray-600 leading-relaxed">{faq.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}