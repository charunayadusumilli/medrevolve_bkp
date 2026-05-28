import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Shield, CheckCircle } from 'lucide-react';

const SERVICES = [
  {
    icon: '⚖️',
    title: 'Weight Management Program',
    desc: 'A physician-supervised weight management program built around your health history, goals, and clinical needs. Your licensed provider will evaluate your case and design a personalized protocol — no guesswork, no generic plans.',
    bullets: ['Physician consultation included', 'Personalized treatment protocol', 'Ongoing provider check-ins', 'Rx delivered to your door'],
    color: '#2D6A9F',
  },
  {
    icon: '🧬',
    title: 'Hormone Optimization Program',
    desc: 'Comprehensive hormone evaluation and physician-directed therapy for men and women experiencing hormonal imbalances. Includes labs, provider review, and a customized care plan.',
    bullets: ['Hormone panel review', 'Physician-directed therapy', 'Available for men & women', 'BHRT & TRT protocols available'],
    color: '#7B5EA7',
  },
  {
    icon: '🌿',
    title: 'Longevity & Cellular Health',
    desc: 'Functional medicine approaches to support energy, cognitive performance, and healthy aging. Your physician will assess your biomarkers and build a science-backed longevity protocol.',
    bullets: ['Biomarker & lab assessment', 'Personalized longevity plan', 'Peptide & wellness protocols', 'Ongoing optimization visits'],
    color: '#4A6741',
  },
  {
    icon: '⚡',
    title: "Men's Health Program",
    desc: 'Confidential, physician-supervised care for men looking to optimize energy, performance, libido, and overall vitality. Your provider reviews your full health picture before recommending any treatment.',
    bullets: ['Private & confidential', 'Testosterone & performance focus', 'Sexual health support', 'Board-certified physicians'],
    color: '#4338CA',
  },
  {
    icon: '🌸',
    title: "Women's Health Program",
    desc: 'Specialized hormonal and wellness support designed for every stage of a woman\'s life. From perimenopause to postmenopause, your physician creates a care plan tailored to you.',
    bullets: ['Menopause & perimenopause support', 'BHRT & hormone balancing', "Women's sexual health", 'Tailored care by life stage'],
    color: '#A21CAF',
  },
  {
    icon: '✨',
    title: 'Hair & Skin Restoration',
    desc: 'Physician-directed programs to address hair loss and skin health concerns. Your licensed provider evaluates your specific situation and creates a clinically appropriate restoration plan.',
    bullets: ['Physician evaluation required', 'Hair restoration protocols', 'Skin health optimization', 'Oral & topical options available'],
    color: '#B85C38',
  },
];

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, delay },
});

export default function Services() {
  return (
    <div className="bg-white">

      {/* Hero */}
      <section className="bg-[#1F2D27] text-white py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-green-400 border border-green-400/30 rounded-full px-4 py-1.5 mb-6">
              Our Services
            </span>
            <h1 className="text-4xl md:text-5xl font-black mb-4 leading-tight">
              Physician-Supervised<br />
              <span className="text-white/35">Wellness Programs</span>
            </h1>
            <p className="text-white/50 text-lg max-w-xl mx-auto mb-8">
              Every program starts with a licensed physician consultation. No drug names. No specific treatments advertised. Your doctor determines what's right for you.
            </p>
            <Link to="/CustomerIntake">
              <Button className="rounded-sm px-8 font-bold text-white h-auto py-3"
                style={{ backgroundColor: '#A66B3C' }}>
                Start Your Free Intake <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Compliance notice */}
      <div className="bg-amber-50 border-b border-amber-100 py-3 px-6 text-center">
        <p className="text-xs text-amber-700 max-w-3xl mx-auto">
          <Shield className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5" />
          All treatments require a physician consultation and valid prescription. MedRevolve connects patients with independently licensed healthcare providers. This is not a pharmacy or direct seller of medications.
        </p>
      </div>

      {/* Services grid */}
      <section className="py-20 px-6" style={{ backgroundColor: '#F7F4ED' }}>
        <div className="max-w-5xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.map((svc, i) => (
              <motion.div key={svc.title} {...fade(i * 0.07)}
                className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-lg hover:border-gray-200 transition-all flex flex-col">
                <div className="text-3xl mb-4">{svc.icon}</div>
                <div className="w-1 h-5 rounded-full mb-3 flex-shrink-0" style={{ backgroundColor: svc.color }} />
                <h3 className="font-black text-gray-900 text-base mb-2">{svc.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-5 flex-1">{svc.desc}</p>
                <ul className="space-y-1.5 mb-5">
                  {svc.bullets.map(b => (
                    <li key={b} className="flex items-start gap-2 text-xs text-gray-600">
                      <CheckCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: svc.color }} />
                      {b}
                    </li>
                  ))}
                </ul>
                <Link to="/CustomerIntake">
                  <Button size="sm" className="w-full rounded-sm text-white text-xs font-bold"
                    style={{ backgroundColor: '#A66B3C' }}>
                    Start This Program <ArrowRight className="w-3 h-3 ml-1" />
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 px-6 border-t border-gray-100">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-black text-gray-900 mb-3">Not sure which program is right for you?</h2>
          <p className="text-gray-500 mb-6 text-sm">
            Complete our free intake form and a licensed physician will evaluate your health history and goals — then recommend the most appropriate care plan for you.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/CustomerIntake">
              <Button className="rounded-sm px-8 font-bold text-white" style={{ backgroundColor: '#A66B3C' }}>
                Start Free Intake
              </Button>
            </Link>
            <Link to="/Contact">
              <Button variant="outline" className="rounded-sm px-8 border-gray-300 text-gray-700">
                Talk to Our Team
              </Button>
            </Link>
          </div>
          <p className="text-xs text-gray-400 mt-5 max-w-lg mx-auto">
            MedRevolve Corporation connects patients with independently licensed healthcare providers. All treatments require a physician consultation and valid prescription. © 2026 MedRevolve Corporation.
          </p>
        </div>
      </section>

    </div>
  );
}