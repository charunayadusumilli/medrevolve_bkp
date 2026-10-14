import React from 'react';
import SEOHead from '@/components/SEOHead';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen } from 'lucide-react';

const POSTS = [
  {
    title: 'How to Start a TRT Clinic: The Compliance & Infrastructure Guide',
    excerpt: 'What it takes to launch a men\'s health clinic — entity setup, clinician coverage, pharmacy fulfillment, and the operating stack behind it.',
    category: 'Launch',
    href: '/trt-clinic-platform',
  },
  {
    title: 'Starting a Medical Weight Loss Clinic Without Hiring a Doctor',
    excerpt: 'How operators add physician-supervised service lines using a licensed clinician network instead of building a provider team.',
    category: 'Launch',
    href: '/weight-loss-clinic-platform',
  },
  {
    title: 'Adding a New Service Line to an Existing Med Spa',
    excerpt: 'How established clinics add service lines on top of their current footprint without new infrastructure or new hires.',
    category: 'Growth',
    href: '/for-med-spas',
  },
  {
    title: 'Choosing a Telehealth Infrastructure Partner: What to Evaluate',
    excerpt: 'A practical checklist for comparing white-label platforms — clinician coverage, payments, pharmacy, CRM, and compliance.',
    category: 'Operations',
    href: '/white-label-telehealth-platform',
  },
  {
    title: 'Payment Processing for Telehealth: What High-Risk Really Means',
    excerpt: 'Why healthcare categories fall outside mainstream processors, and how high-risk merchant accounts and automated retries work.',
    category: 'Payments',
    href: '/payment-processing',
  },
  {
    title: 'Unified CRM for Telehealth Operators',
    excerpt: 'Consolidating leads, patients, and follow-ups into one automated pipeline instead of five disconnected tools.',
    category: 'Operations',
    href: '/unified-crm',
  },
];

export default function Blog() {
  return (
    <div className="min-h-screen bg-[#F7F4ED]">
      <SEOHead
        title="Telehealth Operator Blog & Guides | MedRevolve"
        description="Guides for telehealth operators: launching a clinic, adding service lines, choosing white-label infrastructure, payment processing for high-risk healthcare, and unified CRM operations."
      />

      <section className="bg-[#1F2D27] px-6 lg:px-12 pt-16 pb-20">
        <div className="max-w-5xl mx-auto">
          <span className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.25em] text-[#A66B3C] mb-6">
            <BookOpen className="w-3.5 h-3.5" /> Insights &amp; Guides
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-white leading-[1.08] mb-5" style={{ letterSpacing: '-0.03em' }}>
            Operator guides for building<br />
            <span className="text-[#A66B3C]">telehealth infrastructure.</span>
          </h1>
          <p className="text-white/55 text-lg max-w-2xl leading-relaxed">
            Practical reads on launching, operating, and scaling a white-label telehealth business.
          </p>
        </div>
      </section>

      <section className="py-20 px-6 lg:px-12">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {POSTS.map((p, i) => (
            <motion.div key={p.title}
              initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}>
              <Link to={p.href}
                className="group flex flex-col h-full bg-white border border-[#E4DED2] p-7 hover:shadow-lg transition-all">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#A66B3C] mb-4">{p.category}</span>
                <h2 className="text-lg font-bold text-[#1F2D27] leading-snug mb-3">{p.title}</h2>
                <p className="text-[#3A453E] text-sm leading-relaxed mb-6 flex-1">{p.excerpt}</p>
                <span className="inline-flex items-center gap-2 text-[#1F2D27] text-xs font-bold uppercase tracking-widest group-hover:gap-3 transition-all">
                  Read the guide <ArrowRight className="w-3.5 h-3.5 text-[#A66B3C]" />
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="bg-[#1F2D27] py-10 px-6 lg:px-12">
        <p className="max-w-6xl mx-auto text-white/40 text-xs leading-relaxed">
          MedRevolve Corporation is a B2B infrastructure and services company. We build and operate white-label telehealth platforms for licensed business operators.
        </p>
      </section>
    </div>
  );
}