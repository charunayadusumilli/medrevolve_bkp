import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { addToCart } from '@/lib/cartStore';
import { ArrowRight, FlaskConical, Pill, ShieldCheck, Package } from 'lucide-react';

const TYPE_STYLES = {
  prescription: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', icon: Pill, label: 'Rx Required' },
  ruo: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', icon: FlaskConical, label: 'Research Use Only' },
  supplement: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', icon: Package, label: 'OTC' },
};

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.4, delay },
});

export default function ProductCard({ product, index = 0 }) {
  const typeStyle = TYPE_STYLES[product.type] || TYPE_STYLES.supplement;
  const TypeIcon = typeStyle.icon;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      type: product.billing,
      image: product.image,
    });
  };

  return (
    <motion.div {...fade(index * 0.05)}>
      <Link to={`/product/${product.id}`} className="block group">
        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl hover:border-gray-200 transition-all duration-300 h-full flex flex-col">
          {/* Image */}
          <div className="relative h-48 overflow-hidden bg-gray-50">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
            {product.badge && (
              <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm text-[#0A0A0A] text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm">
                {product.badge}
              </span>
            )}
            <span className={`absolute top-3 right-3 ${typeStyle.bg} ${typeStyle.text} border ${typeStyle.border} text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1`}>
              <TypeIcon className="w-3 h-3" />
              {typeStyle.label}
            </span>
          </div>

          {/* Content */}
          <div className="p-5 flex flex-col flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">{product.icon}</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{product.categoryLabel}</span>
            </div>
            <h3 className="text-lg font-black text-[#0A0A0A] mb-1.5 leading-tight">{product.name}</h3>
            <p className="text-xs text-gray-500 leading-relaxed mb-3 line-clamp-2">{product.tagline}</p>

            {/* Research snippet */}
            <div className="bg-gray-50 rounded-lg p-3 mb-4 flex-1">
              <div className="flex items-center gap-1.5 mb-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#0B8B7A] flex-shrink-0" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#0B8B7A]">Research-Backed</span>
              </div>
              <p className="text-[11px] text-gray-600 leading-relaxed line-clamp-2">{product.research.results}</p>
            </div>

            {/* Price + CTA */}
            <div className="flex items-center justify-between gap-3 mt-auto">
              <div>
                <span className="text-2xl font-black text-[#0A0A0A]">${product.price}</span>
                <span className="text-xs text-gray-400 font-medium">/{product.billing === 'monthly' ? 'mo' : 'one-time'}</span>
              </div>
              {product.waitlist ? (
                <Button size="sm" className="bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg text-xs h-9 px-4">
                  Join Waitlist <ArrowRight className="ml-1 w-3 h-3" />
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={handleAddToCart}
                    className="bg-[#0B8B7A] hover:bg-[#0A7A6A] text-white rounded-lg text-xs h-9 px-3">
                    Add to Cart
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}