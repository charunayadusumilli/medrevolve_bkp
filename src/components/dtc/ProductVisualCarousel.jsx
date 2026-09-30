import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MRAutoPen, MRVial, MRPill } from '@/components/product/MRPharmaceuticalVisuals';

const VISUAL_MAP = {
  semaglutide: 'pen',
  tirzepatide: 'pen',
  retatrutide: 'pen',
  bpc157: 'vial',
  epitalon: 'vial',
  nad_plus: 'vial',
  trt: 'vial',
  enclomiphene: 'pill',
  bhrt: 'pill',
  wellness_bundle: 'pill',
  bac_water_5ml: 'vial',
  bac_water_30ml: 'vial',
  injection_kit: 'vial',
};

const ACCENT_COLORS = {
  semaglutide: '#0B8B7A',
  tirzepatide: '#0B8B7A',
  retatrutide: '#0B8B7A',
  bpc157: '#3050F8',
  epitalon: '#A66B3C',
  nad_plus: '#FF2020',
  trt: '#1A3A6B',
  enclomiphene: '#1A3A6B',
  bhrt: '#B43090',
  wellness_bundle: '#0B8B7A',
  bac_water_5ml: '#3050F8',
  bac_water_30ml: '#3050F8',
  injection_kit: '#555',
};

export default function ProductVisualCarousel({ product }) {
  const [current, setCurrent] = useState(0);
  const [autoRotate, setAutoRotate] = useState(true);

  const visualType = VISUAL_MAP[product.id] || 'vial';
  const accentColor = ACCENT_COLORS[product.id] || '#0B8B7A';

  const slides = [
    { type: 'visual', label: 'Product Visual' },
    { type: 'photo', label: 'Product Photo' },
  ];

  useEffect(() => {
    if (!autoRotate) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [autoRotate, slides.length]);

  return (
    <div
      className="relative w-full h-[320px] lg:h-[400px] rounded-2xl overflow-hidden border border-gray-100 bg-gradient-to-br from-gray-50 to-white"
      onMouseEnter={() => setAutoRotate(false)}
      onMouseLeave={() => setAutoRotate(true)}
    >
      <AnimatePresence mode="fade">
        {current === 0 && (
          <motion.div
            key="visual"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 flex items-center justify-center"
            style={{ background: `linear-gradient(135deg, ${accentColor}10, ${accentColor}05)` }}
          >
            {visualType === 'pen' && <MRAutoPen accentColor={accentColor} productName={product.name} size="lg" />}
            {visualType === 'vial' && <MRVial accentColor={accentColor} productName={product.name} size="lg" />}
            {visualType === 'pill' && <MRPill accentColor={accentColor} productName={product.name} size="lg" />}
          </motion.div>
        )}
        {current === 1 && (
          <motion.div
            key="photo"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
          >
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Slide indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => { setCurrent(idx); setAutoRotate(false); }}
            className={`transition-all rounded-full ${
              idx === current ? 'bg-[#0B8B7A] w-6 h-2' : 'bg-gray-300 w-2 h-2 hover:bg-gray-400'
            }`}
          />
        ))}
      </div>

      {/* Label badge */}
      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-500">
        {slides[current].label}
      </div>
    </div>
  );
}