import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── MR BRAND COLORS ──────────────────────────────────────────────────────────
const MR_GREEN = '#2D3A2D';
const MR_SAGE = '#4A6741';
const MR_LIGHT = '#A8C99B';

// ─── SVG PRODUCT ILLUSTRATIONS ────────────────────────────────────────────────

// Injectable Vial — glass pharmaceutical vial with MR label
function VialSVG({ color = '#A8C99B', label = 'MR', liquidColor = '#7CB87C', size = 200 }) {
  return (
    <svg width={size} height={size * 1.4} viewBox="0 0 120 168" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Shadow */}
      <ellipse cx="60" cy="162" rx="28" ry="5" fill="black" fillOpacity="0.08"/>
      
      {/* Cap */}
      <rect x="38" y="8" width="44" height="18" rx="4" fill={MR_GREEN}/>
      <rect x="42" y="4" width="36" height="10" rx="3" fill="#3D4D3D"/>
      
      {/* Cap highlight */}
      <rect x="44" y="6" width="12" height="6" rx="2" fill="white" fillOpacity="0.15"/>
      
      {/* Crimped neck */}
      <rect x="44" y="24" width="32" height="8" rx="2" fill="#C0C8C0"/>
      <rect x="46" y="25" width="28" height="2" fill="white" fillOpacity="0.3"/>
      
      {/* Glass body */}
      <rect x="36" y="30" width="48" height="110" rx="6" fill="white" fillOpacity="0.12" stroke="#D8E0D8" strokeWidth="1.5"/>
      
      {/* Liquid fill */}
      <rect x="37.5" y="70" width="45" height="69" rx="4" fill={liquidColor} fillOpacity="0.25"/>
      <rect x="37.5" y="68" width="45" height="4" rx="2" fill={liquidColor} fillOpacity="0.4"/>
      
      {/* Glass reflections */}
      <rect x="40" y="34" width="6" height="100" rx="3" fill="white" fillOpacity="0.18"/>
      <rect x="74" y="34" width="3" height="100" rx="1.5" fill="white" fillOpacity="0.08"/>
      
      {/* Label background */}
      <rect x="40" y="42" width="40" height="52" rx="3" fill="white" fillOpacity="0.92"/>
      
      {/* MR Brand Mark on label */}
      <rect x="43" y="45" width="34" height="14" rx="2" fill={MR_GREEN}/>
      <text x="60" y="55.5" textAnchor="middle" dominantBaseline="middle" fill="white" fontSize="8" fontWeight="800" fontFamily="serif" letterSpacing="-0.5">MEDREVOLVE</text>
      
      {/* Drug name */}
      <text x="60" y="68" textAnchor="middle" dominantBaseline="middle" fill={MR_GREEN} fontSize="7.5" fontWeight="700" fontFamily="sans-serif">{label}</text>
      
      {/* "Rx Only" text */}
      <text x="60" y="78" textAnchor="middle" dominantBaseline="middle" fill="#888" fontSize="5.5" fontFamily="sans-serif">Rx Only · Compounded</text>
      
      {/* Dosage line */}
      <rect x="46" y="83" width="28" height="0.8" fill="#DDD"/>
      <text x="60" y="90" textAnchor="middle" dominantBaseline="middle" fill={MR_SAGE} fontSize="5" fontFamily="sans-serif">Licensed Pharmacy</text>
      
      {/* Bottom of vial */}
      <rect x="36" y="138" width="48" height="4" rx="2" fill="#C0C8C0"/>
    </svg>
  );
}

// Auto-Injector Pen — EpiPen / Ozempic style clickable pen
function PenSVG({ color = '#2D3A2D', label = 'MR', size = 200 }) {
  return (
    <svg width={size * 0.55} height={size * 1.6} viewBox="0 0 66 192" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Shadow */}
      <ellipse cx="33" cy="188" rx="18" ry="4" fill="black" fillOpacity="0.08"/>
      
      {/* Needle cap */}
      <rect x="24" y="2" width="18" height="28" rx="6" fill="#E8ECE8"/>
      <rect x="26" y="4" width="14" height="24" rx="5" fill="white" fillOpacity="0.5"/>
      <rect x="29" y="6" width="4" height="18" rx="2" fill="#CCC" fillOpacity="0.6"/>
      
      {/* Body — main pen */}
      <rect x="18" y="28" width="30" height="128" rx="8" fill={color}/>
      
      {/* Body highlight stripe */}
      <rect x="20" y="30" width="8" height="124" rx="4" fill="white" fillOpacity="0.08"/>
      
      {/* Dose window — transparent window showing liquid */}
      <rect x="22" y="54" width="22" height="44" rx="4" fill="white" fillOpacity="0.12" stroke="white" strokeWidth="0.8" strokeOpacity="0.3"/>
      <rect x="24" y="62" width="18" height="28" rx="2" fill="#7CB87C" fillOpacity="0.35"/>
      {/* Scale markings */}
      {[0,1,2,3,4,5].map(i => (
        <rect key={i} x="24" y={64 + i * 5} width="4" height="0.6" fill="white" fillOpacity="0.5"/>
      ))}
      
      {/* MR brand band */}
      <rect x="18" y="103" width="30" height="20" rx="0" fill={MR_SAGE}/>
      <text x="33" y="113.5" textAnchor="middle" dominantBaseline="middle" fill="white" fontSize="5.5" fontWeight="800" fontFamily="sans-serif" letterSpacing="0.5">MEDREVOLVE</text>
      
      {/* Drug label area */}
      <text x="33" y="135" textAnchor="middle" dominantBaseline="middle" fill="white" fontSize="6" fontWeight="700" fontFamily="sans-serif" fillOpacity="0.9">{label}</text>
      <text x="33" y="143" textAnchor="middle" dominantBaseline="middle" fill="white" fontSize="4.5" fontFamily="sans-serif" fillOpacity="0.55">Weekly · Rx Only</text>
      
      {/* Dial / dose knob */}
      <ellipse cx="33" cy="152" rx="12" ry="6" fill="#1A2A1A"/>
      <ellipse cx="33" cy="152" rx="9" ry="4.5" fill="#2D3A2D"/>
      <text x="33" y="152.5" textAnchor="middle" dominantBaseline="middle" fill="white" fontSize="4.5" fontWeight="700">DOSE</text>
      
      {/* Needle tip housing */}
      <rect x="26" y="156" width="14" height="12" rx="4" fill="#E8ECE8"/>
      <rect x="30" y="167" width="6" height="16" rx="3" fill="#CCC"/>
      <rect x="31.5" y="167" width="3" height="16" rx="1.5" fill="#AAA"/>
    </svg>
  );
}

// Tablet / Pill Blister Pack
function TabletSVG({ color = '#4A6741', label = 'MR', size = 200 }) {
  const pills = [
    { x: 32, y: 40 }, { x: 68, y: 40 }, { x: 104, y: 40 },
    { x: 32, y: 76 }, { x: 68, y: 76 }, { x: 104, y: 76 },
    { x: 32, y: 112 }, { x: 68, y: 112 }, { x: 104, y: 112 },
  ];
  return (
    <svg width={size * 1.1} height={size} viewBox="0 0 136 148" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Shadow */}
      <ellipse cx="68" cy="144" rx="48" ry="5" fill="black" fillOpacity="0.08"/>
      
      {/* Blister card backing */}
      <rect x="10" y="20" width="116" height="118" rx="8" fill={color} fillOpacity="0.9"/>
      
      {/* MR label header */}
      <rect x="10" y="20" width="116" height="22" rx="8" fill={MR_GREEN}/>
      <rect x="10" y="30" width="116" height="12" fill={MR_GREEN}/>
      <text x="68" y="31.5" textAnchor="middle" dominantBaseline="middle" fill="white" fontSize="7" fontWeight="800" fontFamily="sans-serif" letterSpacing="1">MEDREVOLVE · {label}</text>
      
      {/* Blister bubbles */}
      {pills.map((p, i) => (
        <g key={i}>
          {/* Foil bubble */}
          <ellipse cx={p.x} cy={p.y} rx="16" ry="12" fill="white" fillOpacity="0.15" stroke="white" strokeWidth="0.5" strokeOpacity="0.3"/>
          {/* Pill inside */}
          <ellipse cx={p.x} cy={p.y} rx="11" ry="8" fill="white" fillOpacity="0.9"/>
          {/* Pill score line */}
          <rect x={p.x - 11} y={p.y - 0.4} width="22" height="0.8" fill={color} fillOpacity="0.4"/>
          {/* Bubble highlight */}
          <ellipse cx={p.x - 3} cy={p.y - 3} rx="4" ry="2.5" fill="white" fillOpacity="0.5" transform={`rotate(-20, ${p.x - 3}, ${p.y - 3})`}/>
        </g>
      ))}
      
      {/* Rx Only stamp */}
      <text x="68" y="136" textAnchor="middle" dominantBaseline="middle" fill="white" fontSize="5.5" fontFamily="sans-serif" fillOpacity="0.7">Rx Only · Compounded at Licensed Pharmacy</text>
    </svg>
  );
}

// Dropper / Oral Liquid Bottle
function DropperSVG({ color = '#3D6B4C', label = 'MR', size = 200 }) {
  return (
    <svg width={size * 0.75} height={size * 1.3} viewBox="0 0 90 156" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Shadow */}
      <ellipse cx="45" cy="152" rx="24" ry="4" fill="black" fillOpacity="0.08"/>
      
      {/* Dropper bulb */}
      <ellipse cx="45" cy="14" rx="14" ry="10" fill={MR_GREEN}/>
      <ellipse cx="45" cy="12" rx="10" ry="7" fill="white" fillOpacity="0.12"/>
      <rect x="40" y="22" width="10" height="8" rx="0" fill={MR_GREEN}/>
      
      {/* Dropper stem */}
      <rect x="43" y="28" width="4" height="16" rx="1" fill="#CCC"/>
      
      {/* Bottle neck */}
      <rect x="36" y="42" width="18" height="12" rx="3" fill="#C0C8C0"/>
      
      {/* Bottle body */}
      <rect x="20" y="52" width="50" height="90" rx="10" fill="white" fillOpacity="0.12" stroke="#C8D0C8" strokeWidth="1.5"/>
      
      {/* Liquid */}
      <rect x="21.5" y="90" width="47" height="51" rx="8" fill={color} fillOpacity="0.3"/>
      <rect x="21.5" y="88" width="47" height="4" rx="2" fill={color} fillOpacity="0.45"/>
      
      {/* Glass reflections */}
      <rect x="24" y="55" width="5" height="82" rx="2.5" fill="white" fillOpacity="0.18"/>
      
      {/* Label */}
      <rect x="25" y="60" width="40" height="54" rx="4" fill="white" fillOpacity="0.92"/>
      <rect x="28" y="63" width="34" height="12" rx="2" fill={MR_GREEN}/>
      <text x="45" y="69.5" textAnchor="middle" dominantBaseline="middle" fill="white" fontSize="5.5" fontWeight="800" fontFamily="sans-serif" letterSpacing="0.3">MEDREVOLVE</text>
      <text x="45" y="82" textAnchor="middle" dominantBaseline="middle" fill={MR_GREEN} fontSize="6.5" fontWeight="700" fontFamily="sans-serif">{label}</text>
      <text x="45" y="91" textAnchor="middle" dominantBaseline="middle" fill="#888" fontSize="4.5" fontFamily="sans-serif">Sublingual Drops</text>
      <rect x="29" y="96" width="22" height="0.8" fill="#DDD"/>
      <text x="45" y="103" textAnchor="middle" dominantBaseline="middle" fill={color} fontSize="4.5" fontFamily="sans-serif">Rx Only · No Needles</text>
      
      {/* Bottom */}
      <rect x="20" y="140" width="50" height="4" rx="2" fill="#C0C8C0"/>
    </svg>
  );
}

// Nasal Spray Bottle
function NasalSpraySVG({ color = '#6B3A8B', label = 'MR', size = 200 }) {
  return (
    <svg width={size * 0.6} height={size * 1.3} viewBox="0 0 72 156" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Shadow */}
      <ellipse cx="36" cy="152" rx="20" ry="4" fill="black" fillOpacity="0.08"/>
      
      {/* Nozzle pump top */}
      <rect x="28" y="2" width="16" height="22" rx="5" fill={MR_GREEN}/>
      <rect x="31" y="4" width="10" height="16" rx="3" fill="white" fillOpacity="0.15"/>
      {/* Nozzle tip */}
      <rect x="33" y="2" width="6" height="6" rx="2" fill="#3D4D3D"/>
      {/* Spray dots */}
      <circle cx="44" cy="5" r="1" fill={MR_LIGHT} fillOpacity="0.6"/>
      <circle cx="47" cy="3" r="0.7" fill={MR_LIGHT} fillOpacity="0.4"/>
      <circle cx="50" cy="6" r="0.5" fill={MR_LIGHT} fillOpacity="0.3"/>
      
      {/* Pump collar */}
      <rect x="24" y="22" width="24" height="10" rx="3" fill="#C0C8C0"/>
      
      {/* Body */}
      <rect x="18" y="30" width="36" height="112" rx="10" fill="white" fillOpacity="0.1" stroke="#C8D0C8" strokeWidth="1.5"/>
      
      {/* Liquid */}
      <rect x="19.5" y="90" width="33" height="51" rx="8" fill={color} fillOpacity="0.25"/>
      
      {/* Glass reflections */}
      <rect x="22" y="33" width="5" height="104" rx="2.5" fill="white" fillOpacity="0.15"/>
      
      {/* Label */}
      <rect x="22" y="38" width="28" height="52" rx="3" fill="white" fillOpacity="0.92"/>
      <rect x="24" y="41" width="24" height="10" rx="2" fill={color}/>
      <text x="36" y="46.5" textAnchor="middle" dominantBaseline="middle" fill="white" fontSize="4.5" fontWeight="800" fontFamily="sans-serif" letterSpacing="0.2">MEDREVOLVE</text>
      <text x="36" y="58" textAnchor="middle" dominantBaseline="middle" fill={MR_GREEN} fontSize="5.5" fontWeight="700" fontFamily="sans-serif">{label}</text>
      <text x="36" y="66" textAnchor="middle" dominantBaseline="middle" fill="#888" fontSize="4" fontFamily="sans-serif">Nasal Spray</text>
      <text x="36" y="74" textAnchor="middle" dominantBaseline="middle" fill={color} fontSize="4" fontFamily="sans-serif">Rx Only</text>
      
      {/* Bottom */}
      <rect x="18" y="140" width="36" height="4" rx="2" fill="#C0C8C0"/>
    </svg>
  );
}

// Topical Cream / Gel Tube
function CreamTubeSVG({ color = '#8B1A6B', label = 'MR', size = 200 }) {
  return (
    <svg width={size * 1.3} height={size * 0.55} viewBox="0 0 156 66" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Shadow */}
      <ellipse cx="78" cy="63" rx="60" ry="4" fill="black" fillOpacity="0.08"/>
      
      {/* Tube cap */}
      <ellipse cx="130" cy="33" rx="16" ry="15" fill={MR_GREEN}/>
      <ellipse cx="130" cy="33" rx="11" ry="10" fill="#3D4D3D"/>
      <ellipse cx="130" cy="33" rx="7" ry="6" fill={MR_GREEN}/>
      
      {/* Tube body */}
      <rect x="14" y="18" width="116" height="30" rx="15" fill={color} fillOpacity="0.9"/>
      
      {/* Tube highlight */}
      <rect x="18" y="20" width="108" height="8" rx="4" fill="white" fillOpacity="0.15"/>
      
      {/* Label white panel */}
      <rect x="22" y="20" width="84" height="26" rx="8" fill="white" fillOpacity="0.92"/>
      
      {/* MR band */}
      <rect x="22" y="20" width="28" height="26" rx="8" fill={MR_GREEN}/>
      <rect x="38" y="20" width="14" height="26" fill={MR_GREEN}/>
      <text x="36" y="33.5" textAnchor="middle" dominantBaseline="middle" fill="white" fontSize="5.5" fontWeight="800" fontFamily="serif" letterSpacing="-0.3">MR</text>
      
      {/* Drug info */}
      <text x="85" y="28" textAnchor="middle" dominantBaseline="middle" fill={MR_GREEN} fontSize="6.5" fontWeight="700" fontFamily="sans-serif">{label}</text>
      <text x="85" y="38" textAnchor="middle" dominantBaseline="middle" fill="#888" fontSize="4.5" fontFamily="sans-serif">Compounded · Topical · Rx Only</text>
      
      {/* Crimp end */}
      <rect x="8" y="22" width="10" height="22" rx="2" fill="#C0C8C0"/>
      <rect x="8" y="26" width="10" height="2" fill="white" fillOpacity="0.4"/>
      <rect x="8" y="30" width="10" height="2" fill="white" fillOpacity="0.4"/>
      <rect x="8" y="34" width="10" height="2" fill="white" fillOpacity="0.4"/>
    </svg>
  );
}

// ─── PRODUCT FORM → COMPONENT MAP ─────────────────────────────────────────────
const FORM_COMPONENTS = {
  'Injectable Vial': VialSVG,
  'Auto-Injector Pen': PenSVG,
  'Oral Tablet': TabletSVG,
  'Oral Capsule': TabletSVG,
  'Oral Drops': DropperSVG,
  'Nasal Spray': NasalSpraySVG,
  'Topical Cream': CreamTubeSVG,
  'Cream / Tablet': CreamTubeSVG,
  'Oral Tablet + Topical': TabletSVG,
};

// ─── CYCLING VIEWS for each product ─────────────────────────────────────────
// Each product cycles through: product shot → lifestyle → clinical info
const CYCLE_FRAMES = [
  { key: 'product', label: 'Product' },
  { key: 'lifestyle', label: 'Lifestyle' },
  { key: 'clinical', label: 'Clinical' },
];

// Color accent per form type
const FORM_COLORS = {
  'Injectable Vial': { liquid: '#7CB87C', accent: '#4A6741' },
  'Auto-Injector Pen': { liquid: '#2D3A2D', accent: '#4A6741' },
  'Oral Tablet': { liquid: '#6B4A8B', accent: '#6B4A8B' },
  'Oral Capsule': { liquid: '#6B4A8B', accent: '#6B4A8B' },
  'Oral Drops': { liquid: '#3D6B4C', accent: '#2D6B4C' },
  'Nasal Spray': { liquid: '#6B3A8B', accent: '#6B3A8B' },
  'Topical Cream': { liquid: '#8B1A6B', accent: '#8B1A6B' },
  'Cream / Tablet': { liquid: '#8B1A6B', accent: '#8B1A6B' },
  'Oral Tablet + Topical': { liquid: '#1A6B3A', accent: '#1A6B3A' },
};

// Clinical frame — elegant data card view
function ClinicalFrame({ product }) {
  const lines = [
    { label: 'Mechanism', value: product.subtitle },
    { label: 'Form', value: product.form },
    { label: 'Frequency', value: product.form?.includes('Daily') || product.form?.includes('Oral') ? 'Daily' : 'Weekly' },
    { label: 'Pharmacy', value: 'Compounded Rx' },
    { label: 'Provider', value: 'Board Certified MD/NP' },
  ];
  return (
    <div className="w-full h-full flex flex-col justify-center px-5 py-4 bg-gradient-to-br from-[#1A2A1A] to-[#0F1A0F]">
      <p className="text-[9px] font-bold tracking-[0.25em] uppercase text-[#A8C99B] mb-3">Clinical Profile</p>
      <h3 className="text-white font-bold text-lg leading-tight mb-4">{product.name}</h3>
      <div className="space-y-2">
        {lines.map((l, i) => (
          <div key={i} className="flex items-baseline justify-between">
            <span className="text-white/40 text-[10px] uppercase tracking-wider">{l.label}</span>
            <span className="text-white/90 text-[11px] font-medium text-right max-w-[55%]">{l.value}</span>
          </div>
        ))}
      </div>
      <div className="mt-4 pt-3 border-t border-white/10">
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-[#A8C99B]" />
          <span className="text-[10px] text-[#A8C99B] font-semibold">Rx — Physician Supervised</span>
        </div>
      </div>
    </div>
  );
}

// Main exported component
export default function RxProductVisual({ product, size = 'md', autoPlay = true, className = '' }) {
  const [frame, setFrame] = useState(0); // 0=product, 1=lifestyle, 2=clinical
  const [isHovered, setIsHovered] = useState(false);

  const sizeMap = { sm: 100, md: 140, lg: 180 };
  const svgSize = sizeMap[size] || 140;

  // Auto-cycle through frames
  useEffect(() => {
    if (!autoPlay || isHovered) return;
    const t = setInterval(() => {
      setFrame(f => (f + 1) % 3);
    }, 3200);
    return () => clearInterval(t);
  }, [autoPlay, isHovered]);

  const formKey = product.form || 'Injectable Vial';
  const VisualComponent = FORM_COMPONENTS[formKey] || VialSVG;
  const colors = FORM_COLORS[formKey] || FORM_COLORS['Injectable Vial'];
  
  // Short drug label for SVG (max ~12 chars)
  const shortLabel = product.name.length > 12 ? product.name.split(' ')[0] : product.name;

  return (
    <div
      className={`relative w-full h-full flex flex-col overflow-hidden ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <AnimatePresence mode="wait">
        {/* FRAME 0 — Branded Product Illustration */}
        {frame === 0 && (
          <motion.div
            key="product"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.03 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 flex items-center justify-center"
            style={{ background: `radial-gradient(ellipse at center, ${colors.accent}18 0%, transparent 70%)` }}
          >
            {/* Subtle grid */}
            <div className="absolute inset-0 opacity-[0.04]" style={{
              backgroundImage: 'linear-gradient(#2D3A2D 1px, transparent 1px), linear-gradient(90deg, #2D3A2D 1px, transparent 1px)',
              backgroundSize: '20px 20px'
            }}/>
            
            {/* Product SVG with floating animation */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="relative z-10 flex items-center justify-center"
            >
              <VisualComponent
                color={colors.liquid}
                label={shortLabel}
                liquidColor={colors.liquid}
                size={svgSize}
              />
            </motion.div>

            {/* Glow behind product */}
            <div
              className="absolute inset-x-[20%] bottom-[10%] h-[40%] blur-3xl rounded-full opacity-20"
              style={{ background: colors.accent }}
            />
          </motion.div>
        )}

        {/* FRAME 1 — Lifestyle Photo */}
        {frame === 1 && (
          <motion.div
            key="lifestyle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0"
          >
            <img
              src={product.lifestyle}
              alt={product.name}
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            {/* MR watermark */}
            <div className="absolute bottom-3 right-3">
              <div className="w-7 h-7 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/20">
                <span className="text-white font-black text-[9px] tracking-tighter">MR</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* FRAME 2 — Clinical Info Card */}
        {frame === 2 && (
          <motion.div
            key="clinical"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.45 }}
            className="absolute inset-0"
          >
            <ClinicalFrame product={product} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Frame indicator dots — bottom center */}
      <div className="absolute bottom-2 left-0 right-0 flex items-center justify-center gap-1 z-20">
        {CYCLE_FRAMES.map((f, i) => (
          <button
            key={f.key}
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setFrame(i); }}
            className={`transition-all duration-300 rounded-full ${
              i === frame ? 'bg-white w-4 h-1' : 'bg-white/30 w-1 h-1 hover:bg-white/60'
            }`}
          />
        ))}
      </div>
    </div>
  );
}