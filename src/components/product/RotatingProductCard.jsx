import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

/**
 * Rotating Product Card with Premium Pharmaceutical Styling
 * Cycles through product variants (forms) with professional MR branding
 */
export default function RotatingProductCard({ product }) {
  const [currentVariant, setCurrentVariant] = useState(0);
  const [autoRotate, setAutoRotate] = useState(true);

  // Product variants (different forms/styles)
  const variants = product.variants || [
    {
      form: product.form,
      image: product.image,
      color: product.gradient?.[0] || '#2D3A2D',
      label: product.form || 'Product',
    },
    {
      form: 'Results',
      image: product.lifestyle,
      color: product.gradient?.[1] || '#4A6741',
      label: 'Real Results',
    },
  ];

  useEffect(() => {
    if (!autoRotate) return;
    const interval = setInterval(() => {
      setCurrentVariant(prev => (prev + 1) % variants.length);
    }, 4000); // Rotate every 4 seconds
    return () => clearInterval(interval);
  }, [autoRotate, variants.length]);

  const current = variants[currentVariant];

  return (
    <Link to={createPageUrl(`ProductDetail?id=${product.id}`)}>
      <motion.div
        className="w-64 bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group border border-[#D1D5DB]/30 cursor-pointer"
        whileHover={{ y: -6 }}
        onMouseEnter={() => setAutoRotate(false)}
        onMouseLeave={() => setAutoRotate(true)}
      >
        {/* Rotating Product Image Section */}
        <div className="relative aspect-[4/3] overflow-hidden flex items-center justify-center">
          <AnimatePresence mode="fade">
            <motion.div
              key={currentVariant}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 w-full h-full"
              style={{ backgroundColor: `${current.color}15` }}
            >
              {current.image ? (
                <img
                  src={current.image}
                  alt={current.label}
                  className="w-full h-full object-cover object-center"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  {current.label}
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />

          {/* Product Tag */}
          {product.tag && (
            <span className="absolute top-3 left-3 bg-[#0F172A] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full tracking-widest uppercase z-10">
              {product.tag}
            </span>
          )}

          {/* Variant Indicators (dots) */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {variants.map((_, idx) => (
              <motion.button
                key={idx}
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentVariant(idx);
                  setAutoRotate(false);
                }}
                className={`transition-all ${
                  idx === currentVariant
                    ? 'bg-white w-6 h-2'
                    : 'bg-white/40 w-2 h-2 hover:bg-white/70'
                } rounded-full`}
                whileHover={{ scale: 1.2 }}
              />
            ))}
          </div>

          {/* MR Branding */}
          <span className="absolute bottom-2.5 right-3 text-[11px] font-black text-white/20 tracking-tighter select-none font-serif">
            MR
          </span>
        </div>

        {/* Product Info */}
        <div className="p-5">
          <p className="text-[10px] font-bold text-[#7A8F7C] uppercase tracking-[0.18em] mb-1">
            {product.category}
          </p>
          <h3 className="text-base font-semibold text-[#0F172A] mb-1.5 group-hover:text-[#4A6741] transition-colors">
            {product.name}
          </h3>
          <p className="text-sm text-[#1E293B]/55 line-clamp-2 mb-4 leading-relaxed">
            {product.description}
          </p>

          {/* CTA with animated arrow */}
          <div className="flex items-center gap-1 text-[#0F172A] text-sm font-semibold group-hover:gap-2 transition-all">
            Learn More
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </motion.div>
    </Link>
  );
}