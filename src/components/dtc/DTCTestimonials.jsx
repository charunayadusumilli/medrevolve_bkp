import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const TESTIMONIALS = [
  { name: 'Sarah M.', location: 'Austin, TX', program: 'GLP-1 Weight Loss', text: 'Lost 32 pounds in 4 months. The provider was amazing — she actually listened to me and adjusted my plan when I hit a plateau. The medication arrives right on time every month.', rating: 5, avatar: 'S' },
  { name: 'James K.', location: 'Denver, CO', program: 'TRT / Men\'s Health', text: 'I was skeptical about telehealth for TRT, but the process was incredibly smooth. Lab test, consultation, and my prescription was at my door in a week. Energy is through the roof.', rating: 5, avatar: 'J' },
  { name: 'Michael R.', location: 'Miami, FL', program: 'Peptides / Longevity', text: 'The peptide program has been a game-changer for my recovery. I\'m 45 and feel better than I did at 30. The clinician-guided approach gave me confidence it was safe.', rating: 5, avatar: 'M' },
  { name: 'Emily L.', location: 'Seattle, WA', program: 'BHRT / Women\'s Health', text: 'After years of feeling off, my provider actually took the time to understand my symptoms. The BHRT program changed everything. No more brain fog or night sweats.', rating: 5, avatar: 'E' },
  { name: 'David T.', location: 'Phoenix, AZ', program: 'GLP-1 Weight Loss', text: 'Down 45 pounds and counting. What I love is that it\'s not just a pill — there\'s real medical supervision. My provider checks in every month and we adjust as needed.', rating: 5, avatar: 'D' },
  { name: 'Lisa P.', location: 'Atlanta, GA', program: 'Hair Health', text: 'My hair was thinning for years. The online consultation was easy, and the prescription arrived in days. Six months later, my hairline is visibly fuller.', rating: 5, avatar: 'L' },
];

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, delay },
});

export default function DTCTestimonials() {
  return (
    <section className="py-16 lg:py-24 px-5 lg:px-12 bg-[#F8FAF9]">
      <div className="max-w-6xl mx-auto">
        <motion.div {...fade(0)} className="text-center mb-12">
          <span className="inline-block text-xs font-black uppercase tracking-widest text-[#0B8B7A] border border-[#0B8B7A]/20 rounded-full px-4 py-1.5 mb-4">
            Real Results
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-[#0A0A0A] mb-3" style={{ letterSpacing: '-0.03em' }}>
            People who feel<br />
            <span className="text-[#0B8B7A]">their best again.</span>
          </h2>
          <div className="flex items-center justify-center gap-2 mt-4">
            <div className="flex">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />)}
            </div>
            <span className="text-sm font-bold text-gray-700">4.9/5</span>
            <span className="text-sm text-gray-400">· 2,400+ reviews</span>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t, i) => (
            <motion.div key={i} {...fade(i * 0.06)}
              className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex gap-1 mb-3">
                {[...Array(t.rating)].map((_, j) => <Star key={j} className="w-4 h-4 text-yellow-400 fill-yellow-400" />)}
              </div>
              <p className="text-sm text-gray-700 leading-relaxed mb-4">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#0B8B7A]/10 flex items-center justify-center text-[#0B8B7A] font-black text-sm">
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm font-bold text-[#0A0A0A]">{t.name}</p>
                  <p className="text-xs text-gray-400">{t.location} · {t.program}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}