import React from 'react';

/**
 * Rev Bot — minimal modern logo
 * A stylized "R" made from a pulse/signal arc + vertical stem,
 * evoking medical vitality + AI precision.
 */
export default function RevBotLogo({ size = 24, color = 'white', className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Rev Bot"
    >
      {/* Outer circle — AI aura ring */}
      <circle cx="12" cy="12" r="10.5" stroke={color} strokeWidth="1.2" strokeOpacity="0.35" />

      {/* Inner circle — core */}
      <circle cx="12" cy="12" r="7.5" fill={color} fillOpacity="0.12" />

      {/* Stylized "R" — stem + leg + ear */}
      {/* Vertical stem */}
      <line x1="8.5" y1="7" x2="8.5" y2="17" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      {/* Top horizontal + half bowl */}
      <path
        d="M8.5 7 Q14.5 7 14.5 10 Q14.5 13 8.5 13"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Diagonal leg */}
      <line x1="8.5" y1="13" x2="15" y2="17" stroke={color} strokeWidth="1.8" strokeLinecap="round" />

      {/* Pulse dot — top right accent */}
      <circle cx="17.5" cy="7" r="1.4" fill={color} fillOpacity="0.85" />
    </svg>
  );
}