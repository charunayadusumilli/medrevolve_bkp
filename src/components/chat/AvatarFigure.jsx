import React from 'react';
import { motion } from 'framer-motion';

// Adult wellness/fitness avatar figures — confident, healthy, professional
// MedRevolve branded athletic tops on all figures
// Inspired by: fit wellness professionals, telehealth brand identity

const FIGURE_CONFIGS = {
  wellness_concierge:       { gender: 'female', skin: '#F5C8A0', hair: '#5C3D2E', lip: '#C8706A', accent: '#A8C99B', hairStyle: 'updo' },
  treatment_advisor:        { gender: 'male',   skin: '#C8845C', hair: '#2D1F14', lip: '#B0665A', accent: '#5A9E84', hairStyle: 'short' },
  consultation_coordinator: { gender: 'female', skin: '#FDDBB4', hair: '#1A1A1A', lip: '#D4786A', accent: '#BFDBFE', hairStyle: 'straight' },
  patient_support:          { gender: 'female', skin: '#B07040', hair: '#2D1A10', lip: '#A05848', accent: '#BAE6FD', hairStyle: 'updo' },
  onboarding_guide:         { gender: 'male',   skin: '#E8B88A', hair: '#5C3D2E', lip: '#C07060', accent: '#6EE7B7', hairStyle: 'short' },
  creator_manager:          { gender: 'female', skin: '#F5C8A0', hair: '#8B4513', lip: '#D4687A', accent: '#C4B5FD', hairStyle: 'ponytail' },
  partner_manager:          { gender: 'male',   skin: '#C8845C', hair: '#1A1A1A', lip: '#B0665A', accent: '#FDE68A', hairStyle: 'fade' },
  enterprise_advisor:       { gender: 'male',   skin: '#E0C090', hair: '#1A1A1A', lip: '#C07060', accent: '#FCD34D', hairStyle: 'short' },
  provider_onboarding:      { gender: 'male',   skin: '#A06030', hair: '#1A0E08', lip: '#985040', accent: '#99F6E4', hairStyle: 'fade' },
  provider_support:         { gender: 'female', skin: '#FDDBB4', hair: '#2D1F14', lip: '#D4786A', accent: '#99F6E4', hairStyle: 'straight' },
  pharmacy_coordinator:     { gender: 'female', skin: '#F0C090', hair: '#4A3728', lip: '#C8707A', accent: '#C7D2FE', hairStyle: 'ponytail' },
  ops_advisor:              { gender: 'male',   skin: '#C8845C', hair: '#2D2020', lip: '#B0665A', accent: '#9CA3AF', hairStyle: 'short' },
  compliance_specialist:    { gender: 'female', skin: '#985038', hair: '#1A1A1A', lip: '#883838', accent: '#FCA5A5', hairStyle: 'updo' },
};

// Fit female figure — athletic, adult proportions, MedRevolve branded top
function FemaleWellnessAvatar({ skin, hair, lip, accent, hairStyle, size }) {
  const scale = size === 'lg' ? 1.3 : size === 'sm' ? 0.62 : 1;
  const w = 72, h = 110;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} fill="none" xmlns="http://www.w3.org/2000/svg"
      style={{ width: w * scale, height: h * scale, display: 'block' }}>

      {/* Ground shadow */}
      <ellipse cx="36" cy="107" rx="14" ry="2.5" fill="rgba(0,0,0,0.10)" />

      {/* ── LEGS ── slim athletic */}
      <path d="M28 80 Q27 92 26 104" stroke={skin} strokeWidth="8.5" strokeLinecap="round" fill="none" />
      <path d="M44 80 Q45 92 46 104" stroke={skin} strokeWidth="8.5" strokeLinecap="round" fill="none" />
      {/* Inner leg shadow */}
      <path d="M32 80 Q31 92 30 104" stroke="rgba(0,0,0,0.08)" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M40 80 Q41 92 42 104" stroke="rgba(0,0,0,0.08)" strokeWidth="3" strokeLinecap="round" fill="none" />
      {/* Shoes */}
      <ellipse cx="26" cy="104.5" rx="6" ry="2.5" fill="#2D3A2D" />
      <ellipse cx="46" cy="104.5" rx="6" ry="2.5" fill="#2D3A2D" />
      <ellipse cx="24.5" cy="103.5" rx="2.5" ry="1" fill="rgba(255,255,255,0.25)" />
      <ellipse cx="44.5" cy="103.5" rx="2.5" ry="1" fill="rgba(255,255,255,0.25)" />

      {/* ── HIPS / SHORTS ── */}
      <path d="M20 68 Q28 80 36 80 Q44 80 52 68 Z" fill="#1D2A1D" />
      <path d="M21 68 Q23 74 28 76" stroke="rgba(255,255,255,0.08)" strokeWidth="1" fill="none" />

      {/* ── TORSO / MR ATHLETIC TOP ── */}
      {/* Main body */}
      <path d="M20 38 Q24 34 36 35 Q48 34 52 38 L54 68 Q36 72 18 68 Z" fill="#2D3A2D" />
      {/* Top highlight sheen */}
      <path d="M26 36 Q32 33 36 34 Q29 40 26 42 Z" fill="rgba(255,255,255,0.1)" />
      {/* Side contour */}
      <path d="M20 40 Q18 52 20 65" stroke="rgba(0,0,0,0.2)" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <path d="M52 40 Q54 52 52 65" stroke="rgba(0,0,0,0.2)" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      {/* Neckline */}
      <path d="M29 36 Q36 41 43 36" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      {/* MR wordmark */}
      <text x="30.5" y="57" fontSize="7" fontWeight="800" fill="white" fontFamily="Arial, sans-serif" letterSpacing="0.5" opacity="0.92">MR</text>
      {/* Accent stripe at hem */}
      <path d="M18 65 Q36 68 54 65" stroke={accent} strokeWidth="1.8" strokeLinecap="round" fill="none" opacity="0.7" />

      {/* ── ARMS ── toned */}
      {/* Left arm */}
      <path d="M20 40 Q10 48 11 62" stroke={skin} strokeWidth="7" strokeLinecap="round" fill="none" />
      <path d="M20 40 Q10 48 11 62" stroke="rgba(0,0,0,0.07)" strokeWidth="3" strokeLinecap="round" fill="none" />
      {/* Right arm — hand on hip */}
      <path d="M52 40 Q62 48 61 62" stroke={skin} strokeWidth="7" strokeLinecap="round" fill="none" />
      <path d="M52 40 Q62 48 61 62" stroke="rgba(0,0,0,0.07)" strokeWidth="3" strokeLinecap="round" fill="none" />
      {/* Hands */}
      <ellipse cx="11" cy="63" rx="4" ry="3.5" fill={skin} />
      <ellipse cx="61" cy="63" rx="4" ry="3.5" fill={skin} />
      {/* Finger detail */}
      <path d="M9 61 Q8 64 9 66" stroke="rgba(0,0,0,0.12)" strokeWidth="1" strokeLinecap="round" fill="none" />
      <path d="M63 61 Q64 64 63 66" stroke="rgba(0,0,0,0.12)" strokeWidth="1" strokeLinecap="round" fill="none" />

      {/* ── NECK ── */}
      <rect x="32" y="28" width="8" height="9" rx="4" fill={skin} />
      <rect x="32" y="28" width="8" height="9" rx="4" fill="rgba(0,0,0,0.06)" />

      {/* ── HEAD ── */}
      {/* Head shadow/depth */}
      <ellipse cx="36.5" cy="19.5" rx="13.5" ry="14.5" fill="rgba(0,0,0,0.08)" />
      {/* Head */}
      <ellipse cx="36" cy="19" rx="13" ry="14" fill={skin} />
      {/* Jaw highlight */}
      <path d="M25 25 Q28 34 36 36 Q44 34 47 25" fill={skin} stroke="none" />
      {/* Cheek contouring */}
      <ellipse cx="26" cy="22" rx="4.5" ry="5" fill="rgba(0,0,0,0.05)" />
      <ellipse cx="46" cy="22" rx="4.5" ry="5" fill="rgba(0,0,0,0.05)" />
      {/* Blush */}
      <ellipse cx="26" cy="23" rx="5" ry="3.5" fill="#FFB8A0" opacity="0.28" />
      <ellipse cx="46" cy="23" rx="5" ry="3.5" fill="#FFB8A0" opacity="0.28" />
      {/* Head highlight */}
      <ellipse cx="32" cy="11" rx="5" ry="4" fill="rgba(255,255,255,0.18)" />

      {/* ── HAIR ── */}
      {hairStyle === 'updo' && (
        <>
          <ellipse cx="36" cy="8" rx="13" ry="8" fill={hair} />
          <ellipse cx="36" cy="4" rx="8" ry="6" fill={hair} />
          {/* Bun */}
          <ellipse cx="36" cy="1" rx="6" ry="5.5" fill={hair} />
          <ellipse cx="34" cy="-0.5" rx="2.5" ry="2" fill="rgba(255,255,255,0.15)" />
          {/* Sides */}
          <ellipse cx="24" cy="17" rx="3" ry="8" fill={hair} />
          <ellipse cx="48" cy="17" rx="3" ry="8" fill={hair} />
          {/* Wisp */}
          <path d="M25 10 Q23 14 24 20" stroke={hair} strokeWidth="3" strokeLinecap="round" fill="none" />
        </>
      )}
      {hairStyle === 'ponytail' && (
        <>
          <ellipse cx="36" cy="8" rx="13" ry="9" fill={hair} />
          <rect x="23" y="8" width="26" height="8" fill={hair} />
          {/* Ponytail */}
          <path d="M49 12 Q58 10 56 22 Q54 30 50 32" stroke={hair} strokeWidth="6" strokeLinecap="round" fill="none" />
          <path d="M49 12 Q58 10 56 22 Q54 30 50 32" stroke="rgba(255,255,255,0.12)" strokeWidth="2" strokeLinecap="round" fill="none" />
          <ellipse cx="25" cy="17" rx="3" ry="8" fill={hair} />
        </>
      )}
      {hairStyle === 'straight' && (
        <>
          <ellipse cx="36" cy="7" rx="13" ry="9" fill={hair} />
          <rect x="23" y="7" width="26" height="10" fill={hair} />
          {/* Long sides */}
          <path d="M23 12 Q19 22 20 35" stroke={hair} strokeWidth="7" strokeLinecap="round" fill="none" />
          <path d="M49 12 Q53 22 52 35" stroke={hair} strokeWidth="7" strokeLinecap="round" fill="none" />
          {/* Highlight */}
          <path d="M30 9 Q36 6 42 9" stroke="rgba(255,255,255,0.18)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        </>
      )}

      {/* ── EYEBROWS ── natural adult arches */}
      <path d="M26 13 Q31 10.5 35 12" stroke={hair} strokeWidth="1.6" strokeLinecap="round" fill="none" />
      <path d="M37 12 Q41 10.5 46 13" stroke={hair} strokeWidth="1.6" strokeLinecap="round" fill="none" />

      {/* ── EYES ── attractive adult proportions */}
      {/* Left eye white */}
      <ellipse cx="30.5" cy="18" rx="4.5" ry="3.5" fill="white" />
      {/* Left iris */}
      <ellipse cx="30.5" cy="18.2" rx="2.8" ry="3" fill="#6B8060" />
      <ellipse cx="30.5" cy="18.2" rx="1.8" ry="2" fill="#2D3A2D" />
      {/* Left highlight */}
      <ellipse cx="31.8" cy="16.8" rx="1" ry="0.9" fill="white" />
      <ellipse cx="30" cy="19.5" rx="0.5" ry="0.4" fill="rgba(255,255,255,0.5)" />
      {/* Left upper lid line */}
      <path d="M26.5 16.2 Q30.5 13.5 34.5 16.2" stroke="#2D1F14" strokeWidth="1.3" strokeLinecap="round" fill="none" />
      {/* Left lower lash line */}
      <path d="M26.5 19.5 Q30.5 21 34.5 19.5" stroke="rgba(45,31,20,0.35)" strokeWidth="0.7" strokeLinecap="round" fill="none" />

      {/* Right eye white */}
      <ellipse cx="41.5" cy="18" rx="4.5" ry="3.5" fill="white" />
      {/* Right iris */}
      <ellipse cx="41.5" cy="18.2" rx="2.8" ry="3" fill="#6B8060" />
      <ellipse cx="41.5" cy="18.2" rx="1.8" ry="2" fill="#2D3A2D" />
      {/* Right highlight */}
      <ellipse cx="42.8" cy="16.8" rx="1" ry="0.9" fill="white" />
      <ellipse cx="41" cy="19.5" rx="0.5" ry="0.4" fill="rgba(255,255,255,0.5)" />
      {/* Right lid */}
      <path d="M37.5 16.2 Q41.5 13.5 45.5 16.2" stroke="#2D1F14" strokeWidth="1.3" strokeLinecap="round" fill="none" />
      <path d="M37.5 19.5 Q41.5 21 45.5 19.5" stroke="rgba(45,31,20,0.35)" strokeWidth="0.7" strokeLinecap="round" fill="none" />

      {/* ── NOSE ── subtle adult */}
      <path d="M35 21 Q36 24 37 21" stroke="rgba(0,0,0,0.18)" strokeWidth="1" strokeLinecap="round" fill="none" />
      <path d="M33 23 Q35 24.5 37 24.5 Q39 24.5 39 23" stroke="rgba(0,0,0,0.12)" strokeWidth="0.9" strokeLinecap="round" fill="none" />

      {/* ── MOUTH ── warm confident smile */}
      <path d="M30.5 27.5 Q33.5 30.5 36 29.5 Q38.5 30.5 41.5 27.5" stroke={lip} strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <path d="M31.5 29 Q36 32 40.5 29" fill="rgba(255,255,255,0.35)" stroke="none" />
      {/* Smile warmth lines */}
      <path d="M30.5 27.5 Q29.5 28 29.5 29" stroke={lip} strokeWidth="0.8" strokeLinecap="round" fill="none" opacity="0.5" />
      <path d="M41.5 27.5 Q42.5 28 42.5 29" stroke={lip} strokeWidth="0.8" strokeLinecap="round" fill="none" opacity="0.5" />
    </svg>
  );
}

// Fit male figure — athletic adult, MedRevolve branded top
function MaleWellnessAvatar({ skin, hair, lip, accent, hairStyle, size }) {
  const scale = size === 'lg' ? 1.3 : size === 'sm' ? 0.62 : 1;
  const w = 72, h = 110;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} fill="none" xmlns="http://www.w3.org/2000/svg"
      style={{ width: w * scale, height: h * scale, display: 'block' }}>

      {/* Ground shadow */}
      <ellipse cx="36" cy="107" rx="15" ry="2.5" fill="rgba(0,0,0,0.10)" />

      {/* ── LEGS ── */}
      <path d="M26 80 Q25 92 24 104" stroke="#1D2A1D" strokeWidth="10" strokeLinecap="round" fill="none" opacity="0.85" />
      <path d="M46 80 Q47 92 48 104" stroke="#1D2A1D" strokeWidth="10" strokeLinecap="round" fill="none" opacity="0.85" />
      {/* Leg skin hint at ankle */}
      <ellipse cx="24" cy="102" rx="4.5" ry="2" fill={skin} />
      <ellipse cx="48" cy="102" rx="4.5" ry="2" fill={skin} />
      {/* Shoes */}
      <ellipse cx="24" cy="105" rx="7" ry="2.8" fill="#1A1A1A" />
      <ellipse cx="48" cy="105" rx="7" ry="2.8" fill="#1A1A1A" />
      <ellipse cx="22" cy="104" rx="3" ry="1.1" fill="rgba(255,255,255,0.22)" />
      <ellipse cx="46" cy="104" rx="3" ry="1.1" fill="rgba(255,255,255,0.22)" />

      {/* ── WAIST / JOGGERS ── */}
      <path d="M17 68 Q26 82 36 82 Q46 82 55 68 Z" fill="#1D2A1D" />

      {/* ── TORSO / MR ATHLETIC TOP ── broader shoulders */}
      <path d="M16 36 Q21 31 36 32 Q51 31 56 36 L58 68 Q36 72 14 68 Z" fill="#2D3A2D" />
      {/* Shoulder definition */}
      <path d="M17 37 Q14 42 15 52" stroke="rgba(255,255,255,0.07)" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M55 37 Q58 42 57 52" stroke="rgba(255,255,255,0.07)" strokeWidth="3" strokeLinecap="round" fill="none" />
      {/* Chest contour */}
      <path d="M22 40 Q29 44 36 43 Q43 44 50 40" stroke="rgba(255,255,255,0.07)" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      {/* Top highlight */}
      <path d="M24 33 Q30 30 36 31 Q30 38 25 40 Z" fill="rgba(255,255,255,0.1)" />
      {/* Collar */}
      <path d="M28 33 Q36 39 44 33" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      {/* MR branding */}
      <text x="29" y="56" fontSize="7.5" fontWeight="800" fill="white" fontFamily="Arial, sans-serif" letterSpacing="0.5" opacity="0.92">MR</text>
      {/* Hem accent */}
      <path d="M14 65 Q36 69 58 65" stroke={accent} strokeWidth="1.8" strokeLinecap="round" fill="none" opacity="0.7" />

      {/* ── ARMS ── broad adult */}
      <path d="M16 38 Q6 48 8 64" stroke={skin} strokeWidth="9" strokeLinecap="round" fill="none" />
      <path d="M16 38 Q6 48 8 64" stroke="rgba(0,0,0,0.08)" strokeWidth="4" strokeLinecap="round" fill="none" />
      <path d="M56 38 Q66 48 64 64" stroke={skin} strokeWidth="9" strokeLinecap="round" fill="none" />
      <path d="M56 38 Q66 48 64 64" stroke="rgba(0,0,0,0.08)" strokeWidth="4" strokeLinecap="round" fill="none" />
      {/* Hands */}
      <ellipse cx="8" cy="65" rx="5" ry="4" fill={skin} />
      <ellipse cx="64" cy="65" rx="5" ry="4" fill={skin} />

      {/* ── NECK ── strong */}
      <rect x="31" y="26" width="10" height="9" rx="4" fill={skin} />

      {/* ── HEAD ── */}
      <ellipse cx="36.5" cy="17.5" rx="14.5" ry="15.5" fill="rgba(0,0,0,0.07)" />
      <ellipse cx="36" cy="17" rx="14" ry="15" fill={skin} />
      {/* Jaw line for male */}
      <path d="M23 22 Q25 34 32 36 Q36 38 40 36 Q47 34 49 22" fill={skin} stroke="none" />
      {/* Cheek contouring */}
      <ellipse cx="24" cy="22" rx="5" ry="6" fill="rgba(0,0,0,0.06)" />
      <ellipse cx="48" cy="22" rx="5" ry="6" fill="rgba(0,0,0,0.06)" />
      {/* Head highlight */}
      <ellipse cx="31" cy="10" rx="5.5" ry="4.5" fill="rgba(255,255,255,0.15)" />

      {/* ── HAIR ── */}
      {(hairStyle === 'short' || !hairStyle) && (
        <>
          <ellipse cx="36" cy="6" rx="14" ry="8" fill={hair} />
          <rect x="22" y="5" width="28" height="9" fill={hair} />
          {/* Side taper */}
          <path d="M22 9 Q21 15 22 22" stroke={hair} strokeWidth="4" strokeLinecap="round" fill="none" />
          <path d="M50 9 Q51 15 50 22" stroke={hair} strokeWidth="4" strokeLinecap="round" fill="none" />
          {/* Hair texture */}
          <path d="M26 7 Q32 4 38 6 Q44 4 46 7" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        </>
      )}
      {hairStyle === 'fade' && (
        <>
          <ellipse cx="36" cy="5" rx="14" ry="7" fill={hair} />
          <rect x="22" y="5" width="28" height="7" fill={hair} />
          {/* Fade on sides — gradient effect via opacity layers */}
          <path d="M22 8 Q21 12 22 18" stroke={hair} strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.5" />
          <path d="M50 8 Q51 12 50 18" stroke={hair} strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.5" />
          <path d="M28 6 Q34 3 40 5" stroke="rgba(255,255,255,0.2)" strokeWidth="2" strokeLinecap="round" fill="none" />
        </>
      )}

      {/* ── EYEBROWS ── bold adult */}
      <path d="M24 12 Q30 9 35 11" stroke={hair} strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M37 11 Q42 9 48 12" stroke={hair} strokeWidth="2" strokeLinecap="round" fill="none" />

      {/* ── EYES ── */}
      <ellipse cx="30" cy="17.5" rx="4.8" ry="4" fill="white" />
      <ellipse cx="30" cy="17.8" rx="3" ry="3.2" fill="#4A6070" />
      <ellipse cx="30" cy="17.8" rx="1.8" ry="2" fill="#1A2A3A" />
      <ellipse cx="31.3" cy="16.3" rx="1" ry="0.9" fill="white" />
      <path d="M25.5 15.5 Q30 12.8 34.5 15.5" stroke="#2D1F14" strokeWidth="1.5" strokeLinecap="round" fill="none" />

      <ellipse cx="42" cy="17.5" rx="4.8" ry="4" fill="white" />
      <ellipse cx="42" cy="17.8" rx="3" ry="3.2" fill="#4A6070" />
      <ellipse cx="42" cy="17.8" rx="1.8" ry="2" fill="#1A2A3A" />
      <ellipse cx="43.3" cy="16.3" rx="1" ry="0.9" fill="white" />
      <path d="M37.5 15.5 Q42 12.8 46.5 15.5" stroke="#2D1F14" strokeWidth="1.5" strokeLinecap="round" fill="none" />

      {/* ── NOSE ── */}
      <path d="M35 21 Q36 24.5 37 21" stroke="rgba(0,0,0,0.2)" strokeWidth="1.2" strokeLinecap="round" fill="none" />
      <path d="M33 23.5 Q35 25.5 37 25.5 Q39 25.5 39 23.5" stroke="rgba(0,0,0,0.15)" strokeWidth="1" strokeLinecap="round" fill="none" />

      {/* ── MOUTH ── confident smile */}
      <path d="M30.5 29 Q33.5 32.5 36 31.5 Q38.5 32.5 41.5 29" stroke={lip} strokeWidth="1.6" strokeLinecap="round" fill="none" />
      <path d="M31.5 31 Q36 34 40.5 31" fill="rgba(255,255,255,0.3)" stroke="none" />
    </svg>
  );
}

export default function AvatarFigure({ personaKey, size = 'md', animated = true }) {
  const cfg = FIGURE_CONFIGS[personaKey] || FIGURE_CONFIGS.wellness_concierge;
  const isFemale = cfg.gender === 'female';

  const props = {
    skin: cfg.skin,
    hair: cfg.hair,
    lip: cfg.lip,
    accent: cfg.accent,
    hairStyle: cfg.hairStyle,
    size,
  };

  const figure = isFemale
    ? <FemaleWellnessAvatar {...props} />
    : <MaleWellnessAvatar {...props} />;

  if (!animated) return figure;

  return (
    <motion.div
      animate={{ y: [0, -3, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      style={{ display: 'inline-flex', alignItems: 'flex-end' }}
    >
      {figure}
    </motion.div>
  );
}