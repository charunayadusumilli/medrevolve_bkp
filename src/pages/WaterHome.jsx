/**
 * medrevolvewater.com — Consumer Wellness & Water Products Landing Page
 * Domain: WATER
 * Compliance: Standard E-Commerce only — NO medical claims
 */
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { CheckCircle, Droplets, Leaf, Zap, Star, ArrowRight, Shield } from 'lucide-react';

const PRODUCTS = [
  {
    id: 'h2-boost',
    name: 'H2 Boost',
    tagline: 'Molecular Hydrogen Water',
    price: '$49.99',
    description: 'Premium molecular hydrogen infused water tablets for daily hydration support.',
    badge: 'Best Seller',
    badgeColor: 'bg-cyan-500',
    benefits: ['2000+ ppb hydrogen', 'Antioxidant properties', 'Convenient tablet form', 'NSF certified'],
  },
  {
    id: 'electro-pure',
    name: 'ElectroPure',
    tagline: 'Electrolyte Hydration Mix',
    price: '$34.99',
    description: 'Clean electrolyte formula with no artificial colors, sweeteners, or fillers.',
    badge: 'New',
    badgeColor: 'bg-green-500',
    benefits: ['Clean formula', 'No artificial colors', '6 electrolytes', '60 servings/bag'],
  },
  {
    id: 'mineral-drops',
    name: 'Mineral Drops',
    tagline: 'Trace Mineral Concentrate',
    price: '$29.99',
    description: 'Full-spectrum trace mineral concentrate sourced from pristine inland sea deposits.',
    badge: null,
    benefits: ['72+ trace minerals', '4-month supply', 'Unflavored concentrate', 'Sustainably sourced'],
  },
];

export default function WaterHome() {
  return (
    <div className="min-h-screen bg-[#060F1A] text-white">

      {/* Top compliance bar */}
      <div className="bg-[#0A1628] border-b border-white/5 text-center py-2 px-4">
        <p className="text-white/30 text-[10px]">
          These statements have not been evaluated by the FDA. These products are not intended to diagnose, treat, cure, or prevent any disease.
        </p>
      </div>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0A1E35] via-[#060F1A] to-[#030810]" />
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=1400&q=30)', backgroundSize: 'cover', backgroundPosition: 'center' }} />

        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="flex items-center justify-center gap-2.5 mb-8">
              <div className="w-9 h-9 bg-white flex items-center justify-center rounded-sm">
                <span className="text-black font-black text-[11px]">MW</span>
              </div>
              <span className="text-white text-base font-bold tracking-tight">MedRevolve Wellness</span>
            </div>

            <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full px-5 py-2 mb-8">
              <Droplets className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-cyan-300 text-xs font-bold tracking-widest uppercase">Pure Wellness Hydration</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-black text-white mb-5 leading-none" style={{ letterSpacing: '-0.03em' }}>
              Hydrate<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">Better.</span>
            </h1>
            <p className="text-xl text-white/45 max-w-2xl mx-auto mb-10 leading-relaxed">
              Premium water enhancement products crafted for those who take their daily wellness seriously.
              Clean ingredients. Transparent sourcing. No compromises.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-none px-10 font-bold text-base hover:from-cyan-400 hover:to-blue-400">
                Shop Products <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button size="lg" variant="ghost" className="text-white border border-white/20 hover:bg-white/10 rounded-none px-10 text-base">
                Our Ingredients
              </Button>
            </div>

            <div className="flex flex-wrap justify-center gap-10 mt-14">
              {[
                { v: '100%', l: 'Clean Formula' },
                { v: 'NSF', l: 'Certified' },
                { v: 'No', l: 'Artificial Anything' },
                { v: 'US', l: 'Manufactured' },
              ].map(s => (
                <div key={s.l} className="text-center">
                  <p className="text-xl font-black text-white">{s.v}</p>
                  <p className="text-white/30 text-xs mt-0.5">{s.l}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Products */}
      <section className="py-24 px-6 bg-[#080F18]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-bold uppercase tracking-widest text-cyan-400 mb-3">Our Products</p>
            <h2 className="text-4xl font-light text-white mb-4">
              Pure Hydration, <span className="font-semibold text-cyan-300">Elevated</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {PRODUCTS.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-cyan-500/30 transition-all group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-xl flex items-center justify-center">
                    <Droplets className="w-7 h-7 text-cyan-400" />
                  </div>
                  {product.badge && (
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full text-white ${product.badgeColor}`}>
                      {product.badge}
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-bold text-white mb-1">{product.name}</h3>
                <p className="text-cyan-400 text-xs font-semibold mb-3">{product.tagline}</p>
                <p className="text-white/45 text-sm leading-relaxed mb-5">{product.description}</p>
                <ul className="space-y-1.5 mb-6">
                  {product.benefits.map(b => (
                    <li key={b} className="flex items-center gap-2 text-xs text-white/50">
                      <CheckCircle className="w-3 h-3 text-cyan-400 flex-shrink-0" />
                      {b}
                    </li>
                  ))}
                </ul>
                <div className="flex items-center justify-between pt-4 border-t border-white/8">
                  <span className="text-xl font-bold text-white">{product.price}</span>
                  <Button size="sm" className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-none text-xs font-bold hover:from-cyan-400 hover:to-blue-400">
                    Add to Cart
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 px-6 bg-[#060F1A]">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Leaf, title: 'Clean & Transparent', body: 'Every ingredient listed clearly. No proprietary blends hiding what you\'re actually consuming.' },
              { icon: Shield, title: 'Third-Party Tested', body: 'Every batch tested by independent labs for purity, potency, and safety. COAs available on request.' },
              { icon: Zap, title: 'Backed by Science', body: 'Formulas built on peer-reviewed research, not marketing trends. Real doses, real data.' },
            ].map((val, i) => {
              const Icon = val.icon;
              return (
                <motion.div key={val.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className="text-center">
                  <div className="w-14 h-14 bg-cyan-500/10 border border-cyan-500/20 rounded-2xl flex items-center justify-center mx-auto mb-5">
                    <Icon className="w-7 h-7 text-cyan-400" />
                  </div>
                  <h3 className="text-white font-semibold text-lg mb-3">{val.title}</h3>
                  <p className="text-white/40 text-sm leading-relaxed">{val.body}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#030810] border-t border-white/5 py-12 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 bg-white flex items-center justify-center rounded-sm">
                <span className="text-black font-black text-[10px]">MW</span>
              </div>
              <span className="text-white text-sm font-bold">MedRevolve Wellness</span>
            </div>
            <div className="flex gap-6 text-xs text-white/30">
              <a href="/Privacy" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="/Terms" className="hover:text-white transition-colors">Terms</a>
              <a href="/Contact" className="hover:text-white transition-colors">Contact</a>
            </div>
          </div>
          <p className="text-white/15 text-[10px] text-center mt-8 leading-relaxed">
            © 2025 MedRevolve Wellness. These statements have not been evaluated by the FDA.
            These products are not intended to diagnose, treat, cure, or prevent any disease.
          </p>
        </div>
      </footer>
    </div>
  );
}