import React from 'react';
import { motion } from 'framer-motion';

// Cartoon-style 3D-inspired SVG avatars — MedRevolve branded tops
// All figures wear MedRevolve green (#2D3A2D) branded tops with "MR" logo

const FIGURE_CONFIGS = {
  wellness_concierge:       { type: 'female', skinTone: '#FDDBB4', hairColor: '#5C3D2E', eyeColor: '#6B4226', blush: '#F4A0A0', topAccent: '#A8C99B' },
  treatment_advisor:        { type: 'male',   skinTone: '#D4956B', hairColor: '#2D1F14', eyeColor: '#8B5A2B', blush: '#D4856B', topAccent: '#5A9E84' },
  consultation_coordinator: { type: 'female', skinTone: '#F5C8A0', hairColor: '#1A1A1A', eyeColor: '#2D1F14', blush: '#F9B8B8', topAccent: '#BFDBFE' },
  patient_support:          { type: 'female', skinTone: '#C8845C', hairColor: '#3D2B1F', eyeColor: '#6B3A1F', blush: '#C87060', topAccent: '#BAE6FD' },
  onboarding_guide:         { type: 'male',   skinTone: '#FDDBB4', hairColor: '#5C3D2E', eyeColor: '#5C3D2E', blush: '#F4B8A0', topAccent: '#6EE7B7' },
  creator_manager:          { type: 'female', skinTone: '#F5C8A0', hairColor: '#7C3D1A', eyeColor: '#8B4513', blush: '#F9A8C0', topAccent: '#C4B5FD' },
  partner_manager:          { type: 'male',   skinTone: '#D4956B', hairColor: '#2D1F14', eyeColor: '#8B5A2B', blush: '#D4856B', topAccent: '#FDE68A' },
  enterprise_advisor:       { type: 'male',   skinTone: '#FDDBB4', hairColor: '#1A1A1A', eyeColor: '#2D1F14', blush: '#F4B8A0', topAccent: '#FCD34D' },
  provider_onboarding:      { type: 'male',   skinTone: '#C8845C', hairColor: '#2D1F14', eyeColor: '#6B3A1F', blush: '#C87060', topAccent: '#99F6E4' },
  provider_support:         { type: 'female', skinTone: '#FDDBB4', hairColor: '#1A1A1A', eyeColor: '#2D1F14', blush: '#F4B8A0', topAccent: '#99F6E4' },
  pharmacy_coordinator:     { type: 'female', skinTone: '#F5C8A0', hairColor: '#4A3728', eyeColor: '#5C3D2E', blush: '#F9B8B8', topAccent: '#C7D2FE' },
  ops_advisor:              { type: 'male',   skinTone: '#D4956B', hairColor: '#1A1A1A', eyeColor: '#2D1F14', blush: '#D4856B', topAccent: '#9CA3AF' },
  compliance_specialist:    { type: 'female', skinTone: '#C8845C', hairColor: '#2D1F14', eyeColor: '#6B3A1F', blush: '#C87060', topAccent: '#FCA5A5' },
};

// MedRevolve branded top — dark forest green with MR logo
function MRTop({ clothColor = '#2D3A2D', accentColor, isFemale, size }) {
  const s = size === 'lg' ? 1.4 : size === 'sm' ? 0.7 : 1;
  if (isFemale) {
    return (
      <>
        {/* Fitted crop top */}
        <path d="M22 52 Q28 48 40 49 Q52 48 58 52 L56 72 Q40 76 24 72 Z" fill={clothColor} />
        {/* Top highlight sheen */}
        <path d="M28 50 Q34 48 40 49 Q33 54 28 55 Z" fill="rgba(255,255,255,0.12)" />
        {/* V-neck */}
        <path d="M34 50 L40 56 L46 50" stroke={accentColor} strokeWidth="1.2" fill={clothColor} strokeLinejoin="round" />
        {/* MR logo on chest */}
        <text x="37" y="65" fontSize="5.5" fontWeight="bold" fill="white" fontFamily="Arial, sans-serif" opacity="0.9">MR</text>
        {/* Subtle side seams */}
        <line x1="28" y1="52" x2="26" y2="70" stroke="rgba(0,0,0,0.15)" strokeWidth="0.6" />
        <line x1="52" y1="52" x2="54" y2="70" stroke="rgba(0,0,0,0.15)" strokeWidth="0.6" />
      </>
    );
  }
  return (
    <>
      {/* Athletic shirt */}
      <path d="M20 52 Q26 47 40 48 Q54 47 60 52 L58 74 Q40 78 22 74 Z" fill={clothColor} />
      {/* Shirt highlight */}
      <path d="M26 49 Q33 47 40 48 Q33 54 26 55 Z" fill="rgba(255,255,255,0.12)" />
      {/* Collar */}
      <path d="M33 49 L40 54 L47 49" stroke={accentColor} strokeWidth="1.4" fill={clothColor} strokeLinejoin="round" />
      {/* MR logo */}
      <text x="36" y="66" fontSize="5.5" fontWeight="bold" fill="white" fontFamily="Arial, sans-serif" opacity="0.9">MR</text>
      {/* Side seams */}
      <line x1="26" y1="52" x2="24" y2="72" stroke="rgba(0,0,0,0.15)" strokeWidth="0.7" />
      <line x1="54" y1="52" x2="56" y2="72" stroke="rgba(0,0,0,0.15)" strokeWidth="0.7" />
    </>
  );
}

function FemaleFigure({ skin, hair, eye, blush, accent, size }) {
  const s = size === 'lg' ? 1.4 : size === 'sm' ? 0.65 : 1;
  const w = 80 * s, h = 120 * s;
  return (
    <svg viewBox="0 0 80 120" fill="none" xmlns="http://www.w3.org/2000/svg"
      style={{ width: w, height: h, display: 'block' }}>
      {/* Drop shadow for grounding */}
      <ellipse cx="40" cy="117" rx="14" ry="3" fill="rgba(0,0,0,0.12)" />

      {/* ==== HAIR BACK LAYER ==== */}
      <ellipse cx="40" cy="34" rx="17" ry="20" fill={hair} />
      {/* Long hair draping */}
      <path d="M24 38 Q18 55 20 70" stroke={hair} strokeWidth="6" strokeLinecap="round" fill="none" />
      <path d="M56 38 Q62 55 60 70" stroke={hair} strokeWidth="6" strokeLinecap="round" fill="none" />

      {/* ==== NECK ==== */}
      <rect x="36" y="50" width="8" height="8" rx="4" fill={skin} />

      {/* ==== BODY ==== */}
      <MRTop clothColor="#2D3A2D" accentColor={accent} isFemale={true} />
      {/* Arms */}
      <path d="M22 54 Q12 62 14 76" stroke="#2D3A2D" strokeWidth="8" strokeLinecap="round" fill="none" />
      <path d="M58 54 Q68 62 66 76" stroke="#2D3A2D" strokeWidth="8" strokeLinecap="round" fill="none" />
      {/* Hands */}
      <ellipse cx="14" cy="77" rx="4.5" ry="3.5" fill={skin} />
      <ellipse cx="66" cy="77" rx="4.5" ry="3.5" fill={skin} />
      {/* Fingers hint */}
      <path d="M11 76 Q12 73 14 74" stroke={skin} strokeWidth="1.2" strokeLinecap="round" fill="none" />
      <path d="M67 76 Q68 73 66 74" stroke={skin} strokeWidth="1.2" strokeLinecap="round" fill="none" />

      {/* Pants/Leggings */}
      <path d="M24 72 Q30 80 40 81 Q50 80 56 72 Z" fill="#1D2A1D" />
      {/* Legs */}
      <rect x="28" y="79" width="10" height="22" rx="5" fill={skin} />
      <rect x="42" y="79" width="10" height="22" rx="5" fill={skin} />
      {/* Shoes */}
      <ellipse cx="33" cy="102" rx="6.5" ry="3" fill="#3D2B1F" />
      <ellipse cx="47" cy="102" rx="6.5" ry="3" fill="#3D2B1F" />
      {/* Shoe highlight */}
      <ellipse cx="31" cy="101" rx="2.5" ry="1" fill="rgba(255,255,255,0.2)" />
      <ellipse cx="45" cy="101" rx="2.5" ry="1" fill="rgba(255,255,255,0.2)" />

      {/* ==== HEAD ==== */}
      {/* Head base */}
      <ellipse cx="40" cy="33" rx="15" ry="16.5" fill={skin} />
      {/* Cheek shading */}
      <ellipse cx="28" cy="36" rx="5" ry="4" fill="rgba(0,0,0,0.04)" />
      <ellipse cx="52" cy="36" rx="5" ry="4" fill="rgba(0,0,0,0.04)" />
      {/* Blush */}
      <ellipse cx="27" cy="37" rx="4.5" ry="3" fill={blush} opacity="0.35" />
      <ellipse cx="53" cy="37" rx="4.5" ry="3" fill={blush} opacity="0.35" />
      {/* Head highlight */}
      <ellipse cx="36" cy="24" rx="5" ry="4" fill="rgba(255,255,255,0.18)" />

      {/* ==== HAIR FRONT ==== */}
      {/* Top bun */}
      <ellipse cx="40" cy="19" rx="11" ry="8" fill={hair} />
      <ellipse cx="40" cy="13" rx="7" ry="6" fill={hair} />
      {/* Bun highlight */}
      <ellipse cx="37" cy="11" rx="2.5" ry="2" fill="rgba(255,255,255,0.18)" />
      {/* Side wisps */}
      <ellipse cx="25" cy="30" rx="3" ry="7" fill={hair} />
      <ellipse cx="55" cy="30" rx="3" ry="7" fill={hair} />
      {/* Hairline fringe */}
      <path d="M29 22 Q35 18 40 20 Q45 18 51 22" stroke={hair} strokeWidth="3.5" strokeLinecap="round" fill="none" />

      {/* ==== EYES ==== */}
      {/* Left eye */}
      <ellipse cx="33" cy="33" rx="5.5" ry="5.8" fill="white" />
      <ellipse cx="33" cy="34" rx="3.8" ry="4" fill={eye} />
      <ellipse cx="33" cy="34" rx="2.2" ry="2.4" fill="#1A1A1A" />
      <ellipse cx="34.5" cy="32.5" rx="1.2" ry="1.2" fill="white" />
      <ellipse cx="32" cy="35.5" rx="0.5" ry="0.5" fill="rgba(255,255,255,0.6)" />
      {/* Left eyelid shadow */}
      <path d="M28 31 Q33 28 38 31" stroke="#2D1F14" strokeWidth="1.4" strokeLinecap="round" fill="none" opacity="0.7" />
      {/* Left lashes */}
      <path d="M28 31 Q27 29 26.5 28" stroke="#1A1A1A" strokeWidth="1" strokeLinecap="round" fill="none" />
      <path d="M30 29.5 Q30 27.5 30 26.5" stroke="#1A1A1A" strokeWidth="1" strokeLinecap="round" fill="none" />
      <path d="M33 28.5 Q33 26.5 33 25.5" stroke="#1A1A1A" strokeWidth="1" strokeLinecap="round" fill="none" />
      <path d="M36 29.5 Q36.5 27.5 37 26.5" stroke="#1A1A1A" strokeWidth="1" strokeLinecap="round" fill="none" />
      {/* Left eyebrow */}
      <path d="M28 28 Q33 25.5 38 27" stroke={hair} strokeWidth="1.5" strokeLinecap="round" fill="none" />

      {/* Right eye */}
      <ellipse cx="47" cy="33" rx="5.5" ry="5.8" fill="white" />
      <ellipse cx="47" cy="34" rx="3.8" ry="4" fill={eye} />
      <ellipse cx="47" cy="34" rx="2.2" ry="2.4" fill="#1A1A1A" />
      <ellipse cx="48.5" cy="32.5" rx="1.2" ry="1.2" fill="white" />
      <ellipse cx="46" cy="35.5" rx="0.5" ry="0.5" fill="rgba(255,255,255,0.6)" />
      {/* Right eyelid shadow */}
      <path d="M42 31 Q47 28 52 31" stroke="#2D1F14" strokeWidth="1.4" strokeLinecap="round" fill="none" opacity="0.7" />
      {/* Right lashes */}
      <path d="M42 31 Q41 29 40.5 28" stroke="#1A1A1A" strokeWidth="1" strokeLinecap="round" fill="none" />
      <path d="M44 29.5 Q44 27.5 44 26.5" stroke="#1A1A1A" strokeWidth="1" strokeLinecap="round" fill="none" />
      <path d="M47 28.5 Q47 26.5 47 25.5" stroke="#1A1A1A" strokeWidth="1" strokeLinecap="round" fill="none" />
      <path d="M50 29.5 Q50.5 27.5 51 26.5" stroke="#1A1A1A" strokeWidth="1" strokeLinecap="round" fill="none" />
      {/* Right eyebrow */}
      <path d="M42 28 Q47 25.5 52 27" stroke={hair} strokeWidth="1.5" strokeLinecap="round" fill="none" />

      {/* ==== NOSE ==== */}
      <path d="M39 38 Q40 40 41 38" stroke="rgba(0,0,0,0.2)" strokeWidth="1" strokeLinecap="round" fill="none" />
      {/* Nose bridge shadow */}
      <path d="M38 33 Q38.5 37 39 38" stroke="rgba(0,0,0,0.1)" strokeWidth="1" strokeLinecap="round" fill="none" />

      {/* ==== SMILE ==== */}
      <path d="M34 42 Q37 45.5 40 44.5 Q43 45.5 46 42" stroke="#C47B6A" strokeWidth="1.4" strokeLinecap="round" fill="none" />
      {/* Smile dimples */}
      <path d="M34 42 Q33 42.5 33 43.5" stroke="#D4956B" strokeWidth="0.8" strokeLinecap="round" fill="none" opacity="0.6" />
      <path d="M46 42 Q47 42.5 47 43.5" stroke="#D4956B" strokeWidth="0.8" strokeLinecap="round" fill="none" opacity="0.6" />
      {/* Lower lip */}
      <path d="M36 44.5 Q40 47 44 44.5" stroke="rgba(0,0,0,0.1)" strokeWidth="0.8" strokeLinecap="round" fill="none" />
      {/* Teeth hint */}
      <path d="M35.5 43.5 Q40 46 44.5 43.5" fill="rgba(255,255,255,0.5)" stroke="none" />
    </svg>
  );
}

function MaleFigure({ skin, hair, eye, blush, accent, size }) {
  const s = size === 'lg' ? 1.4 : size === 'sm' ? 0.65 : 1;
  const w = 80 * s, h = 120 * s;
  return (
    <svg viewBox="0 0 80 120" fill="none" xmlns="http://www.w3.org/2000/svg"
      style={{ width: w, height: h, display: 'block' }}>
      {/* Shadow */}
      <ellipse cx="40" cy="117" rx="16" ry="3" fill="rgba(0,0,0,0.12)" />

      {/* ==== NECK ==== */}
      <rect x="35" y="49" width="10" height="9" rx="5" fill={skin} />

      {/* ==== BODY ==== */}
      <MRTop clothColor="#2D3A2D" accentColor={accent} isFemale={false} />
      {/* Arms */}
      <path d="M20 55 Q9 64 11 78" stroke="#2D3A2D" strokeWidth="9" strokeLinecap="round" fill="none" />
      <path d="M60 55 Q71 64 69 78" stroke="#2D3A2D" strokeWidth="9" strokeLinecap="round" fill="none" />
      {/* Hands */}
      <ellipse cx="11" cy="79" rx="5" ry="4" fill={skin} />
      <ellipse cx="69" cy="79" rx="5" ry="4" fill={skin} />

      {/* Pants */}
      <path d="M22 74 Q30 83 40 83 Q50 83 58 74 Z" fill="#1D2A1D" />
      {/* Legs */}
      <rect x="26" y="81" width="12" height="24" rx="6" fill="#1D2A1D" opacity="0.8" />
      <rect x="42" y="81" width="12" height="24" rx="6" fill="#1D2A1D" opacity="0.8" />
      {/* Shoes */}
      <ellipse cx="32" cy="106" rx="7.5" ry="3" fill="#1A1A1A" />
      <ellipse cx="48" cy="106" rx="7.5" ry="3" fill="#1A1A1A" />
      <ellipse cx="30" cy="104.5" rx="3" ry="1.2" fill="rgba(255,255,255,0.18)" />
      <ellipse cx="46" cy="104.5" rx="3" ry="1.2" fill="rgba(255,255,255,0.18)" />

      {/* ==== HEAD ==== */}
      {/* Hair (back) */}
      <ellipse cx="40" cy="30" rx="16" ry="17" fill={hair} />
      {/* Head */}
      <ellipse cx="40" cy="32" rx="14.5" ry="16" fill={skin} />
      {/* Jaw squareness */}
      <path d="M27 40 Q28 48 32 50 Q36 52 40 52 Q44 52 48 50 Q52 48 53 40" fill={skin} stroke="none" />
      {/* Cheek shading */}
      <ellipse cx="28" cy="38" rx="5" ry="4" fill="rgba(0,0,0,0.05)" />
      <ellipse cx="52" cy="38" rx="5" ry="4" fill="rgba(0,0,0,0.05)" />
      {/* Blush (subtle on male) */}
      <ellipse cx="27" cy="39" rx="4" ry="2.5" fill={blush} opacity="0.2" />
      <ellipse cx="53" cy="39" rx="4" ry="2.5" fill={blush} opacity="0.2" />
      {/* Head highlight */}
      <ellipse cx="36" cy="23" rx="5" ry="4.5" fill="rgba(255,255,255,0.15)" />

      {/* ==== HAIR FRONT ==== */}
      <ellipse cx="40" cy="18" rx="14.5" ry="7" fill={hair} />
      <rect x="25.5" y="17" width="29" height="8" fill={hair} />
      {/* Side part / texture */}
      <path d="M27 19 Q34 15 40 17 Q46 15 53 19" stroke={hair} strokeWidth="4" strokeLinecap="round" fill="none" />
      {/* Hair highlight */}
      <path d="M33 16 Q38 14 43 16" stroke="rgba(255,255,255,0.2)" strokeWidth="2" strokeLinecap="round" fill="none" />

      {/* ==== EYES ==== */}
      {/* Left eye */}
      <ellipse cx="33" cy="33" rx="5.2" ry="5.5" fill="white" />
      <ellipse cx="33" cy="33.8" rx="3.6" ry="3.8" fill={eye} />
      <ellipse cx="33" cy="33.8" rx="2" ry="2.2" fill="#1A1A1A" />
      <ellipse cx="34.4" cy="32.4" rx="1.1" ry="1.1" fill="white" />
      {/* Left eyelid */}
      <path d="M28 31 Q33 28.5 38 31" stroke="#2D1F14" strokeWidth="1.6" strokeLinecap="round" fill="none" opacity="0.8" />
      {/* Left eyebrow (bolder for male) */}
      <path d="M27 27.5 Q33 25 38.5 26.5" stroke={hair} strokeWidth="2" strokeLinecap="round" fill="none" />

      {/* Right eye */}
      <ellipse cx="47" cy="33" rx="5.2" ry="5.5" fill="white" />
      <ellipse cx="47" cy="33.8" rx="3.6" ry="3.8" fill={eye} />
      <ellipse cx="47" cy="33.8" rx="2" ry="2.2" fill="#1A1A1A" />
      <ellipse cx="48.4" cy="32.4" rx="1.1" ry="1.1" fill="white" />
      {/* Right eyelid */}
      <path d="M42 31 Q47 28.5 52 31" stroke="#2D1F14" strokeWidth="1.6" strokeLinecap="round" fill="none" opacity="0.8" />
      {/* Right eyebrow */}
      <path d="M41.5 27.5 Q47 25 53 26.5" stroke={hair} strokeWidth="2" strokeLinecap="round" fill="none" />

      {/* ==== NOSE ==== */}
      <path d="M39 38 Q40 41 41 38" stroke="rgba(0,0,0,0.25)" strokeWidth="1.2" strokeLinecap="round" fill="none" />
      <path d="M37 39 Q39 40.5 41 39 Q43 40.5 43 40" stroke="rgba(0,0,0,0.15)" strokeWidth="1" strokeLinecap="round" fill="none" />

      {/* ==== SMILE ==== */}
      <path d="M35 43 Q37.5 46.5 40 45.5 Q42.5 46.5 45 43" stroke="#C47B6A" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <path d="M36.5 45 Q40 48 43.5 45" fill="rgba(255,255,255,0.4)" stroke="none" />
    </svg>
  );
}

export default function AvatarFigure({ personaKey, size = 'md', animated = true }) {
  const cfg = FIGURE_CONFIGS[personaKey] || FIGURE_CONFIGS.wellness_concierge;
  const isFemale = cfg.type === 'female';

  const props = {
    skin: cfg.skinTone,
    hair: cfg.hairColor,
    eye: cfg.eyeColor,
    blush: cfg.blush,
    accent: cfg.topAccent,
    size,
  };

  const figure = isFemale
    ? <FemaleFigure {...props} />
    : <MaleFigure {...props} />;

  if (!animated) return figure;

  return (
    <motion.div
      animate={{ y: [0, -4, 0] }}
      transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
      style={{ display: 'inline-flex', alignItems: 'flex-end' }}
    >
      {figure}
    </motion.div>
  );
}