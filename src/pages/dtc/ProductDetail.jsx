import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { getProduct, DTC_PRODUCTS } from '@/data/dtcProducts';
import ProductCard from '@/components/dtc/ProductCard';
import { addToCart, cartCount } from '@/lib/cartStore';
import {
  ArrowLeft, ArrowRight, ShoppingCart, ShieldCheck, FlaskConical, Pill, Package,
  CheckCircle2, ExternalLink, Lightbulb, BookOpen, AlertTriangle, Atom
} from 'lucide-react';
import MoleculeViewer3D from '@/components/dtc/MoleculeViewer3D';
import CellularBindingAnimation from '@/components/dtc/CellularBindingAnimation';
import ChromosomeGraphic from '@/components/dtc/ChromosomeGraphic';
import UGCSection from '@/components/dtc/UGCSection';
import ProductVisualCarousel from '@/components/dtc/ProductVisualCarousel';

const TYPE_STYLES = {
  prescription: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', icon: Pill, label: 'Prescription Required', desc: 'A licensed provider must review your health history and approve this medication before it\'s prescribed.' },
  ruo: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', icon: FlaskConical, label: 'Research Use Only', desc: 'This product is sold for laboratory research purposes only. Not for human consumption. Not FDA-approved.' },
  supplement: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', icon: Package, label: 'OTC / Lifestyle', desc: 'Over-the-counter. No prescription needed. Third-party tested for purity.' },
};

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = getProduct(id);
  const [cartBadge, setCartBadge] = useState(cartCount());
  const [added, setAdded] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const h = () => setCartBadge(cartCount());
    window.addEventListener('cart-updated', h);
    return () => window.removeEventListener('cart-updated', h);
  }, [id]);

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-4xl font-black text-gray-200 mb-2">404</p>
          <p className="text-gray-500 mb-6">Product not found.</p>
          <Link to="/shop"><Button className="bg-[#0B8B7A] hover:bg-[#0A7A6A] text-white rounded-lg">Back to Shop</Button></Link>
        </div>
      </div>
    );
  }

  const typeStyle = TYPE_STYLES[product.type];
  const TypeIcon = typeStyle.icon;
  const related = DTC_PRODUCTS.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      type: product.billing,
      image: product.image,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="bg-white min-h-screen pt-24">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-5 lg:px-12 py-4">
        <Link to="/shop" className="inline-flex items-center text-sm text-gray-400 hover:text-[#0B8B7A] transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Shop
        </Link>
      </div>

      {/* Hero section */}
      <section className="px-5 lg:px-12 pb-10">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-10">
          {/* Image */}
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}
            className="relative rounded-2xl overflow-hidden shadow-lg">
            <ProductVisualCarousel product={product} />
            {product.badge && (
              <span className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm text-[#0A0A0A] text-xs font-black uppercase tracking-wider px-3 py-1.5 rounded-full shadow-sm z-20">
                {product.badge}
              </span>
            )}
          </motion.div>

          {/* Info */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">{product.icon}</span>
              <span className="text-xs font-bold uppercase tracking-widest text-gray-400">{product.categoryLabel}</span>
            </div>

            <h1 className="text-3xl md:text-4xl font-black text-[#0A0A0A] mb-2" style={{ letterSpacing: '-0.03em' }}>
              {product.name}
            </h1>
            <p className="text-base text-gray-500 mb-4">{product.tagline}</p>

            {/* Type badge */}
            <div className={`${typeStyle.bg} ${typeStyle.border} border rounded-xl p-4 mb-5`}>
              <div className="flex items-center gap-2 mb-1.5">
                <TypeIcon className={`w-5 h-5 ${typeStyle.text}`} />
                <span className={`text-sm font-black ${typeStyle.text}`}>{typeStyle.label}</span>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">{typeStyle.desc}</p>
            </div>

            {/* Humor callout */}
            <div className="bg-gray-50 rounded-xl p-4 mb-5 border-l-4 border-[#0B8B7A]">
              <p className="text-sm text-gray-700 italic leading-relaxed">💬 {product.humor}</p>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-2 mb-5">
              <span className="text-4xl font-black text-[#0A0A0A]">${product.price}</span>
              <span className="text-sm text-gray-400 font-medium">/ {product.billing === 'monthly' ? 'month' : 'one-time'}</span>
            </div>

            {/* What's included */}
            <div className="mb-5">
              <p className="text-xs font-black uppercase tracking-wider text-gray-400 mb-3">What's Included</p>
              <div className="grid grid-cols-2 gap-2">
                {product.includes.map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#0B8B7A] flex-shrink-0" />
                    <span className="text-xs text-gray-700 font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="flex gap-3">
              {product.waitlist ? (
                <Button size="lg" className="bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg px-8 font-bold h-auto py-3.5">
                  Join Waitlist <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              ) : (
                <Button
                  size="lg"
                  onClick={handleAddToCart}
                  className={`rounded-lg px-8 font-bold h-auto py-3.5 transition-all ${added ? 'bg-green-600 text-white' : 'bg-[#0B8B7A] hover:bg-[#0A7A6A] text-white'}`}>
                  {added ? (
                    <>✓ Added to Cart</>
                  ) : (
                    <><ShoppingCart className="mr-2 w-4 h-4" /> Add to Cart — ${product.price}</>
                  )}
                </Button>
              )}
              <Link to="/dtc-cart">
                <Button size="lg" variant="outline" className="rounded-lg px-6 font-bold h-auto py-3.5 border-gray-300 relative">
                  View Cart
                  {cartBadge > 0 && (
                    <span className="absolute -top-2 -right-2 bg-[#0B8B7A] text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center">
                      {cartBadge}
                    </span>
                  )}
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Molecular Structure — 3D viewer */}
      <section className="py-12 px-5 lg:px-12 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-2 mb-6">
            <Atom className="w-6 h-6 text-[#0B8B7A]" />
            <h2 className="text-2xl font-black text-[#0A0A0A]">Molecular Structure</h2>
            <span className="text-sm text-gray-400 font-medium">— see it in 3D</span>
          </div>
          <MoleculeViewer3D productId={product.id} accentColor="#0B8B7A" />
          <p className="text-xs text-gray-400 text-center mt-4 max-w-xl mx-auto">
            Interactive 3D model. Drag to rotate. Atom colors: carbon (gray), nitrogen (blue), oxygen (red).
            Structure is a simplified representation for educational purposes.
          </p>
        </div>
      </section>

      {/* Research section */}
      <section className="bg-gray-50 py-12 px-5 lg:px-12">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-2 mb-6">
            <BookOpen className="w-6 h-6 text-[#0B8B7A]" />
            <h2 className="text-2xl font-black text-[#0A0A0A]">The Research</h2>
            <span className="text-sm text-gray-400 font-medium">— here's what the studies actually say</span>
          </div>

          {/* Cellular binding animation */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Atom className="w-5 h-5 text-[#0B8B7A]" />
              <h3 className="text-lg font-black text-[#0A0A0A]">How It Binds</h3>
              <span className="text-sm text-gray-400 font-medium">— cellular mechanism in action</span>
            </div>
            <CellularBindingAnimation accentColor="#0B8B7A" />
          </div>

          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-xl p-5 border border-gray-100">
              <p className="text-xs font-black uppercase tracking-wider text-[#0B8B7A] mb-2">Mechanism</p>
              <p className="text-sm text-gray-700 leading-relaxed">{product.research.mechanism}</p>
            </div>
            <div className="bg-white rounded-xl p-5 border border-gray-100">
              <p className="text-xs font-black uppercase tracking-wider text-[#0B8B7A] mb-2">Key Study</p>
              <p className="text-sm text-gray-700 leading-relaxed">{product.research.keyStudy}</p>
            </div>
            <div className="bg-white rounded-xl p-5 border border-gray-100">
              <p className="text-xs font-black uppercase tracking-wider text-[#0B8B7A] mb-2">Results</p>
              <p className="text-sm text-gray-700 leading-relaxed">{product.research.results}</p>
            </div>
          </div>

          {/* Chromosome / telomere graphic (longevity products only) */}
          {(product.id === 'epitalon' || product.id === 'nad_plus') && (
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Atom className="w-5 h-5 text-[#0B8B7A]" />
                <h3 className="text-lg font-black text-[#0A0A0A]">Chromosome & Telomere Health</h3>
              </div>
              <ChromosomeGraphic accentColor="#0B8B7A" />
            </div>
          )}

          {/* Full description */}
          <div className="bg-white rounded-xl p-6 border border-gray-100 mb-8">
            <h3 className="text-lg font-black text-[#0A0A0A] mb-3">What it is</h3>
            <p className="text-sm text-gray-700 leading-relaxed">{product.description}</p>
          </div>

          {/* Citations */}
          <div className="bg-white rounded-xl p-6 border border-gray-100 mb-8">
            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck className="w-5 h-5 text-[#0B8B7A]" />
              <h3 className="text-lg font-black text-[#0A0A0A]">Verified Sources</h3>
            </div>
            <div className="space-y-3">
              {product.research.citations.map((cite, i) => (
                <a key={i} href={cite.url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-between gap-3 bg-gray-50 hover:bg-gray-100 rounded-lg p-3 transition-colors group">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-full bg-[#0B8B7A]/10 flex items-center justify-center text-xs font-black text-[#0B8B7A] flex-shrink-0">
                      {i + 1}
                    </span>
                    <span className="text-sm text-gray-700 font-medium">{cite.title}</span>
                  </div>
                  <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-[#0B8B7A] flex-shrink-0" />
                </a>
              ))}
            </div>
          </div>

          {/* Lifestyle additions */}
          <div className="bg-gradient-to-br from-[#F0F7F5] to-white rounded-xl p-6 border border-[#0B8B7A]/10">
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb className="w-5 h-5 text-[#0B8B7A]" />
              <h3 className="text-lg font-black text-[#0A0A0A]">Lifestyle Add-Ons</h3>
              <span className="text-sm text-gray-400 font-medium">— pair it with these for the full protocol</span>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {product.lifestyle.map((item, i) => (
                <div key={i} className="flex items-center gap-2 bg-white/60 rounded-lg p-3">
                  <CheckCircle2 className="w-4 h-4 text-[#0B8B7A] flex-shrink-0" />
                  <span className="text-sm text-gray-700 font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* UGC / Community section */}
      <UGCSection productName={product.name} productId={product.id} />

      {/* Compliance disclaimer */}
      <section className="bg-amber-50 border-y border-amber-100 py-8 px-5 lg:px-12">
        <div className="max-w-5xl mx-auto flex items-start gap-4">
          <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-black text-amber-800 mb-1">Important Compliance Notice</p>
            <p className="text-xs text-amber-700 leading-relaxed">
              {product.type === 'prescription' && 'This product requires a consultation with a US-licensed provider. A prescription is only issued if medically appropriate based on your health history and lab results. Individual results vary. This is not medical advice — consult your provider.'}
              {product.type === 'ruo' && 'This product is labeled and sold for Research Use Only. It is not intended for human consumption, diagnosis, or treatment. Not FDA-approved. All RUO products are third-party tested for purity and sold for laboratory research purposes.'}
              {product.type === 'supplement' && 'This is an over-the-counter product. Statements have not been evaluated by the FDA. Not intended to diagnose, treat, cure, or prevent any disease. Consult your provider before starting any supplement.'}
            </p>
          </div>
        </div>
      </section>

      {/* Related products */}
      {related.length > 0 && (
        <section className="py-12 px-5 lg:px-12">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-xl font-black text-[#0A0A0A] mb-6">More in {product.categoryLabel}</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {related.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}