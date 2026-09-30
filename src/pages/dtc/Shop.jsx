import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { DTC_CATEGORIES, DTC_PRODUCTS, getPopularProducts } from '@/data/dtcProducts';
import ProductCard from '@/components/dtc/ProductCard';
import { Search, ShoppingCart, Info, FlaskConical, ShieldCheck, Pill } from 'lucide-react';
import { getCart, cartCount } from '@/lib/cartStore';

export default function Shop() {
  const urlParams = new URLSearchParams(window.location.search);
  const initialCat = urlParams.get('cat') || 'all';
  const [activeCategory, setActiveCategory] = useState(initialCat);
  const [search, setSearch] = useState('');
  const [cartBadge, setCartBadge] = useState(cartCount());

  // Listen for cart updates
  React.useEffect(() => {
    const h = () => setCartBadge(cartCount());
    window.addEventListener('cart-updated', h);
    return () => window.removeEventListener('cart-updated', h);
  }, []);

  // Update category when URL changes (nav link clicks while on shop page)
  const location = useLocation();
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const cat = params.get('cat');
    if (cat) setActiveCategory(cat);
  }, [location.search]);

  const filtered = useMemo(() => {
    let products = activeCategory === 'all'
      ? DTC_PRODUCTS
      : DTC_PRODUCTS.filter(p => p.category === activeCategory);
    if (search.trim()) {
      const q = search.toLowerCase();
      products = products.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.tagline.toLowerCase().includes(q) ||
        p.categoryLabel.toLowerCase().includes(q)
      );
    }
    return products;
  }, [activeCategory, search]);

  const popular = getPopularProducts();

  return (
    <div className="bg-white min-h-screen">
      {/* Hero strip */}
      <section className="bg-gradient-to-b from-[#F0F7F5] to-white py-12 px-5 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="inline-block text-xs font-black uppercase tracking-widest text-[#0B8B7A] border border-[#0B8B7A]/20 rounded-full px-4 py-1.5 mb-4">
              Shop Compounds
            </span>
            <h1 className="text-3xl md:text-5xl font-black text-[#0A0A0A] mb-3" style={{ letterSpacing: '-0.03em' }}>
              Every compound, backed by <span className="text-[#0B8B7A]">real research.</span>
            </h1>
            <p className="text-gray-600 max-w-2xl text-sm md:text-base mb-6">
              Browse our full catalog of physician-supervised prescriptions, research-grade peptides, and lifestyle supplies.
              Each product links to peer-reviewed studies — no hype, just the evidence.
            </p>

            {/* Compliance legend */}
            <div className="flex flex-wrap gap-3 mb-6">
              <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2">
                <Pill className="w-4 h-4 text-blue-700" />
                <span className="text-xs font-bold text-blue-700">Prescription Required</span>
                <span className="text-xs text-blue-600">— provider consult first</span>
              </div>
              <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                <FlaskConical className="w-4 h-4 text-amber-700" />
                <span className="text-xs font-bold text-amber-700">Research Use Only (RUO)</span>
                <span className="text-xs text-amber-600">— not for human consumption</span>
              </div>
              <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                <ShieldCheck className="w-4 h-4 text-green-700" />
                <span className="text-xs font-bold text-green-700">OTC / Lifestyle</span>
                <span className="text-xs text-green-600">— no prescription needed</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Search + Category filters */}
      <section className="sticky top-[112px] z-30 bg-white/95 backdrop-blur-lg border-b border-gray-100 py-4 px-5 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search */}
            <div className="relative w-full lg:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
              <input
                type="text"
                placeholder="Search compounds..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#0B8B7A] focus:ring-1 focus:ring-[#0B8B7A]/20"
              />
            </div>
            {/* Categories */}
            <div className="flex gap-2 overflow-x-auto scrollbar-hide flex-1 pb-1">
              {DTC_CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex-shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                    activeCategory === cat.id
                      ? 'bg-[#0B8B7A] text-white'
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                  }`}>
                  <span>{cat.icon}</span> {cat.label}
                </button>
              ))}
            </div>
            {/* Cart badge */}
            <Link to="/dtc-cart" className="flex-shrink-0">
              <Button variant="outline" className="relative rounded-lg border-gray-200">
                <ShoppingCart className="w-4 h-4" />
                <span className="ml-1.5 text-sm font-bold">Cart</span>
                {cartBadge > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#0B8B7A] text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center">
                    {cartBadge}
                  </span>
                )}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Popular products (only on 'all' with no search) */}
      {activeCategory === 'all' && !search.trim() && (
        <section className="py-10 px-5 lg:px-12">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-2 mb-6">
              <span className="text-2xl">⭐</span>
              <h2 className="text-xl font-black text-[#0A0A0A]">Most Popular</h2>
              <span className="text-xs text-gray-600 font-medium">— what our patients actually order</span>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {popular.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Full product grid */}
      <section className="py-10 px-5 lg:px-12 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-black text-[#0A0A0A]">
              {activeCategory === 'all' ? 'All Products' : DTC_CATEGORIES.find(c => c.id === activeCategory)?.label}
              <span className="text-sm font-medium text-gray-600 ml-2">({filtered.length})</span>
            </h2>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-600 text-sm mb-4">No products found for "{search}"</p>
              <Button variant="outline" onClick={() => { setSearch(''); setActiveCategory('all'); }} className="rounded-lg">
                Clear filters
              </Button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filtered.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Educational disclaimer strip */}
      <section className="bg-gray-50 border-t border-gray-100 py-10 px-5 lg:px-12">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Info className="w-5 h-5 text-gray-600" />
            <h3 className="text-sm font-black uppercase tracking-wider text-gray-600">A note on how we present research</h3>
          </div>
          <p className="text-xs text-gray-600 leading-relaxed max-w-2xl mx-auto">
            Every product page links to peer-reviewed studies so you can read the evidence yourself.
            We describe what the research shows — and what it doesn't. Prescription products require a consultation with a US-licensed provider.
            RUO products are labeled "Research Use Only — not for human consumption" and are sold for laboratory research purposes.
            Nothing here is medical advice. Your provider makes the call.
          </p>
        </div>
      </section>
    </div>
  );
}