import React from 'react';
import { motion } from 'framer-motion';

export default function ChromosomeGraphic({ accentColor = '#0B8B7A' }) {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      {/* Shortened telomeres (aging) */}
      <div className="bg-gradient-to-b from-gray-900 to-gray-800 rounded-2xl overflow-hidden p-6">
        <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-4">Without Support (Aging)</p>
        <svg viewBox="0 0 200 160" className="w-full h-[160px]">
          {/* Chromatids */}
          <rect x="80" y="20" width="16" height="55" rx="8" fill="#666" />
          <rect x="104" y="20" width="16" height="55" rx="8" fill="#666" />
          <rect x="80" y="70" width="40" height="20" rx="4" fill="#888" />
          <rect x="80" y="85" width="16" height="55" rx="8" fill="#666" />
          <rect x="104" y="85" width="16" height="55" rx="8" fill="#666" />
          {/* Telomeres — short and fading */}
          {[18, 142].map((cy, idx) =>
            [88, 112].map((cx, jdx) => (
              <motion.circle
                key={`${idx}-${jdx}`}
                cx={cx} cy={cy} r="6" fill="#FF2020" opacity="0.4"
                animate={{ r: [6, 4, 6], opacity: [0.4, 0.2, 0.4] }}
                transition={{ duration: 3, repeat: Infinity, delay: (idx * 2 + jdx) * 0.5 }}
              />
            ))
          )}
        </svg>
        <p className="text-xs text-gray-500 text-center mt-2">Telomeres shorten with each cell division</p>
      </div>

      {/* Supported telomeres */}
      <div className="bg-gradient-to-b from-gray-900 to-gray-800 rounded-2xl overflow-hidden p-6">
        <p className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: accentColor }}>With Peptide Support</p>
        <svg viewBox="0 0 200 160" className="w-full h-[160px]">
          {/* Chromatids */}
          <rect x="80" y="20" width="16" height="55" rx="8" fill="#666" />
          <rect x="104" y="20" width="16" height="55" rx="8" fill="#666" />
          <rect x="80" y="70" width="40" height="20" rx="4" fill="#888" />
          <rect x="80" y="85" width="16" height="55" rx="8" fill="#666" />
          <rect x="104" y="85" width="16" height="55" rx="8" fill="#666" />
          {/* Telomeres — full and glowing */}
          {[18, 142].map((cy, idx) =>
            [88, 112].map((cx, jdx) => (
              <g key={`${idx}-${jdx}`}>
                <motion.circle
                  cx={cx} cy={cy} r="14" fill={accentColor} opacity="0.2"
                  animate={{ r: [14, 18, 14], opacity: [0.2, 0.1, 0.2] }}
                  transition={{ duration: 2, repeat: Infinity, delay: (idx * 2 + jdx) * 0.5 }}
                />
                <motion.circle
                  cx={cx} cy={cy} r="10" fill={accentColor}
                  animate={{ opacity: [0.6, 1, 0.6], r: [10, 12, 10] }}
                  transition={{ duration: 2, repeat: Infinity, delay: (idx * 2 + jdx) * 0.5 }}
                />
              </g>
            ))
          )}
        </svg>
        <p className="text-xs text-center mt-2 font-medium" style={{ color: accentColor }}>
          Telomeres maintained — cellular longevity support
        </p>
      </div>
    </div>
  );
}