import React from 'react';
import { motion } from 'framer-motion';

export default function CellularBindingAnimation({ accentColor = '#0B8B7A' }) {
  const signalParticles = Array.from({ length: 10 });

  return (
    <div className="relative w-full h-[300px] bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 rounded-2xl overflow-hidden">
      <svg viewBox="0 0 400 300" className="w-full h-full">
        {/* Labels */}
        <text x="15" y="25" fill="#666" fontSize="9" fontWeight="700" letterSpacing="2">EXTRACELLULAR</text>
        <text x="15" y="290" fill="#666" fontSize="9" fontWeight="700" letterSpacing="2">INTRACELLULAR</text>

        {/* Cell membrane — animated wavy path */}
        <motion.path
          d="M 0 150 Q 50 135 100 150 T 200 150 T 300 150 T 400 150"
          stroke={accentColor}
          strokeWidth="2"
          fill="none"
          opacity="0.4"
          animate={{
            d: [
              'M 0 150 Q 50 135 100 150 T 200 150 T 300 150 T 400 150',
              'M 0 150 Q 50 165 100 150 T 200 150 T 300 150 T 400 150',
              'M 0 150 Q 50 135 100 150 T 200 150 T 300 150 T 400 150',
            ],
          }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Phospholipid heads */}
        {Array.from({ length: 20 }).map((_, i) => (
          <circle key={i} cx={i * 20 + 10} cy={150} r="2.5" fill={accentColor} opacity="0.25" />
        ))}

        {/* Receptor protein — outer */}
        <motion.ellipse
          cx="200" cy="150" rx="22" ry="38"
          fill={accentColor} opacity="0.25"
          animate={{
            opacity: [0.25, 0.25, 0.5, 0.5, 0.25],
            rx: [22, 22, 26, 26, 22],
            ry: [38, 38, 42, 42, 38],
          }}
          transition={{ duration: 8, repeat: Infinity, times: [0, 0.2, 0.3, 0.7, 0.8] }}
        />
        {/* Receptor protein — inner */}
        <motion.ellipse
          cx="200" cy="150" rx="14" ry="28"
          fill={accentColor} opacity="0.15"
          animate={{ opacity: [0.15, 0.15, 0.3, 0.3, 0.15] }}
          transition={{ duration: 8, repeat: Infinity, times: [0, 0.2, 0.3, 0.7, 0.8] }}
        />

        {/* Peptide molecule — descends and binds */}
        <motion.g
          animate={{
            y: [0, 0, 80, 80, 0],
            opacity: [1, 1, 1, 1, 0],
            scale: [1, 1, 0.85, 0.85, 1],
          }}
          transition={{ duration: 8, repeat: Infinity, times: [0, 0.2, 0.3, 0.7, 0.8] }}
        >
          {/* Bonds */}
          <line x1="190" y1="55" x2="200" y2="48" stroke="#666" strokeWidth="1.5" />
          <line x1="200" y1="48" x2="210" y2="55" stroke="#666" strokeWidth="1.5" />
          <line x1="190" y1="55" x2="195" y2="65" stroke="#666" strokeWidth="1.5" />
          <line x1="210" y1="55" x2="205" y2="65" stroke="#666" strokeWidth="1.5" />
          {/* Atoms */}
          <circle cx="190" cy="55" r="6" fill={accentColor} />
          <circle cx="200" cy="48" r="5" fill="#3050F8" />
          <circle cx="210" cy="55" r="6" fill="#FF2020" />
          <circle cx="195" cy="65" r="4" fill="#FFCC00" />
          <circle cx="205" cy="65" r="4" fill="#FFCC00" />
        </motion.g>

        {/* Binding flash */}
        <motion.circle
          cx="200" cy="135" r="0" fill={accentColor} opacity="0"
          animate={{ r: [0, 0, 30, 0, 0], opacity: [0, 0, 0.4, 0, 0] }}
          transition={{ duration: 8, repeat: Infinity, times: [0, 0.25, 0.3, 0.35, 1] }}
        />

        {/* Signal cascade particles */}
        {signalParticles.map((_, i) => (
          <motion.circle
            key={i}
            cx={200 + (i - 5) * 12}
            cy="175"
            r="3"
            fill={accentColor}
            animate={{ cy: [175, 260], opacity: [0, 1, 0], r: [2, 4, 2] }}
            transition={{ duration: 2.5, repeat: Infinity, delay: 3 + i * 0.15, ease: 'easeOut' }}
          />
        ))}

        {/* Signal arrows */}
        <motion.g
          animate={{ opacity: [0, 0, 0.6, 0.6, 0] }}
          transition={{ duration: 8, repeat: Infinity, times: [0, 0.3, 0.4, 0.7, 0.8] }}
        >
          <path d="M 200 180 L 195 195 M 200 180 L 205 195" stroke={accentColor} strokeWidth="2" fill="none" />
          <path d="M 180 180 L 175 195 M 180 180 L 185 195" stroke={accentColor} strokeWidth="2" fill="none" opacity="0.6" />
          <path d="M 220 180 L 215 195 M 220 180 L 225 195" stroke={accentColor} strokeWidth="2" fill="none" opacity="0.6" />
        </motion.g>
      </svg>
    </div>
  );
}