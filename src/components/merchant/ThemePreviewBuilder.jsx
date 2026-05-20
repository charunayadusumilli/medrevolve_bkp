import React, { useState } from 'react';
import { ShieldCheck, Stethoscope, FlaskConical, Star, CheckCircle } from 'lucide-react';

const THEMES = [
  { id: 'clean_white', label: 'Clean Medical', bg: '#FFFFFF', accent: '#4A6741', text: '#1a1a1a', subtext: '#666' },
  { id: 'dark_clinical', label: 'Dark Clinical', bg: '#0D0F0D', accent: '#6B8F5E', text: '#FFFFFF', subtext: 'rgba(255,255,255,0.5)' },
  { id: 'luxury_black', label: 'Luxury Black', bg: '#111111', accent: '#C9A84C', text: '#FFFFFF', subtext: 'rgba(255,255,255,0.4)' },
  { id: 'ocean_blue', label: 'Ocean Blue', bg: '#0A1628', accent: '#3B82F6', text: '#FFFFFF', subtext: 'rgba(255,255,255,0.5)' },
  { id: 'warm_earth', label: 'Warm Earth', bg: '#FBF8F3', accent: '#B45309', text: '#1c1006', subtext: '#6b5c40' },
];

export default function ThemePreviewBuilder({ mode }) {
  const [brandName, setBrandName] = useState('');
  const [selectedTheme, setSelectedTheme] = useState(THEMES[0]);

  const displayName = brandName.trim() || 'Your Brand';
  const isGLP = mode === 'glp';
  const isDark = selectedTheme.bg.startsWith('#0') || selectedTheme.bg.startsWith('#1') || selectedTheme.bg === '#111111';

  return (
    <div className="grid lg:grid-cols-2 gap-8 items-start">
      {/* Controls */}
      <div className="space-y-6">
        <div>
          <label className="text-white/50 text-xs uppercase tracking-widest block mb-2">Your Brand Name</label>
          <input
            type="text"
            value={brandName}
            onChange={e => setBrandName(e.target.value)}
            placeholder="e.g. Elite Wellness Co."
            maxLength={32}
            className="w-full bg-white/[0.06] border border-white/15 rounded-lg px-4 py-3 text-white placeholder:text-white/25 text-sm focus:outline-none focus:border-white/40 transition-colors"
          />
        </div>
        <div>
          <label className="text-white/50 text-xs uppercase tracking-widest block mb-3">Site Theme</label>
          <div className="grid grid-cols-5 gap-2">
            {THEMES.map(t => (
              <button
                key={t.id}
                onClick={() => setSelectedTheme(t)}
                className={`flex flex-col items-center gap-1.5 p-2 rounded-lg border transition-all ${
                  selectedTheme.id === t.id ? 'border-white/50 bg-white/10' : 'border-white/10 hover:border-white/25'
                }`}
              >
                <div
                  className="w-8 h-8 rounded-md border border-white/15 flex-shrink-0"
                  style={{ background: t.bg, borderColor: t.accent }}
                >
                  <div className="w-full h-2 rounded-t-md" style={{ background: t.accent }} />
                </div>
                <span className="text-[9px] text-white/50 text-center leading-tight">{t.label}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="bg-white/[0.04] border border-white/10 rounded-xl p-4 text-xs text-white/40 space-y-1.5">
          <p className="text-white/60 font-semibold text-xs mb-2">What you get on your real site:</p>
          {[
            'Custom domain (yourname.com or .medrevolve.co)',
            isGLP ? '503A/B pharmacy integration + telehealth' : 'COA documentation + age gate enforcement',
            'Auto-generated product pages from approved catalog',
            'Mobile-optimized checkout with high-risk processing',
            'Patient/customer intake flow + portal',
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-2">
              <CheckCircle className="w-3 h-3 text-[#6B8F5E] flex-shrink-0 mt-0.5" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Live Preview */}
      <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl" style={{ background: selectedTheme.bg }}>
        {/* Nav */}
        <div
          className="px-5 py-3 flex items-center justify-between border-b"
          style={{ borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' }}
        >
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded flex items-center justify-center text-[9px] font-black" style={{ background: selectedTheme.accent, color: '#fff' }}>
              {displayName.charAt(0)}
            </div>
            <span className="text-xs font-bold" style={{ color: selectedTheme.text }}>{displayName}</span>
          </div>
          <div className="flex gap-3">
            {['Products', 'About', 'Contact'].map(l => (
              <span key={l} className="text-[10px]" style={{ color: selectedTheme.subtext }}>{l}</span>
            ))}
            <span className="text-[9px] font-bold px-2 py-0.5 rounded-full" style={{ background: selectedTheme.accent, color: '#fff' }}>
              {isGLP ? 'Start Today' : 'Order'}
            </span>
          </div>
        </div>

        {/* Hero */}
        <div className="px-5 py-6 text-center">
          {!isGLP && (
            <div className="text-[9px] font-bold px-2 py-1 rounded bg-red-900/30 border border-red-500/25 text-red-400 mb-3 inline-block">
              FOR RESEARCH USE ONLY
            </div>
          )}
          <h3 className="font-black text-lg mb-1 leading-tight" style={{ color: selectedTheme.text }}>
            {isGLP ? `Transform Your Health` : `Research-Grade Compounds`}
          </h3>
          <p className="text-[11px] mb-4 leading-relaxed" style={{ color: selectedTheme.subtext }}>
            {isGLP
              ? `Physician-prescribed programs from ${displayName}. Licensed providers. 24-48hr delivery.`
              : `HPLC-certified research peptides. COA included. Institutional access.`}
          </p>
          {isGLP ? (
            <div className="flex gap-1.5 justify-center flex-wrap mb-4">
              {['503A/B Pharmacy', 'Licensed MDs', 'HIPAA'].map(b => (
                <span key={b} className="text-[9px] px-2 py-0.5 rounded-full border" style={{ color: selectedTheme.subtext, borderColor: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)' }}>
                  <ShieldCheck className="w-2.5 h-2.5 inline mr-0.5" style={{ color: selectedTheme.accent }} />{b}
                </span>
              ))}
            </div>
          ) : null}

          {/* Mock product card */}
          <div
            className="rounded-xl p-3 text-left mt-2 border"
            style={{
              background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
              borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
            }}
          >
            <div className="flex items-start justify-between mb-1">
              <p className="text-[11px] font-bold" style={{ color: selectedTheme.text }}>
                {isGLP ? 'Semaglutide Weight Program' : 'BPC-157 (5mg)'}
              </p>
              <span className="text-[8px] font-bold px-1.5 py-0.5 rounded" style={{ background: selectedTheme.accent, color: '#fff' }}>
                {isGLP ? 'Rx Only' : 'RUO'}
              </span>
            </div>
            <p className="text-[9px] mb-2" style={{ color: selectedTheme.subtext }}>
              {isGLP ? 'Weekly injection · Provider supervised' : 'CAS 137525-51-0 · Purity ≥99.2%'}
            </p>
            <div className="flex items-center justify-between">
              <span className="text-sm font-black" style={{ color: selectedTheme.text }}>
                {isGLP ? '$299/mo' : '$89/vial'}
              </span>
              <span
                className="text-[9px] px-2 py-1 rounded font-bold"
                style={{ background: selectedTheme.accent, color: '#fff' }}
              >
                {isGLP ? 'Start Consult' : 'Order (Inst.)'}
              </span>
            </div>
          </div>
        </div>

        {/* Footer strip */}
        <div className="px-5 py-2 text-center" style={{ background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.04)' }}>
          <p className="text-[8px]" style={{ color: selectedTheme.subtext }}>
            Powered by {displayName} · Built on MedRevolve OS
          </p>
        </div>
      </div>
    </div>
  );
}