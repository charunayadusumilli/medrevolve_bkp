import React from 'react';
import { motion } from 'framer-motion';

// Adult wellness/fitness PORTRAIT avatars — head & shoulders only
// Clean, professional, brand-matched to MedRevolve
// Each persona has distinct appearance matching their role

const CONFIGS = {
  wellness_concierge:       { gender: 'f', skin: '#F2C9A0', hair: '#5C3317', lip: '#C96B68', eye: '#5A7A52', hairStyle: 'updo',     top: '#2D3A2D' },
  treatment_advisor:        { gender: 'm', skin: '#C8844A', hair: '#1E1208', lip: '#A05845', eye: '#4A6070', hairStyle: 'short',    top: '#2D3A2D' },
  consultation_coordinator: { gender: 'f', skin: '#FDDCB4', hair: '#111111', lip: '#D07868', eye: '#3A5A78', hairStyle: 'straight', top: '#1D4ED8' },
  patient_support:          { gender: 'f', skin: '#B07040', hair: '#200E08', lip: '#904838', eye: '#7A9070', hairStyle: 'updo',     top: '#0E7490' },
  onboarding_guide:         { gender: 'm', skin: '#E8B880', hair: '#5C3317', lip: '#B06050', eye: '#4A7068', hairStyle: 'short',    top: '#047857' },
  creator_manager:          { gender: 'f', skin: '#F5C8A0', hair: '#7B3810', lip: '#C8607A', eye: '#6A5090', hairStyle: 'ponytail', top: '#6D28D9' },
  partner_manager:          { gender: 'm', skin: '#C8844A', hair: '#111111', lip: '#A05845', eye: '#5A6030', hairStyle: 'fade',     top: '#B45309' },
  enterprise_advisor:       { gender: 'm', skin: '#E0C090', hair: '#0E0E0E', lip: '#B06050', eye: '#405060', hairStyle: 'short',    top: '#374151' },
  provider_onboarding:      { gender: 'm', skin: '#9A5828', hair: '#0A0604', lip: '#884030', eye: '#3A5860', hairStyle: 'fade',     top: '#0D9488' },
  provider_support:         { gender: 'f', skin: '#FDDCB4', hair: '#1E1208', lip: '#C87868', eye: '#406050', hairStyle: 'straight', top: '#0D9488' },
  pharmacy_coordinator:     { gender: 'f', skin: '#F0C090', hair: '#3A2818', lip: '#C0686A', eye: '#5060A0', hairStyle: 'ponytail', top: '#3730A3' },
  ops_advisor:              { gender: 'm', skin: '#C8844A', hair: '#201818', lip: '#A05845', eye: '#5A6870', hairStyle: 'short',    top: '#1F2937' },
  compliance_specialist:    { gender: 'f', skin: '#985038', hair: '#0A0A0A', lip: '#883030', eye: '#804040', hairStyle: 'updo',     top: '#991B1B' },
};

function Portrait({ cfg, size }) {
  const s = size === 'lg' ? 88 : size === 'sm' ? 40 : 56;
  const { skin, hair, lip, eye, hairStyle, top, gender } = cfg;
  const f = gender === 'f';

  // proportional coords for a 100x100 viewBox (head+shoulders bust)
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg"
      style={{ width: s, height: s, borderRadius: '50%', display: 'block', flexShrink: 0 }}>

      {/* ── SHOULDER / TOP ── */}
      <path d={f
        ? "M0 100 Q15 72 30 68 Q40 65 50 66 Q60 65 70 68 Q85 72 100 100 Z"
        : "M0 100 Q12 68 28 63 Q38 59 50 60 Q62 59 72 63 Q88 68 100 100 Z"}
        fill={top} />
      {/* Collar / neckline detail */}
      {f
        ? <path d="M38 68 Q50 74 62 68" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        : <path d="M40 62 Q50 70 60 62" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      }
      {/* MR on chest */}
      <text x={f ? "43" : "42"} y="86" fontSize="7" fontWeight="800" fill="white" fontFamily="Arial,sans-serif" opacity="0.85">MR</text>

      {/* ── NECK ── */}
      <rect x="44" y="55" width="12" height="14" rx="6" fill={skin} />

      {/* ── HEAD ── */}
      {/* Shadow */}
      <ellipse cx="50.5" cy="36.5" rx={f ? "19" : "21"} ry={f ? "22" : "24"} fill="rgba(0,0,0,0.07)" />
      {/* Head */}
      <ellipse cx="50" cy="36" rx={f ? "18.5" : "20.5"} ry={f ? "21.5" : "23.5"} fill={skin} />
      {/* Jaw */}
      {f
        ? <path d="M33 44 Q36 58 50 60 Q64 58 67 44" fill={skin} />
        : <path d="M30 44 Q34 60 50 62 Q66 60 70 44" fill={skin} />
      }
      {/* Cheek blush */}
      {f && <>
        <ellipse cx="33" cy="43" rx="7" ry="5" fill="#FFB0A0" opacity="0.22" />
        <ellipse cx="67" cy="43" rx="7" ry="5" fill="#FFB0A0" opacity="0.22" />
      </>}
      {/* Head highlight */}
      <ellipse cx="41" cy="22" rx="7" ry="5" fill="rgba(255,255,255,0.16)" />

      {/* ── HAIR ── */}
      {hairStyle === 'updo' && <>
        <ellipse cx="50" cy="16" rx="19" ry="12" fill={hair} />
        <rect x="31" y="14" width="38" height="14" fill={hair} />
        {/* Bun */}
        <ellipse cx="50" cy="8" rx="9" ry="8" fill={hair} />
        <ellipse cx="48" cy="6" rx="3.5" ry="2.5" fill="rgba(255,255,255,0.15)" />
        {/* Sides */}
        <ellipse cx="33" cy="36" rx="4" ry="14" fill={hair} />
        <ellipse cx="67" cy="36" rx="4" ry="14" fill={hair} />
      </>}
      {hairStyle === 'ponytail' && <>
        <ellipse cx="50" cy="14" rx="19" ry="12" fill={hair} />
        <rect x="31" y="14" width="38" height="12" fill={hair} />
        {/* Ponytail sweep right */}
        <path d="M68 18 Q80 14 78 32 Q76 44 70 48" stroke={hair} strokeWidth="8" strokeLinecap="round" fill="none" />
        <path d="M68 18 Q80 14 78 32 Q76 44 70 48" stroke="rgba(255,255,255,0.1)" strokeWidth="3" strokeLinecap="round" fill="none" />
        <ellipse cx="33" cy="36" rx="4" ry="14" fill={hair} />
      </>}
      {hairStyle === 'straight' && <>
        <ellipse cx="50" cy="13" rx="19" ry="12" fill={hair} />
        <rect x="31" y="13" width="38" height="16" fill={hair} />
        {/* Long sides */}
        <path d="M31 20 Q27 34 28 52" stroke={hair} strokeWidth="9" strokeLinecap="round" fill="none" />
        <path d="M69 20 Q73 34 72 52" stroke={hair} strokeWidth="9" strokeLinecap="round" fill="none" />
        <path d="M38 14 Q50 10 62 14" stroke="rgba(255,255,255,0.18)" strokeWidth="2" strokeLinecap="round" fill="none" />
      </>}
      {hairStyle === 'short' && <>
        <ellipse cx="50" cy="13" rx="20.5" ry="12" fill={hair} />
        <rect x="29" y="13" width="42" height="14" fill={hair} />
        <path d="M29 18 Q28 26 30 34" stroke={hair} strokeWidth="5" strokeLinecap="round" fill="none" />
        <path d="M71 18 Q72 26 70 34" stroke={hair} strokeWidth="5" strokeLinecap="round" fill="none" />
        <path d="M36 13 Q50 9 64 13" stroke="rgba(255,255,255,0.18)" strokeWidth="2" strokeLinecap="round" fill="none" />
      </>}
      {hairStyle === 'fade' && <>
        <ellipse cx="50" cy="12" rx="20.5" ry="10" fill={hair} />
        <rect x="29" y="12" width="42" height="10" fill={hair} />
        <path d="M29 16 Q27 22 28 30" stroke={hair} strokeWidth="3.5" strokeLinecap="round" fill="none" opacity="0.6" />
        <path d="M71 16 Q73 22 72 30" stroke={hair} strokeWidth="3.5" strokeLinecap="round" fill="none" opacity="0.6" />
        <path d="M38 12 Q50 8 62 12" stroke="rgba(255,255,255,0.2)" strokeWidth="2" strokeLinecap="round" fill="none" />
      </>}

      {/* ── EYEBROWS ── */}
      {f
        ? <>
          <path d="M35 27 Q42 24 47 26" stroke={hair} strokeWidth="1.6" strokeLinecap="round" fill="none" />
          <path d="M53 26 Q58 24 65 27" stroke={hair} strokeWidth="1.6" strokeLinecap="round" fill="none" />
        </>
        : <>
          <path d="M33 26 Q40 22 46 25" stroke={hair} strokeWidth="2" strokeLinecap="round" fill="none" />
          <path d="M54 25 Q60 22 67 26" stroke={hair} strokeWidth="2" strokeLinecap="round" fill="none" />
        </>
      }

      {/* ── EYES ── */}
      {/* Left */}
      <ellipse cx={f?"41":"40"} cy="33" rx={f?"5.5":"6"} ry={f?"4.5":"5"} fill="white" />
      <ellipse cx={f?"41":"40"} cy="33.4" rx={f?"3.2":"3.8"} ry={f?"3.8":"4"} fill={eye} />
      <ellipse cx={f?"41":"40"} cy="33.4" rx="2" ry="2.4" fill="#111" />
      <ellipse cx={f?"42.5":"41.5"} cy="31.5" rx="1.2" ry="1" fill="white" />
      {f && <path d="M36 30.5 Q41 27.5 46 30.5" stroke="#2D1F14" strokeWidth="1.4" strokeLinecap="round" fill="none" />}

      {/* Right */}
      <ellipse cx={f?"59":"60"} cy="33" rx={f?"5.5":"6"} ry={f?"4.5":"5"} fill="white" />
      <ellipse cx={f?"59":"60"} cy="33.4" rx={f?"3.2":"3.8"} ry={f?"3.8":"4"} fill={eye} />
      <ellipse cx={f?"59":"60"} cy="33.4" rx="2" ry="2.4" fill="#111" />
      <ellipse cx={f?"60.5":"61.5"} cy="31.5" rx="1.2" ry="1" fill="white" />
      {f && <path d="M54 30.5 Q59 27.5 64 30.5" stroke="#2D1F14" strokeWidth="1.4" strokeLinecap="round" fill="none" />}

      {/* ── NOSE ── */}
      <path d="M49 40 Q50 44 51 40" stroke="rgba(0,0,0,0.18)" strokeWidth="1.2" strokeLinecap="round" fill="none" />
      <path d="M46 43 Q49 45.5 51 45.5 Q53 45.5 54 43" stroke="rgba(0,0,0,0.13)" strokeWidth="1" strokeLinecap="round" fill="none" />

      {/* ── MOUTH ── warm genuine smile */}
      {f
        ? <>
          <path d="M41 50 Q46 55 50 53.5 Q54 55 59 50" stroke={lip} strokeWidth="1.6" strokeLinecap="round" fill="none" />
          <path d="M43 52 Q50 57 57 52" fill="rgba(255,255,255,0.4)" stroke="none" />
          <path d="M41 50 Q40 51.5 40.5 52.5" stroke={lip} strokeWidth="0.8" strokeLinecap="round" fill="none" opacity="0.5" />
          <path d="M59 50 Q60 51.5 59.5 52.5" stroke={lip} strokeWidth="0.8" strokeLinecap="round" fill="none" opacity="0.5" />
        </>
        : <>
          <path d="M40 50 Q45 56 50 54 Q55 56 60 50" stroke={lip} strokeWidth="1.7" strokeLinecap="round" fill="none" />
          <path d="M42 52.5 Q50 58 58 52.5" fill="rgba(255,255,255,0.3)" stroke="none" />
        </>
      }
    </svg>
  );
}

export default function AvatarFigure({ personaKey, size = 'md', animated = true }) {
  const cfg = CONFIGS[personaKey] || CONFIGS.wellness_concierge;
  const portrait = <Portrait cfg={cfg} size={size} />;

  if (!animated) return portrait;

  return (
    <motion.div
      animate={{ y: [0, -2, 0] }}
      transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
      style={{ display: 'inline-flex' }}
    >
      {portrait}
    </motion.div>
  );
}