import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

const THEMES = [
  {
    id: 'mens_health',
    label: "Men's Health",
    tagline: 'Testosterone & Performance',
    accent: '#1A3A5C',
    light: '#E8F0F8',
    photo: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80',
    badge: 'Most Popular',
    description: 'TRT, testosterone optimization, and men\'s vitality programs.',
  },
  {
    id: 'womens_health',
    label: "Women's Health",
    tagline: 'Hormone Balance & Wellness',
    accent: '#7B3F6E',
    light: '#F5EAF3',
    photo: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80',
    description: 'BHRT, hormonal wellness, and women\'s vitality programs.',
  },
  {
    id: 'glp1',
    label: 'GLP-1 / Weight Loss',
    tagline: 'Physician-Supervised Weight Management',
    accent: '#1A5C3A',
    light: '#E8F5EE',
    photo: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80',
    badge: 'High Demand',
    description: 'Semaglutide and weight loss telehealth programs.',
  },
  {
    id: 'longevity',
    label: 'Longevity & Anti-Aging',
    tagline: 'Optimize Your Biology',
    accent: '#2D2D5A',
    light: '#EEEEF7',
    photo: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80',
    description: 'Peptides, NAD+, and longevity optimization programs.',
  },
  {
    id: 'wellness_clinic',
    label: 'Wellness Clinic',
    tagline: 'Whole-Body Functional Medicine',
    accent: '#3A5C2D',
    light: '#EBF5E8',
    photo: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&q=80',
    description: 'IV therapy, functional medicine, and integrative wellness.',
  },
  {
    id: 'med_spa',
    label: 'Med Spa',
    tagline: 'Aesthetic & Wellness Services',
    accent: '#5C3A1A',
    light: '#F5EDE8',
    photo: 'https://images.unsplash.com/photo-1552693673-1bf958298935?w=800&q=80',
    description: 'Aesthetics, skin health, and med spa telehealth add-ons.',
  },
  {
    id: 'hair_health',
    label: 'Hair Restoration',
    tagline: 'Hair Loss Treatment Programs',
    accent: '#1A4A5C',
    light: '#E8F2F5',
    photo: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80',
    description: 'Hair loss prevention and restoration telehealth programs.',
  },
];

export default function ThemePicker({ onSelect }) {
  const [brandName, setBrandName] = useState('');
  const [selected, setSelected] = useState(null);
  const [previewIdx, setPreviewIdx] = useState(0);

  const activeTheme = selected ? THEMES.find(t => t.id === selected) : THEMES[previewIdx];
  const displayName = brandName.trim() || 'Your Brand';

  const handleSelect = (id) => {
    setSelected(id);
    if (onSelect) onSelect({ themeId: id, brandName });
  };

  return (
    <div className="w-full">
      {/* Brand name input */}
      <div className="mb-6 text-center">
        <p className="text-sm font-semibold text-gray-600 mb-2">Enter your brand name to preview your website</p>
        <Input
          value={brandName}
          onChange={e => setBrandName(e.target.value)}
          placeholder="e.g. Elite Wellness, VitalMen, PureLife..."
          className="max-w-sm mx-auto text-center text-base font-semibold border-gray-300 focus:border-gray-900"
        />
      </div>

      {/* Live preview panel */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTheme.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="relative w-full rounded-2xl overflow-hidden shadow-xl mb-6 border border-gray-100"
          style={{ height: 260 }}
        >
          {/* Background photo */}
          <img
            src={activeTheme.photo}
            alt={activeTheme.label}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${activeTheme.accent}E6 0%, ${activeTheme.accent}99 100%)` }} />

          {/* Mock nav bar */}
          <div className="absolute top-0 left-0 right-0 px-5 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-white/90 rounded-sm flex items-center justify-center">
                <span className="text-[8px] font-black" style={{ color: activeTheme.accent }}>
                  {displayName.slice(0, 2).toUpperCase()}
                </span>
              </div>
              <span className="text-white font-bold text-sm tracking-tight">{displayName}</span>
            </div>
            <div className="hidden sm:flex items-center gap-4">
              <span className="text-white/70 text-xs">Services</span>
              <span className="text-white/70 text-xs">How It Works</span>
              <div className="bg-white/20 border border-white/30 rounded-sm px-3 py-1">
                <span className="text-white text-xs font-semibold">Book Now</span>
              </div>
            </div>
          </div>

          {/* Hero text */}
          <div className="absolute bottom-0 left-0 right-0 p-5">
            <p className="text-white/70 text-xs mb-1 uppercase tracking-widest font-semibold">{activeTheme.tagline}</p>
            <h3 className="text-white font-black text-xl md:text-2xl leading-tight mb-3">
              {displayName} —<br />
              <span className="text-white/80">Start Your Journey</span>
            </h3>
            <div className="flex gap-2">
              <div className="bg-white rounded-sm px-4 py-1.5" style={{ background: 'white' }}>
                <span className="font-bold text-xs" style={{ color: activeTheme.accent }}>Get Started</span>
              </div>
              <div className="border border-white/40 rounded-sm px-4 py-1.5">
                <span className="text-white text-xs font-medium">Learn More</span>
              </div>
            </div>
          </div>

          {/* Selected badge */}
          {selected === activeTheme.id && (
            <div className="absolute top-3 right-3 bg-white rounded-full w-7 h-7 flex items-center justify-center shadow-lg">
              <Check className="w-4 h-4 text-green-600" />
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Theme grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
        {THEMES.map((theme, idx) => (
          <button
            key={theme.id}
            onClick={() => { setPreviewIdx(idx); handleSelect(theme.id); }}
            className={`relative rounded-xl overflow-hidden border-2 transition-all ${
              selected === theme.id
                ? 'border-gray-900 shadow-md scale-[1.02]'
                : 'border-gray-100 hover:border-gray-300'
            }`}
            style={{ height: 70 }}
          >
            <img src={theme.photo} alt={theme.label} className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0" style={{ background: `${theme.accent}CC` }} />
            <div className="absolute inset-0 flex flex-col items-center justify-center p-1">
              <span className="text-white font-bold text-[10px] text-center leading-tight">{theme.label}</span>
            </div>
            {theme.badge && (
              <div className="absolute top-1 right-1 bg-white/90 rounded-full px-1.5 py-0.5">
                <span className="text-[8px] font-black" style={{ color: theme.accent }}>{theme.badge}</span>
              </div>
            )}
            {selected === theme.id && (
              <div className="absolute top-1 left-1 bg-white rounded-full w-4 h-4 flex items-center justify-center">
                <Check className="w-2.5 h-2.5 text-green-600" />
              </div>
            )}
          </button>
        ))}
      </div>

      {/* CTA */}
      {selected && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <Link to={`${createPageUrl('MerchantOnboarding')}?theme=${selected}&brand=${encodeURIComponent(brandName)}`}>
            <Button className="bg-gray-900 hover:bg-gray-700 text-white rounded-sm px-10 py-3 h-auto font-bold text-sm">
              Start Building {brandName ? `"${brandName}"` : 'My Platform'} <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
          <p className="text-xs text-gray-400 mt-2">No commitment — book a free discovery call first</p>
        </motion.div>
      )}
    </div>
  );
}