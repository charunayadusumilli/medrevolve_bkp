import React from 'react';
import { motion } from 'framer-motion';

// ─── Fit Coach / Gymnast Avatar Configurations ───────────────────────────────
// Each persona maps to an athletic character: fit coaches, gymnasts, trainers
const CONFIGS = {
  wellness_concierge: {
    // Female wellness coach — warm, athletic, ponytail
    gender: 'female', skin: '#F5C5A3', hair: '#8B4513', hairStyle: 'ponytail_athletic',
    top: '#4A6741', topAccent: '#6B8F5E', eyes: '#3D6B3D', lips: '#D4847A',
    outfit: 'sports_top', headband: '#A8C99B',
  },
  treatment_advisor: {
    // Male fitness expert — muscular, short hair, medical green
    gender: 'male', skin: '#D4956A', hair: '#2D1A0E', hairStyle: 'short_athletic',
    top: '#3B6B5A', topAccent: '#5A9E84', eyes: '#2D5A4A', lips: '#C07A5E',
    outfit: 'polo', headband: null,
  },
  consultation_coordinator: {
    // Female coordinator — professional, bun, blue
    gender: 'female', skin: '#FDDBB4', hair: '#1A1A2E', hairStyle: 'bun_athletic',
    top: '#2563EB', topAccent: '#3B82F6', eyes: '#1E40AF', lips: '#E07A8A',
    outfit: 'sports_top', headband: '#93C5FD',
  },
  patient_support: {
    // Female gymnast — flexible, warm, blonde braid
    gender: 'female', skin: '#FAD4A0', hair: '#C8A045', hairStyle: 'braid',
    top: '#0891B2', topAccent: '#06B6D4', eyes: '#0E7490', lips: '#D4847A',
    outfit: 'leotard', headband: '#67E8F9',
  },
  onboarding_guide: {
    // Male coach — motivator, buzz cut, green
    gender: 'male', skin: '#C8855A', hair: '#1A0A00', hairStyle: 'buzz',
    top: '#059669', topAccent: '#10B981', eyes: '#047857', lips: '#B06040',
    outfit: 'polo', headband: null,
  },
  creator_manager: {
    // Female gymnast — vibrant, curly, purple
    gender: 'female', skin: '#E8B090', hair: '#2D0A4A', hairStyle: 'curly_athletic',
    top: '#7C3AED', topAccent: '#8B5CF6', eyes: '#6D28D9', lips: '#C0607A',
    outfit: 'sports_top', headband: '#C4B5FD',
  },
  partner_manager: {
    // Male trainer — strong jaw, fade, gold
    gender: 'male', skin: '#D4A060', hair: '#0A0A00', hairStyle: 'fade',
    top: '#D97706', topAccent: '#F59E0B', eyes: '#B45309', lips: '#B07040',
    outfit: 'polo', headband: null,
  },
  enterprise_advisor: {
    // Male exec coach — salt pepper, athletic build
    gender: 'male', skin: '#C08060', hair: '#4A3A2A', hairStyle: 'short_athletic',
    top: '#92400E', topAccent: '#B45309', eyes: '#78350F', lips: '#A06040',
    outfit: 'polo', headband: null,
  },
  provider_onboarding: {
    // Male sports medicine — neat, teal
    gender: 'male', skin: '#C09070', hair: '#1A1A00', hairStyle: 'short_athletic',
    top: '#0F766E', topAccent: '#14B8A6', eyes: '#0D9488', lips: '#A07050',
    outfit: 'polo', headband: null,
  },
  provider_support: {
    // Female trainer — red hair, fit, clinical teal
    gender: 'female', skin: '#F0C090', hair: '#8B2010', hairStyle: 'ponytail_athletic',
    top: '#0F766E', topAccent: '#14B8A6', eyes: '#0D9488', lips: '#D08080',
    outfit: 'sports_top', headband: '#99F6E4',
  },
  pharmacy_coordinator: {
    // Female pharmacist coach — dark hair, bun, indigo
    gender: 'female', skin: '#E8C090', hair: '#1A0A20', hairStyle: 'bun_athletic',
    top: '#4338CA', topAccent: '#6366F1', eyes: '#3730A3', lips: '#C07090',
    outfit: 'sports_top', headband: '#A5B4FC',
  },
  ops_advisor: {
    // Male ops — shaved head, dark, gray
    gender: 'male', skin: '#A06840', hair: '#0A0A0A', hairStyle: 'buzz',
    top: '#374151', topAccent: '#6B7280', eyes: '#1F2937', lips: '#906050',
    outfit: 'polo', headband: null,
  },
  compliance_specialist: {
    // Female compliance — sleek, authoritative, red
    gender: 'female', skin: '#F0C0A0', hair: '#1A0000', hairStyle: 'straight_athletic',
    top: '#B91C1C', topAccent: '#EF4444', eyes: '#991B1B', lips: '#D07070',
    outfit: 'sports_top', headband: '#FCA5A5',
  },
};

const SIZES = {
  sm: { w: 36, h: 36, scale: 0.36 },
  md: { w: 56, h: 56, scale: 0.56 },
  lg: { w: 96, h: 96, scale: 0.96 },
};

// ─── Athletic Portrait SVG ───────────────────────────────────────────────────
function AthleticPortrait({ config, size = 'sm' }) {
  const s = SIZES[size] || SIZES.sm;
  const { gender, skin, hair, hairStyle, top, topAccent, eyes, lips, outfit, headband } = config;
  const cx = 50, cy = 50; // center of 100x100 viewBox

  // Body proportions — athletic, defined
  const shoulderW = gender === 'male' ? 44 : 36;
  const neckW = gender === 'male' ? 10 : 8;
  const headW = gender === 'male' ? 28 : 25;
  const headH = gender === 'male' ? 32 : 30;
  const headY = 22;
  const neckY = headY + headH - 2;
  const shoulderY = neckY + (gender === 'male' ? 10 : 8);

  // Muscle definition for males
  const muscleDef = gender === 'male';

  return (
    <svg
      width={s.w}
      height={s.h}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block' }}
    >
      {/* ── Neck ── */}
      <rect
        x={cx - neckW / 2} y={neckY}
        width={neckW} height={12}
        rx={neckW / 2}
        fill={skin}
      />
      {/* Neck shadow */}
      <rect
        x={cx - neckW / 2} y={neckY}
        width={neckW} height={4}
        rx={2}
        fill="rgba(0,0,0,0.07)"
      />

      {/* ── Shoulders / Torso ── */}
      <ellipse cx={cx} cy={shoulderY + 10} rx={shoulderW / 2} ry={14} fill={top} />
      {/* Sports top accent stripe */}
      {outfit === 'sports_top' && (
        <>
          <path
            d={`M${cx - shoulderW / 2 + 2},${shoulderY + 2} Q${cx},${shoulderY + 6} ${cx + shoulderW / 2 - 2},${shoulderY + 2}`}
            stroke={topAccent} strokeWidth="2.5" fill="none" strokeLinecap="round"
          />
          <path
            d={`M${cx - shoulderW / 2 + 4},${shoulderY + 7} Q${cx},${shoulderY + 11} ${cx + shoulderW / 2 - 4},${shoulderY + 7}`}
            stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" fill="none" strokeLinecap="round"
          />
        </>
      )}
      {/* Polo collar */}
      {outfit === 'polo' && (
        <>
          <path
            d={`M${cx - 8},${shoulderY + 2} L${cx - 4},${shoulderY + 8} L${cx},${shoulderY + 5} L${cx + 4},${shoulderY + 8} L${cx + 8},${shoulderY + 2}`}
            fill={topAccent} stroke="rgba(255,255,255,0.2)" strokeWidth="0.5"
          />
        </>
      )}
      {/* Leotard */}
      {outfit === 'leotard' && (
        <>
          <ellipse cx={cx} cy={shoulderY + 10} rx={shoulderW / 2} ry={14} fill={top} />
          <ellipse cx={cx} cy={shoulderY + 10} rx={shoulderW / 2 - 4} ry={12} fill={topAccent} fillOpacity="0.3" />
        </>
      )}
      {/* Male muscle line */}
      {muscleDef && (
        <>
          <line x1={cx - 8} y1={shoulderY + 8} x2={cx - 8} y2={shoulderY + 20} stroke="rgba(0,0,0,0.08)" strokeWidth="1.5" />
          <line x1={cx + 8} y1={shoulderY + 8} x2={cx + 8} y2={shoulderY + 20} stroke="rgba(0,0,0,0.08)" strokeWidth="1.5" />
        </>
      )}

      {/* ── Head ── */}
      <ellipse
        cx={cx} cy={headY + headH / 2}
        rx={headW / 2} ry={headH / 2}
        fill={skin}
      />
      {/* Jaw shadow */}
      <ellipse
        cx={cx} cy={headY + headH - 4}
        rx={headW / 2 - 2} ry={5}
        fill="rgba(0,0,0,0.06)"
      />
      {/* Cheek blush */}
      {gender === 'female' && (
        <>
          <ellipse cx={cx - 9} cy={headY + headH / 2 + 3} rx={4} ry={2.5} fill="#FFB0A0" fillOpacity="0.35" />
          <ellipse cx={cx + 9} cy={headY + headH / 2 + 3} rx={4} ry={2.5} fill="#FFB0A0" fillOpacity="0.35" />
        </>
      )}

      {/* ── Eyes ── */}
      {/* Eye whites */}
      <ellipse cx={cx - 7} cy={headY + headH / 2 - 1} rx={4.5} ry={3} fill="white" />
      <ellipse cx={cx + 7} cy={headY + headH / 2 - 1} rx={4.5} ry={3} fill="white" />
      {/* Irises */}
      <ellipse cx={cx - 7} cy={headY + headH / 2 - 0.5} rx={2.8} ry={2.8} fill={eyes} />
      <ellipse cx={cx + 7} cy={headY + headH / 2 - 0.5} rx={2.8} ry={2.8} fill={eyes} />
      {/* Pupils */}
      <ellipse cx={cx - 7} cy={headY + headH / 2 - 0.5} rx={1.5} ry={1.5} fill="#0A0A0A" />
      <ellipse cx={cx + 7} cy={headY + headH / 2 - 0.5} rx={1.5} ry={1.5} fill="#0A0A0A" />
      {/* Eye shine */}
      <ellipse cx={cx - 6.2} cy={headY + headH / 2 - 1.5} rx={0.8} ry={0.8} fill="white" fillOpacity="0.9" />
      <ellipse cx={cx + 7.8} cy={headY + headH / 2 - 1.5} rx={0.8} ry={0.8} fill="white" fillOpacity="0.9" />
      {/* Lashes / brows */}
      {gender === 'female' ? (
        <>
          <path d={`M${cx - 11},${headY + headH / 2 - 4.5} Q${cx - 7},${headY + headH / 2 - 6} ${cx - 3},${headY + headH / 2 - 4.5}`} stroke="#1A0A00" strokeWidth="1.2" fill="none" strokeLinecap="round" />
          <path d={`M${cx + 3},${headY + headH / 2 - 4.5} Q${cx + 7},${headY + headH / 2 - 6} ${cx + 11},${headY + headH / 2 - 4.5}`} stroke="#1A0A00" strokeWidth="1.2" fill="none" strokeLinecap="round" />
        </>
      ) : (
        <>
          <rect x={cx - 11} y={headY + headH / 2 - 5.5} width={9} height={1.8} rx={0.9} fill={hair} />
          <rect x={cx + 2} y={headY + headH / 2 - 5.5} width={9} height={1.8} rx={0.9} fill={hair} />
        </>
      )}

      {/* ── Nose ── */}
      <ellipse cx={cx} cy={headY + headH / 2 + 3.5} rx={1.5} ry={1} fill="rgba(0,0,0,0.1)" />

      {/* ── Mouth ── */}
      <path
        d={`M${cx - 4.5},${headY + headH / 2 + 8} Q${cx},${headY + headH / 2 + 11} ${cx + 4.5},${headY + headH / 2 + 8}`}
        stroke={lips} strokeWidth="1.8" fill="none" strokeLinecap="round"
      />
      {/* Smile lines */}
      <path d={`M${cx - 5},${headY + headH / 2 + 7.5} Q${cx - 6.5},${headY + headH / 2 + 9} ${cx - 5.5},${headY + headH / 2 + 10.5}`} stroke="rgba(0,0,0,0.08)" strokeWidth="0.8" fill="none" />
      <path d={`M${cx + 5},${headY + headH / 2 + 7.5} Q${cx + 6.5},${headY + headH / 2 + 9} ${cx + 5.5},${headY + headH / 2 + 10.5}`} stroke="rgba(0,0,0,0.08)" strokeWidth="0.8" fill="none" />

      {/* ── Hair ── */}
      <HairStyle style={hairStyle} hair={hair} cx={cx} headY={headY} headW={headW} headH={headH} headband={headband} />

      {/* ── Ears ── */}
      <ellipse cx={cx - headW / 2 + 1} cy={headY + headH / 2} rx={2.5} ry={3.5} fill={skin} />
      <ellipse cx={cx + headW / 2 - 1} cy={headY + headH / 2} rx={2.5} ry={3.5} fill={skin} />
    </svg>
  );
}

// ─── Athletic Hairstyles ─────────────────────────────────────────────────────
function HairStyle({ style, hair, cx, headY, headW, headH, headband }) {
  const top = headY - 4;
  const mid = headY + headH / 2;
  const accent = shadeColor(hair, -20);

  const hb = headband && (
    <rect x={cx - headW / 2 - 1} y={headY + 2} width={headW + 2} height={4} rx={2} fill={headband} fillOpacity="0.85" />
  );

  switch (style) {
    case 'ponytail_athletic':
      return (
        <g>
          {/* Cap of hair */}
          <ellipse cx={cx} cy={top + 6} rx={headW / 2 + 1} ry={10} fill={hair} />
          <ellipse cx={cx} cy={top + 2} rx={headW / 2} ry={7} fill={hair} />
          {/* Sides */}
          <rect x={cx - headW / 2 - 1} y={top + 4} width={4} height={14} rx={2} fill={hair} />
          <rect x={cx + headW / 2 - 3} y={top + 4} width={4} height={14} rx={2} fill={hair} />
          {/* Ponytail */}
          <path d={`M${cx + 4},${top + 4} Q${cx + headW / 2 + 6},${mid - 4} ${cx + headW / 2 + 4},${mid + 12}`} stroke={hair} strokeWidth="5" fill="none" strokeLinecap="round" />
          <path d={`M${cx + 4},${top + 4} Q${cx + headW / 2 + 8},${mid - 2} ${cx + headW / 2 + 6},${mid + 12}`} stroke={accent} strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.5" />
          {/* Hair tie */}
          <circle cx={cx + headW / 2 + 3} cy={top + 8} r={3} fill={headband || '#E0E0E0'} />
          {hb}
        </g>
      );
    case 'bun_athletic':
      return (
        <g>
          <ellipse cx={cx} cy={top + 6} rx={headW / 2 + 1} ry={10} fill={hair} />
          <ellipse cx={cx} cy={top + 2} rx={headW / 2} ry={7} fill={hair} />
          {/* Bun on top */}
          <circle cx={cx} cy={top - 1} r={7} fill={hair} />
          <circle cx={cx} cy={top - 2} r={5} fill={accent} fillOpacity="0.5" />
          <circle cx={cx} cy={top - 1} r={2} fill={hair} stroke={accent} strokeWidth="1" />
          {/* Sides */}
          <rect x={cx - headW / 2 - 1} y={top + 4} width={4} height={16} rx={2} fill={hair} />
          <rect x={cx + headW / 2 - 3} y={top + 4} width={4} height={16} rx={2} fill={hair} />
          {hb}
        </g>
      );
    case 'braid':
      return (
        <g>
          <ellipse cx={cx} cy={top + 6} rx={headW / 2 + 1} ry={10} fill={hair} />
          <ellipse cx={cx} cy={top + 2} rx={headW / 2} ry={7} fill={hair} />
          {/* Braid down side */}
          <path d={`M${cx + 3},${top + 4} Q${cx + headW / 2 + 2},${mid} ${cx + headW / 2},${mid + 16}`} stroke={hair} strokeWidth="5" fill="none" strokeLinecap="round" />
          {/* Braid texture */}
          {[0, 5, 10, 15, 20].map((offset, i) => (
            <ellipse key={i} cx={cx + headW / 2 + 1} cy={mid - 2 + offset} rx={3} ry={2} fill={accent} fillOpacity="0.5" />
          ))}
          {hb}
        </g>
      );
    case 'curly_athletic':
      return (
        <g>
          {/* Curly puffs */}
          {[-8, -4, 0, 4, 8].map((xOff, i) => (
            <ellipse key={i} cx={cx + xOff} cy={top + 2 + (i % 2) * 3} rx={5} ry={6} fill={hair} />
          ))}
          <ellipse cx={cx} cy={top + 5} rx={headW / 2} ry={8} fill={hair} />
          {/* Sides */}
          <ellipse cx={cx - headW / 2 + 2} cy={mid - 2} rx={4} ry={7} fill={hair} />
          <ellipse cx={cx + headW / 2 - 2} cy={mid - 2} rx={4} ry={7} fill={hair} />
          {hb}
        </g>
      );
    case 'straight_athletic':
      return (
        <g>
          <ellipse cx={cx} cy={top + 5} rx={headW / 2 + 2} ry={9} fill={hair} />
          {/* Straight sides */}
          <rect x={cx - headW / 2 - 2} y={top + 4} width={5} height={20} rx={2.5} fill={hair} />
          <rect x={cx + headW / 2 - 3} y={top + 4} width={5} height={20} rx={2.5} fill={hair} />
          {/* Shine */}
          <path d={`M${cx - 4},${top} Q${cx},${top + 6} ${cx - 2},${top + 12}`} stroke="rgba(255,255,255,0.2)" strokeWidth="2" fill="none" strokeLinecap="round" />
          {hb}
        </g>
      );
    case 'short_athletic':
      return (
        <g>
          <ellipse cx={cx} cy={top + 5} rx={headW / 2 + 1} ry={8} fill={hair} />
          <ellipse cx={cx} cy={top + 2} rx={headW / 2 - 1} ry={6} fill={hair} />
          {/* Sides — close cropped */}
          <rect x={cx - headW / 2 - 1} y={top + 4} width={4} height={10} rx={2} fill={hair} />
          <rect x={cx + headW / 2 - 3} y={top + 4} width={4} height={10} rx={2} fill={hair} />
          {/* Fade / taper effect */}
          <rect x={cx - headW / 2 - 1} y={top + 10} width={4} height={6} rx={2} fill={hair} fillOpacity="0.5" />
          <rect x={cx + headW / 2 - 3} y={top + 10} width={4} height={6} rx={2} fill={hair} fillOpacity="0.5" />
        </g>
      );
    case 'fade':
      return (
        <g>
          {/* Top — slightly longer */}
          <ellipse cx={cx} cy={top + 4} rx={headW / 2 - 1} ry={7} fill={hair} />
          {/* Very tight sides — fade */}
          <rect x={cx - headW / 2 - 1} y={top + 4} width={4} height={8} rx={2} fill={hair} fillOpacity="0.7" />
          <rect x={cx + headW / 2 - 3} y={top + 4} width={4} height={8} rx={2} fill={hair} fillOpacity="0.7" />
          <rect x={cx - headW / 2 - 1} y={top + 8} width={4} height={6} rx={2} fill={hair} fillOpacity="0.3" />
          <rect x={cx + headW / 2 - 3} y={top + 8} width={4} height={6} rx={2} fill={hair} fillOpacity="0.3" />
        </g>
      );
    case 'buzz':
    default:
      return (
        <g>
          {/* Ultra short buzz */}
          <ellipse cx={cx} cy={top + 5} rx={headW / 2 + 1} ry={7} fill={hair} fillOpacity="0.85" />
          <ellipse cx={cx} cy={top + 3} rx={headW / 2} ry={5} fill={hair} />
        </g>
      );
  }
}

// ─── Shade color helper ──────────────────────────────────────────────────────
function shadeColor(hex, amount) {
  try {
    let num = parseInt(hex.replace('#', ''), 16);
    const r = Math.min(255, Math.max(0, (num >> 16) + amount));
    const g = Math.min(255, Math.max(0, ((num >> 8) & 0xff) + amount));
    const b = Math.min(255, Math.max(0, (num & 0xff) + amount));
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  } catch { return hex; }
}

// ─── AvatarFigure — Public API ───────────────────────────────────────────────
export default function AvatarFigure({ personaKey, size = 'sm', animated = false }) {
  const config = CONFIGS[personaKey] || CONFIGS.wellness_concierge;
  const s = SIZES[size] || SIZES.sm;

  return (
    <motion.div
      animate={animated ? { y: [0, -3, 0] } : {}}
      transition={animated ? { duration: 2.5, repeat: Infinity, ease: 'easeInOut' } : {}}
      style={{ width: s.w, height: s.h, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      <AthleticPortrait config={config} size={size} />
    </motion.div>
  );
}