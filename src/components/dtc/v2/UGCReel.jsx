import React from 'react';
import { Play } from 'lucide-react';
import { UGC_POSTS } from './brand';

export default function UGCReel() {
  return (
    <section className="bg-mr-ink py-20">
      <div className="max-w-7xl mx-auto px-5 lg:px-10 flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-10">
        <h2 className="font-display text-4xl lg:text-5xl text-white">Real members. Real routines.</h2>
        <p className="text-sm text-white/70 max-w-sm">Shared experiences with the platform — not medical claims. Individual results vary.</p>
      </div>
      <div className="flex gap-4 overflow-x-auto scrollbar-hide px-5 lg:px-10 pb-2 snap-x snap-mandatory">
        {UGC_POSTS.map((p) => (
          <div key={p.handle} className="relative flex-shrink-0 w-60 sm:w-64 aspect-[9/16] rounded-3xl overflow-hidden snap-start">
            <img src={p.image} alt={p.handle} loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/30" />
            <div className="absolute top-3 left-3 flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-white/20 backdrop-blur border border-white/40" />
              <span className="text-xs font-semibold text-white">{p.handle}</span>
            </div>
            <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
              <Play className="w-3.5 h-3.5 text-white fill-white" />
            </div>
            <div className="absolute bottom-0 inset-x-0 p-4">
              <span className="inline-block text-[10px] font-semibold uppercase tracking-wider bg-white/15 backdrop-blur text-white rounded-full px-2.5 py-1 mb-2">{p.tag}</span>
              <p className="text-white text-sm leading-snug">"{p.quote}"</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}