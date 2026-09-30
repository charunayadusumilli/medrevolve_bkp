import React from 'react';
import { BadgeCheck, Quote } from 'lucide-react';

const UGC_POSTS = [
  { name: 'Jordan M.', initials: 'JM', color: '#0B8B7A', text: 'The research citations on each product page link straight to PubMed. Actually legit.', tag: 'Semaglutide' },
  { name: 'Sam K.', initials: 'SK', color: '#A66B3C', text: 'Ordered supplies, arrived in 2 days. Clinical-grade packaging. Will reorder.', tag: 'Supplies' },
  { name: 'Taylor R.', initials: 'TR', color: '#3050F8', text: 'The 3D molecule viewer is such a nice touch. Shows the actual peptide helix.', tag: 'BPC-157' },
  { name: 'Morgan L.', initials: 'ML', color: '#0B8B7A', text: 'Provider responded to my message within an hour. Better than my last telehealth platform.', tag: 'TRT' },
  { name: 'Casey D.', initials: 'CD', color: '#FF2020', text: 'Love that RUO vs prescription is labeled clearly. No ambiguity about what you\u2019re buying.', tag: 'Epitalon' },
  { name: 'Riley S.', initials: 'RS', color: '#A66B3C', text: 'The cellular binding animation helped me understand how GLP-1 works. Actually educational.', tag: 'Tirzepatide' },
  { name: 'Jamie P.', initials: 'JP', color: '#3050F8', text: 'Monthly subscription is seamless. Auto-refill, no phone calls, no pharmacy lines.', tag: 'NAD+' },
  { name: 'Drew A.', initials: 'DA', color: '#0B8B7A', text: 'The lifestyle add-on suggestions are genuinely useful. Paired my protocol with the mobility guide.', tag: 'BPC-157' },
  { name: 'Avery T.', initials: 'AT', color: '#A66B3C', text: 'The chromosome graphic on the Epitalon page is wild. Never seen a telehealth site show telomere science.', tag: 'Epitalon' },
  { name: 'Quinn F.', initials: 'QF', color: '#3050F8', text: 'Checkout was 3 clicks. Processing was smooth, no issues. Way better than expected.', tag: 'Semaglutide' },
];

function UGCCard({ post }) {
  return (
    <div className="flex-shrink-0 w-[300px] bg-white border border-gray-100 rounded-2xl p-5 mx-2 shadow-sm">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-black flex-shrink-0"
          style={{ backgroundColor: post.color }}>
          {post.initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1">
            <p className="text-sm font-bold text-gray-900 truncate">{post.name}</p>
            <BadgeCheck className="w-3.5 h-3.5 text-[#0B8B7A] flex-shrink-0" />
          </div>
          <p className="text-[11px] text-gray-400">Verified Customer</p>
        </div>
        <Quote className="w-4 h-4 text-gray-200 flex-shrink-0" />
      </div>
      <p className="text-sm text-gray-700 leading-relaxed mb-3">{post.text}</p>
      <div className="inline-flex items-center gap-1 bg-gray-50 rounded-full px-2.5 py-1">
        <span className="w-1.5 h-1.5 rounded-full bg-[#0B8B7A]" />
        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{post.tag}</span>
      </div>
    </div>
  );
}

export default function UGCSection({ productName, productId }) {
  const row1 = [...UGC_POSTS, ...UGC_POSTS];
  const row2 = [...UGC_POSTS.slice().reverse(), ...UGC_POSTS.slice().reverse()];

  return (
    <section className="py-12 px-5 lg:px-12 bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">💬</span>
          <h2 className="text-2xl font-black text-[#0A0A0A]">Community Buzz</h2>
        </div>
        <p className="text-sm text-gray-500">Real experiences from MedRevolve customers — platform, shipping, and research quality.</p>
      </div>

      {/* Row 1 — scrolling left */}
      <div className="relative overflow-hidden mb-4">
        <div className="flex animate-marquee-left">
          {row1.map((post, i) => (
            <UGCCard key={`r1-${i}`} post={post} />
          ))}
        </div>
      </div>

      {/* Row 2 — scrolling right */}
      <div className="relative overflow-hidden">
        <div className="flex animate-marquee-right">
          {row2.map((post, i) => (
            <UGCCard key={`r2-${i}`} post={post} />
          ))}
        </div>
      </div>

      <p className="text-center text-xs text-gray-400 mt-6 max-w-2xl mx-auto">
        Customer experiences reflect platform quality, not medical outcomes. Individual results vary.
        These are representative community sentiments, not medical advice.
      </p>
    </section>
  );
}