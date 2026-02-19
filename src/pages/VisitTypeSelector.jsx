import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Search, ArrowRight, ChevronRight, CheckCircle2,
  Stethoscope, Beaker, Camera, FlaskConical, Microscope, Leaf, Heart, Shield,
  Brain, Zap, Scale, Activity, User2, Sparkles
} from 'lucide-react';

const CATEGORY_CONFIG = {
  'Weight Loss': { icon: Scale, color: 'from-violet-500 to-violet-600', bg: 'bg-violet-50', border: 'border-violet-200', text: 'text-violet-700' },
  'Hormonal Support': { icon: Activity, color: 'from-pink-500 to-pink-600', bg: 'bg-pink-50', border: 'border-pink-200', text: 'text-pink-700' },
  'Longevity': { icon: Sparkles, color: 'from-amber-500 to-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700' },
  'Sexual Health': { icon: Heart, color: 'from-rose-500 to-rose-600', bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-700' },
  'Skin Care': { icon: User2, color: 'from-emerald-500 to-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700' },
  'Chronic Care': { icon: Stethoscope, color: 'from-blue-500 to-blue-600', bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700' },
  'Preventative Care': { icon: Shield, color: 'from-teal-500 to-teal-600', bg: 'bg-teal-50', border: 'border-teal-200', text: 'text-teal-700' },
  'Behavioral Health': { icon: Brain, color: 'from-purple-500 to-purple-600', bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700' },
  'Urgent Care Visit Types': { icon: Zap, color: 'from-orange-500 to-orange-600', bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700' },
  'Specialty Visits': { icon: Leaf, color: 'from-cyan-500 to-cyan-600', bg: 'bg-cyan-50', border: 'border-cyan-200', text: 'text-cyan-700' },
};

export default function VisitTypeSelector() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [selected, setSelected] = useState(null);
  const navigate = useNavigate();

  const { data: visitTypes = [], isLoading } = useQuery({
    queryKey: ['activeVisitTypes'],
    queryFn: () => base44.entities.BelugaVisitType.filter({ is_active: true }, 'sort_order', 100)
  });

  const categories = useMemo(() => ['all', ...Object.keys(CATEGORY_CONFIG).filter(c => visitTypes.some(v => v.category === c))], [visitTypes]);

  const filtered = useMemo(() => visitTypes.filter(v => {
    const matchesSearch = !search || v.display_name?.toLowerCase().includes(search.toLowerCase()) || v.description?.toLowerCase().includes(search.toLowerCase());
    const matchesCat = activeCategory === 'all' || v.category === activeCategory;
    return matchesSearch && matchesCat;
  }), [visitTypes, search, activeCategory]);

  const handleSelect = (vt) => {
    setSelected(vt);
    // Navigate to intake questionnaire with the visit type
    navigate(createPageUrl(`Questionnaire?visit_type=${vt.visit_type_key}&visit_name=${encodeURIComponent(vt.display_name)}`));
  };

  const grouped = useMemo(() => {
    if (activeCategory !== 'all') return { [activeCategory]: filtered };
    return filtered.reduce((acc, v) => {
      if (!acc[v.category]) acc[v.category] = [];
      acc[v.category].push(v);
      return acc;
    }, {});
  }, [filtered, activeCategory]);

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      {/* Hero */}
      <div className="bg-gradient-to-br from-[#2D3A2D] to-[#1A2A1A] text-white py-16 px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <Badge className="bg-white/10 text-white border-white/20 mb-4">
            <Stethoscope className="w-3.5 h-3.5 mr-1.5" /> Telehealth Visit Types
          </Badge>
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">What would you like help with?</h1>
          <p className="text-white/70 text-lg mb-8 max-w-2xl mx-auto">
            Select a visit type and a licensed provider will review your intake and create a personalized treatment plan — all from home.
          </p>
          {/* Search */}
          <div className="relative max-w-lg mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search conditions, treatments..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-12 pr-4 py-3 h-12 rounded-2xl bg-white/10 border-white/20 text-white placeholder:text-white/50 focus-visible:ring-white/30"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10">
        {/* Category pills */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-8 scrollbar-hide">
          {categories.map(cat => {
            const cfg = CATEGORY_CONFIG[cat] || {};
            const Icon = cfg.icon;
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-[#2D3A2D] text-white shadow-md'
                    : 'bg-white border border-[#E8E0D5] text-[#5A6B5A] hover:border-[#4A6741]/40'
                }`}
              >
                {Icon && <Icon className="w-3.5 h-3.5" />}
                {cat === 'all' ? 'All Treatments' : cat}
              </button>
            );
          })}
        </div>

        {isLoading ? (
          <div className="text-center py-20 text-[#5A6B5A]">Loading visit types...</div>
        ) : (
          <div className="space-y-10">
            {Object.entries(grouped).map(([category, types]) => {
              const cfg = CATEGORY_CONFIG[category] || { icon: Stethoscope, color: 'from-gray-500 to-gray-600', bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-700' };
              const Icon = cfg.icon;
              return (
                <div key={category}>
                  {activeCategory === 'all' && (
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${cfg.color} flex items-center justify-center`}>
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <h2 className="text-lg font-bold text-[#2D3A2D]">{category}</h2>
                      <span className="text-sm text-[#9A8B7A]">({types.length})</span>
                    </div>
                  )}
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {types.map(vt => (
                      <motion.button
                        key={vt.id}
                        whileHover={{ y: -2 }}
                        onClick={() => handleSelect(vt)}
                        className={`text-left border-2 rounded-2xl p-5 transition-all duration-200 group ${cfg.bg} ${cfg.border} hover:shadow-md hover:border-opacity-60`}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${cfg.color} flex items-center justify-center`}>
                            <Icon className="w-5 h-5 text-white" />
                          </div>
                          <ChevronRight className={`w-5 h-5 ${cfg.text} opacity-0 group-hover:opacity-100 transition-opacity`} />
                        </div>
                        <h3 className="font-semibold text-[#2D3A2D] text-sm mb-1 leading-snug">{vt.display_name}</h3>
                        <p className="text-xs text-[#5A6B5A] leading-relaxed line-clamp-2">{vt.description}</p>
                        <div className="flex items-center gap-2 mt-3 flex-wrap">
                          {vt.requires_lab && (
                            <span className="text-[10px] bg-yellow-100 text-yellow-700 rounded-full px-2 py-0.5 font-medium flex items-center gap-1">
                              <FlaskConical className="w-3 h-3" /> Lab Required
                            </span>
                          )}
                          {vt.requires_photo && (
                            <span className="text-[10px] bg-blue-100 text-blue-700 rounded-full px-2 py-0.5 font-medium flex items-center gap-1">
                              <Camera className="w-3 h-3" /> Photo Required
                            </span>
                          )}
                          <span className="text-[10px] text-gray-400 ml-auto">
                            Follow-up every {vt.follow_up_months}mo
                          </span>
                        </div>
                        <div className="mt-3 pt-3 border-t border-black/5">
                          <span className={`text-xs font-semibold ${cfg.text} flex items-center gap-1`}>
                            Start Visit <ArrowRight className="w-3 h-3" />
                          </span>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              );
            })}
            {Object.keys(grouped).length === 0 && (
              <div className="text-center py-20">
                <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-[#5A6B5A]">No visit types found for "{search}"</p>
                <button onClick={() => setSearch('')} className="text-[#4A6741] text-sm mt-2 underline">Clear search</button>
              </div>
            )}
          </div>
        )}

        {/* Trust badges */}
        <div className="mt-16 bg-[#F5F0E8] rounded-3xl p-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { icon: '🏥', title: 'Licensed Providers', desc: 'Board-certified physicians & NPs' },
            { icon: '⚡', title: 'Fast Turnaround', desc: 'Review within 24 hours' },
            { icon: '🔒', title: 'HIPAA Compliant', desc: 'Your data is always secure' },
            { icon: '💊', title: 'Partner Pharmacies', desc: 'Compounding & retail nationwide' },
          ].map((item, i) => (
            <div key={i}>
              <div className="text-3xl mb-2">{item.icon}</div>
              <p className="font-semibold text-[#2D3A2D] text-sm">{item.title}</p>
              <p className="text-xs text-[#5A6B5A]">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}