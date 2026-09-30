import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import ProductCard from '@/components/dtc/ProductCard';
import { DTC_PRODUCTS } from '@/data/dtcProducts';

const FEATURED_IDS = ['semaglutide', 'tirzepatide', 'bpc157', 'nad_plus'];

export default function FeaturedGrid() {
  const products = FEATURED_IDS.map((id) => DTC_PRODUCTS.find((p) => p.id === id)).filter(Boolean);
  return (
    <section className="py-24 px-6 lg:px-10 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0B8B7A] mb-3">Most explored</p>
            <h2 className="text-3xl lg:text-4xl font-semibold text-[#0A1414] tracking-tight">Featured protocols & compounds</h2>
          </div>
          <Link to="/shop" className="inline-flex items-center gap-2 text-sm font-semibold text-[#0A1414] hover:text-[#0B8B7A]">
            View all products <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
        </div>
      </div>
    </section>
  );
}