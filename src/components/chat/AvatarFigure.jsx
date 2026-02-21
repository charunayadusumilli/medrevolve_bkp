import React from 'react';
import { motion } from 'framer-motion';

// Animated SVG avatar figures — slim, stylized, gender-aware
// Types: 'female_wellness', 'male_professional', 'female_medical', 'male_medical',
//        'female_business', 'male_business', 'female_pharmacy', 'male_ops'

const FIGURE_CONFIGS = {
  wellness_concierge:     { type: 'female_wellness',   skinTone: '#FDDBB4', hairColor: '#4A3728', clothColor: '#6B8F5E', accentColor: '#A8C99B' },
  treatment_advisor:      { type: 'male_professional', skinTone: '#D4956B', hairColor: '#2D1F14', clothColor: '#3B6B5A', accentColor: '#5A9E84' },
  consultation_coordinator: { type: 'female_medical', skinTone: '#F5C8A0', hairColor: '#1A1A1A', clothColor: '#2563EB', accentColor: '#BFDBFE' },
  patient_support:        { type: 'female_wellness',   skinTone: '#C8845C', hairColor: '#3D2B1F', clothColor: '#0891B2', accentColor: '#BAE6FD' },
  onboarding_guide:       { type: 'male_professional', skinTone: '#FDDBB4', hairColor: '#5C3D2E', clothColor: '#059669', accentColor: '#6EE7B7' },
  creator_manager:        { type: 'female_business',   skinTone: '#F5C8A0', hairColor: '#7C3D1A', clothColor: '#7C3AED', accentColor: '#C4B5FD' },
  partner_manager:        { type: 'male_business',     skinTone: '#D4956B', hairColor: '#2D1F14', clothColor: '#D97706', accentColor: '#FDE68A' },
  enterprise_advisor:     { type: 'male_business',     skinTone: '#FDDBB4', hairColor: '#1A1A1A', clothColor: '#92400E', accentColor: '#FCD34D' },
  provider_onboarding:    { type: 'male_medical',      skinTone: '#C8845C', hairColor: '#2D1F14', clothColor: '#0F766E', accentColor: '#99F6E4' },
  provider_support:       { type: 'female_medical',    skinTone: '#FDDBB4', hairColor: '#1A1A1A', clothColor: '#0F766E', accentColor: '#99F6E4' },
  pharmacy_coordinator:   { type: 'female_pharmacy',   skinTone: '#F5C8A0', hairColor: '#4A3728', clothColor: '#4338CA', accentColor: '#C7D2FE' },
  ops_advisor:            { type: 'male_ops',          skinTone: '#D4956B', hairColor: '#1A1A1A', clothColor: '#374151', accentColor: '#9CA3AF' },
  compliance_specialist:  { type: 'female_business',   skinTone: '#C8845C', hairColor: '#2D1F14', clothColor: '#B91C1C', accentColor: '#FCA5A5' },
};

function FemaleFigure({ skin, hair, cloth, accent, showStethoscope, showClipboard, size }) {
  const s = size === 'lg' ? 1.4 : size === 'sm' ? 0.7 : 1;
  return (
    <svg viewBox="0 0 60 80" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: 60 * s, height: 80 * s }}>
      {/* Hair back */}
      <ellipse cx="30" cy="14" rx="11" ry="13" fill={hair} />
      {/* Head */}
      <ellipse cx="30" cy="16" rx="9" ry="10" fill={skin} />
      {/* Hair top */}
      <ellipse cx="30" cy="8" rx="9" ry="5" fill={hair} />
      {/* Hair sides */}
      <ellipse cx="21" cy="17" rx="2.5" ry="6" fill={hair} />
      <ellipse cx="39" cy="17" rx="2.5" ry="6" fill={hair} />
      {/* Eyes */}
      <ellipse cx="26.5" cy="16" rx="1.2" ry="1.4" fill="#2D1F14" />
      <ellipse cx="33.5" cy="16" rx="1.2" ry="1.4" fill="#2D1F14" />
      <ellipse cx="26.8" cy="15.6" rx="0.4" ry="0.4" fill="white" />
      <ellipse cx="33.8" cy="15.6" rx="0.4" ry="0.4" fill="white" />
      {/* Smile */}
      <path d="M27 20 Q30 22.5 33 20" stroke="#C47B6A" strokeWidth="0.8" strokeLinecap="round" fill="none" />
      {/* Neck */}
      <rect x="27" y="25" width="6" height="5" rx="2" fill={skin} />
      {/* Body / top */}
      <path d="M18 30 Q22 27 30 28 Q38 27 42 30 L44 55 Q30 58 16 55 Z" fill={cloth} />
      {/* Collar */}
      <path d="M26 29 L30 33 L34 29" stroke={accent} strokeWidth="1.2" fill="none" />
      {/* Arms */}
      <path d="M18 32 Q12 38 14 48" stroke={cloth} strokeWidth="5" strokeLinecap="round" fill="none" />
      <path d="M42 32 Q48 38 46 48" stroke={cloth} strokeWidth="5" strokeLinecap="round" fill="none" />
      {/* Hands */}
      <ellipse cx="14" cy="49" rx="3" ry="2.5" fill={skin} />
      <ellipse cx="46" cy="49" rx="3" ry="2.5" fill={skin} />
      {/* Skirt/pants */}
      <path d="M16 55 Q22 65 30 66 Q38 65 44 55 Z" fill={cloth} opacity="0.85" />
      {/* Legs */}
      <rect x="24" y="64" width="5" height="14" rx="2.5" fill={skin} />
      <rect x="31" y="64" width="5" height="14" rx="2.5" fill={skin} />
      {/* Shoes */}
      <ellipse cx="26.5" cy="78" rx="4" ry="2" fill="#2D1F14" />
      <ellipse cx="33.5" cy="78" rx="4" ry="2" fill="#2D1F14" />
      {/* Stethoscope if medical */}
      {showStethoscope && (
        <>
          <path d="M26 29 Q24 36 22 40 Q20 44 23 46" stroke="#C0C0C0" strokeWidth="1.2" strokeLinecap="round" fill="none" />
          <circle cx="23" cy="47" r="2" fill="#C0C0C0" />
        </>
      )}
      {/* Clipboard */}
      {showClipboard && (
        <>
          <rect x="10" y="41" width="8" height="10" rx="1" fill="white" stroke={accent} strokeWidth="0.8" />
          <line x1="12" y1="44" x2="16" y2="44" stroke={accent} strokeWidth="0.6" />
          <line x1="12" y1="46" x2="16" y2="46" stroke={accent} strokeWidth="0.6" />
          <line x1="12" y1="48" x2="14" y2="48" stroke={accent} strokeWidth="0.6" />
        </>
      )}
    </svg>
  );
}

function MaleFigure({ skin, hair, cloth, accent, showStethoscope, showClipboard, size }) {
  const s = size === 'lg' ? 1.4 : size === 'sm' ? 0.7 : 1;
  return (
    <svg viewBox="0 0 60 80" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: 60 * s, height: 80 * s }}>
      {/* Head */}
      <ellipse cx="30" cy="15" rx="9.5" ry="10.5" fill={skin} />
      {/* Hair */}
      <ellipse cx="30" cy="7" rx="9.5" ry="4.5" fill={hair} />
      <rect x="20" y="7" width="20" height="5" fill={hair} />
      {/* Eyes */}
      <ellipse cx="26.5" cy="14.5" rx="1.3" ry="1.5" fill="#2D1F14" />
      <ellipse cx="33.5" cy="14.5" rx="1.3" ry="1.5" fill="#2D1F14" />
      <ellipse cx="26.8" cy="14.1" rx="0.4" ry="0.4" fill="white" />
      <ellipse cx="33.8" cy="14.1" rx="0.4" ry="0.4" fill="white" />
      {/* Smile */}
      <path d="M27.5 19.5 Q30 21.5 32.5 19.5" stroke="#C47B6A" strokeWidth="0.9" strokeLinecap="round" fill="none" />
      {/* Neck */}
      <rect x="27" y="24" width="6" height="5" rx="2" fill={skin} />
      {/* Shirt + tie / collar */}
      <path d="M17 30 Q22 26 30 27 Q38 26 43 30 L45 56 Q30 59 15 56 Z" fill={cloth} />
      {/* Tie */}
      <path d="M30 27 L28.5 38 L30 40 L31.5 38 Z" fill={accent} />
      {/* Collar */}
      <path d="M25 28 L30 32 L35 28" stroke="white" strokeWidth="1" fill="none" />
      {/* Arms */}
      <path d="M17 32 Q10 40 12 50" stroke={cloth} strokeWidth="6" strokeLinecap="round" fill="none" />
      <path d="M43 32 Q50 40 48 50" stroke={cloth} strokeWidth="6" strokeLinecap="round" fill="none" />
      {/* Hands */}
      <ellipse cx="12" cy="51" rx="3.5" ry="2.5" fill={skin} />
      <ellipse cx="48" cy="51" rx="3.5" ry="2.5" fill={skin} />
      {/* Pants */}
      <path d="M15 56 Q22 65 30 65 Q38 65 45 56 Z" fill={cloth} opacity="0.8" />
      {/* Legs */}
      <rect x="23" y="63" width="6" height="15" rx="3" fill={cloth} opacity="0.7" />
      <rect x="31" y="63" width="6" height="15" rx="3" fill={cloth} opacity="0.7" />
      {/* Shoes */}
      <ellipse cx="26" cy="78" rx="5" ry="2.2" fill="#1A1A1A" />
      <ellipse cx="34" cy="78" rx="5" ry="2.2" fill="#1A1A1A" />
      {/* Stethoscope */}
      {showStethoscope && (
        <>
          <path d="M26 28 Q23 35 21 40 Q19 44 22 47" stroke="#C0C0C0" strokeWidth="1.3" strokeLinecap="round" fill="none" />
          <circle cx="22" cy="48" r="2.2" fill="#C0C0C0" />
        </>
      )}
      {/* Clipboard */}
      {showClipboard && (
        <>
          <rect x="9" y="42" width="8" height="11" rx="1" fill="white" stroke={accent} strokeWidth="0.8" />
          <line x1="11" y1="45" x2="15" y2="45" stroke={accent} strokeWidth="0.6" />
          <line x1="11" y1="47" x2="15" y2="47" stroke={accent} strokeWidth="0.6" />
          <line x1="11" y1="49" x2="13" y2="49" stroke={accent} strokeWidth="0.6" />
        </>
      )}
    </svg>
  );
}

export default function AvatarFigure({ personaKey, size = 'md', animated = true }) {
  const cfg = FIGURE_CONFIGS[personaKey] || FIGURE_CONFIGS.wellness_concierge;
  const isFemale = cfg.type.startsWith('female');
  const isMedical = cfg.type.includes('medical') || cfg.type.includes('pharmacy');
  const isProvider = personaKey === 'provider_support' || personaKey === 'provider_onboarding';

  const props = {
    skin: cfg.skinTone,
    hair: cfg.hairColor,
    cloth: cfg.clothColor,
    accent: cfg.accentColor,
    showStethoscope: isMedical || isProvider,
    showClipboard: cfg.type.includes('pharmacy') || cfg.type.includes('ops'),
    size,
  };

  const figure = isFemale
    ? <FemaleFigure {...props} />
    : <MaleFigure {...props} />;

  if (!animated) return figure;

  return (
    <motion.div
      animate={{ y: [0, -3, 0] }}
      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      style={{ display: 'inline-flex' }}
    >
      {figure}
    </motion.div>
  );
}