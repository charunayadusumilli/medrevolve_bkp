import React from 'react';
import { GOALS } from '../brand';

export default function StepGoal({ onSelect }) {
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="font-display text-4xl sm:text-5xl text-dtc-text text-center mb-3">What brings you here?</h1>
      <p className="text-center text-dtc-text/75 mb-10">Pick one to start. You can always explore more later.</p>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {GOALS.map((g) => (
          <button key={g.id} onClick={() => onSelect(g.id)}
            className={`group relative rounded-3xl overflow-hidden aspect-[4/3] text-left ${g.bg} ring-0 hover:ring-2 ring-dtc-text transition`}>
            <img src={g.image} alt={g.label} className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-0 p-4 sm:p-5 text-white">
              <p className="font-display text-2xl sm:text-3xl">{g.label}</p>
              <p className="text-xs sm:text-sm text-white/80">{g.blurb}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}