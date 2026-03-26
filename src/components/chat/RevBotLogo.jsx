import React from 'react';

/**
 * Rev Bot Logo — modern minimal medical-AI mark
 * Concept: A hexagon (precision/tech) with a heartbeat pulse line through the center,
 * and a subtle "R" notch — evoking clinical intelligence + vitality.
 */
export default function RevBotLogo({ size = 24, color = 'white', className = '' }) {
  const s = size;
  const cx = s / 2;
  const cy = s / 2;
  const r = s * 0.42;

  // Hexagon points
  const hex = Array.from({ length: 6 }, (_, i) => {
    const angle = (Math.PI / 180) * (60 * i - 30);
    return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
  }).join(' ');

  // Pulse / ECG path through the middle
  const pw = s * 0.55;
  const ph = s * 0.18;
  const px0 = cx - pw / 2;
  const px1 = cx - pw * 0.25;
  const px2 = cx - pw * 0.1;
  const px3 = cx;
  const px4 = cx + pw * 0.1;
  const px5 = cx + pw * 0.25;
  const px6 = cx + pw / 2;

  const pulsePath = `M${px0},${cy} L${px1},${cy} L${px2},${cy - ph} L${px3},${cy + ph} L${px4},${cy - ph * 0.5} L${px5},${cy} L${px6},${cy}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${s} ${s}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Rev Bot"
    >
      {/* Hex outline */}
      <polygon
        points={hex}
        stroke={color}
        strokeWidth={s * 0.07}
        strokeLinejoin="round"
        fill={color}
        fillOpacity="0.1"
      />

      {/* Pulse line */}
      <path
        d={pulsePath}
        stroke={color}
        strokeWidth={s * 0.085}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Dot — peak accent */}
      <circle cx={px3} cy={cy + ph} r={s * 0.06} fill={color} />
    </svg>
  );
}