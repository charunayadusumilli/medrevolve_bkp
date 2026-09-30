import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { getProduct } from '@/data/dtcProducts';

const PICKS = [
  { id: 'semaglutide', bg: 'bg-mr-sage' },
  { id: 'nad_plus', bg: 'bg-mr-sand' },
  { id: 'enclomiphene', bg: 'bg-mr-blush' },
];

export default function ProductSpotlight() {
  return (
    <section className="bg-dtc-surface py-20 px-5 lg:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between gap-4 mb-10">
          <h2 className="font-display text-4xl lg:text-5xl text-dtc-text">Member favorites</h2>
          <Link to="/shop" className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-dtc-text hover:text-mr-forest">
            Shop all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {PICKS.map(({ id, bg }) => {
            const p = getProduct(id);
            if (!p) return null;
            return (
              <Link key={id} to={`/product/${id}`} className="group">
                <div className={`rounded-3xl overflow-hidden aspect-square ${bg}`}>
                  <img src={p.image} alt={p.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
                <div className="flex items-start justify-between mt-4">
                  <div>
                    <p className="font-display text-2xl text-dtc-text">{p.name}</p>
                    <p className="text-sm text-dtc-text/75">{p.typeLabel}</p>
                  </div>
                  <p className="text-sm font-medium text-dtc-text">${p.price}{p.billing === 'monthly' ? '/mo' : ''}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}