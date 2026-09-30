import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { GOALS } from './brand';

export default function GoalTiles() {
  return (
    <section className="bg-dtc-surface py-20 px-5 lg:px-10">
      <div className="max-w-7xl mx-auto">
        <h2 className="font-display text-4xl lg:text-5xl text-dtc-text mb-10">What are you working on?</h2>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {GOALS.map((g) => (
            <Link key={g.id} to={`/start?goal=${g.id}`} className={`group relative rounded-3xl overflow-hidden aspect-[3/4] ${g.bg}`}>
              <img src={g.image} alt={g.label} loading="lazy" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0" />
              <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-dtc-surface/90 flex items-center justify-center group-hover:bg-mr-ink group-hover:text-white transition-colors">
                <ArrowUpRight className="w-4 h-4" />
              </div>
              <div className="absolute bottom-0 inset-x-0 p-5 text-white">
                <p className="font-display text-2xl lg:text-3xl">{g.label}</p>
                <p className="text-xs sm:text-sm text-white/80 mt-1">{g.blurb}</p>
                <p className="text-xs text-white/75 mt-2">From ${g.from}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}