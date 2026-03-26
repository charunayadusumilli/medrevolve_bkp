import React from 'react';

/**
 * Rev Bot Logo — static SVG, no dynamic calculations.
 * Hexagon frame + ECG pulse line.
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
    >
      {/* Hexagon */}
      <polygon
        points="12,2.5 20.5,7.25 20.5,16.75 12,21.5 3.5,16.75 3.5,7.25"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
        fill={color}
        fillOpacity="0.1"
      />
      {/* ECG pulse line */}
      <polyline
        points="4.5,12 8,12 9.5,8.5 12,15.5 14,10 15.5,12 19.5,12"
        stroke={color}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}