import React from 'react';
import { motion } from 'framer-motion';

export default function MiniMoleculeBadge({ color = '#0B8B7A', size = 40 }) {
  const center = 22;
  const r = 13;
  const atoms = [
    { angle: -90, fill: color },
    { angle: 30, fill: '#3050F8' },
    { angle: 150, fill: '#FF2020' },
  ];

  return (
    <svg viewBox="0 0 44 44" style={{ width: size, height: size }} className="overflow-visible">
      {/* Static central atom */}
      <circle cx={center} cy={center} r="5" fill={color} opacity="0.9" />
      {/* Rotating bonds + atoms */}
      <motion.g
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
      >
        {atoms.map((a, i) => {
          const rad = (a.angle * Math.PI) / 180;
          const x = center + Math.cos(rad) * r;
          const y = center + Math.sin(rad) * r;
          return (
            <g key={i}>
              <line x1={center} y1={center} x2={x} y2={y} stroke={a.fill} strokeWidth="1.5" opacity="0.3" />
              <circle cx={x} cy={y} r="3.5" fill={a.fill} opacity="0.7" />
            </g>
          );
        })}
      </motion.g>
    </svg>
  );
}