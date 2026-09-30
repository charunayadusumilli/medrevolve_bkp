import React from 'react';
import { motion } from 'framer-motion';
import EditorialImage from './EditorialImage';

const WHO = [
  { title: 'Med Spa & Clinic Owners', desc: 'Add physician-supervised wellness programs without building a telehealth team.', img: 'https://images.unsplash.com/photo-1571019613454-1cb2d99b8a3c?w=600&q=80' },
  { title: 'Gym & Fitness Operators', desc: 'Offer members a physician-supervised wellness track, fully white-labeled.', img: 'https://images.unsplash.com/photo-1534438327275-e1773db1c8dc?w=600&q=80' },
  { title: 'Entrepreneurs & Startups', desc: 'Launch from zero. We handle everything technical, legal, and operational.', img: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=600&q=80' },
  { title: 'Wellness Centers', desc: 'Expand your menu with programs that generate recurring subscription revenue.', img: 'https://images.unsplash.com/photo-1545205597-3d9d02c29297?w=600&q=80' },
  { title: 'Digital Health Founders', desc: 'Skip the 2-year build. Get a compliant platform under your brand in 7 days.', img: 'https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=600&q=80' },
  { title: 'Healthcare Professionals', desc: 'Monetize your expertise with your own brand and our business infrastructure.', img: 'https://images.unsplash.com/photo-155983973-d018a6d3a8f0?w=600&q=80' },
];

export default function EditorialWhoFor() {
  return (
    <section className="bg-[#F9F7F2] py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <span className="text-[11px] font-black uppercase tracking-[0.2em] text-stone-500">Who this is for</span>
          <h2 className="font-display text-4xl md:text-5xl text-[#1A1A1A] mt-3" style={{ letterSpacing: '-0.02em' }}>
            Built for operators who move fast.
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {WHO.map((w, i) => (
            <motion.div key={w.title}
              initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="group">
              <div className="aspect-[4/3] rounded-xl overflow-hidden mb-4">
                <EditorialImage src={w.img} alt={w.title} className="w-full h-full"
                  imgClass="group-hover:scale-105 transition-transform duration-500" />
              </div>
              <h3 className="font-semibold text-[#1A1A1A] text-base mb-1">{w.title}</h3>
              <p className="text-stone-500 text-sm leading-relaxed">{w.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}