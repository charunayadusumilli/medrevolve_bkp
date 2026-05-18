import React from 'react';

/**
 * Sleek 3D Avatar — modern, minimalist figure
 * Inspired by contemporary 3D design (similar to the reference avatar)
 */
export default function Avatar3D({ size = 120, animated = true }) {
  return (
    <div 
      className="flex items-center justify-center relative"
      style={{ width: size, height: size * 1.2 }}
    >
      <svg
        viewBox="0 0 100 140"
        width={size}
        height={size * 1.2}
        xmlns="http://www.w3.org/2000/svg"
        className={animated ? 'animate-float' : ''}
        style={{
          filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.15))',
        }}
      >
        {/* Background gradient circle */}
        <defs>
          <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#4A7C96', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#2D5A7B', stopOpacity: 1 }} />
          </linearGradient>
          <linearGradient id="skinGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#D4A574', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#C49563', stopOpacity: 1 }} />
          </linearGradient>
          <linearGradient id="hairGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#3D2817', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#2A1810', stopOpacity: 1 }} />
          </linearGradient>
          <radialGradient id="glowGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" style={{ stopColor: '#ffffff', stopOpacity: 0.1 }} />
            <stop offset="100%" style={{ stopColor: '#ffffff', stopOpacity: 0 }} />
          </radialGradient>
        </defs>

        {/* Base circle glow */}
        <circle cx="50" cy="130" r="35" fill="url(#glowGrad)" />
        <ellipse cx="50" cy="132" rx="32" ry="4" fill="rgba(0,0,0,0.08)" />

        {/* Head */}
        <circle cx="50" cy="30" r="18" fill="url(#skinGrad)" />
        
        {/* Hair */}
        <path d="M 32 25 Q 32 8 50 8 Q 68 8 68 25 L 68 32 Q 50 38 32 32 Z" fill="url(#hairGrad)" />
        <path d="M 35 28 Q 35 15 50 12 Q 65 15 65 28" fill="#2A1810" opacity="0.3" />
        
        {/* Face */}
        <circle cx="46" cy="28" r="2.5" fill="#1a1a1a" />
        <circle cx="54" cy="28" r="2.5" fill="#1a1a1a" />
        <path d="M 46 34 Q 50 36 54 34" stroke="#A67C52" strokeWidth="1" fill="none" strokeLinecap="round" />
        
        {/* Subtle highlight on face */}
        <ellipse cx="44" cy="26" rx="3" ry="4" fill="white" opacity="0.15" />

        {/* Shirt - Blue/Teal with depth */}
        <path 
          d="M 32 45 L 28 75 Q 28 80 32 80 L 68 80 Q 72 80 72 75 L 68 45 Z" 
          fill="url(#bodyGrad)"
        />
        
        {/* Shirt details - pocket */}
        <rect x="34" y="52" width="6" height="8" fill="rgba(0,0,0,0.1)" rx="1" />
        <rect x="60" y="52" width="6" height="8" fill="rgba(0,0,0,0.1)" rx="1" />
        
        {/* Shirt collar/button line */}
        <line x1="50" y1="45" x2="50" y2="70" stroke="rgba(255,255,255,0.2)" strokeWidth="0.8" />
        <circle cx="50" cy="50" r="1.5" fill="rgba(0,0,0,0.2)" />
        <circle cx="50" cy="56" r="1.5" fill="rgba(0,0,0,0.2)" />
        
        {/* Shirt highlight */}
        <ellipse cx="38" cy="55" rx="8" ry="15" fill="white" opacity="0.12" />

        {/* Left Arm */}
        <g>
          <path d="M 32 50 Q 15 52 12 70" stroke="url(#skinGrad)" strokeWidth="6" fill="none" strokeLinecap="round" />
          <ellipse cx="12" cy="72" rx="4" ry="5" fill="url(#skinGrad)" />
        </g>

        {/* Right Arm */}
        <g>
          <path d="M 68 50 Q 85 52 88 70" stroke="url(#skinGrad)" strokeWidth="6" fill="none" strokeLinecap="round" />
          <ellipse cx="88" cy="72" rx="4" ry="5" fill="url(#skinGrad)" />
        </g>

        {/* Pants - Black */}
        <path d="M 35 80 L 33 115 L 40 115 L 42 80 Z" fill="#1a1a1a" />
        <path d="M 65 80 L 67 115 L 60 115 L 58 80 Z" fill="#1a1a1a" />
        
        {/* Pants highlight/seam */}
        <line x1="40" y1="80" x2="38" y2="115" stroke="rgba(255,255,255,0.1)" strokeWidth="0.6" />
        <line x1="60" y1="80" x2="62" y2="115" stroke="rgba(255,255,255,0.1)" strokeWidth="0.6" />

        {/* Shoes */}
        <ellipse cx="38" cy="118" rx="5.5" ry="3.5" fill="#0a0a0a" />
        <ellipse cx="62" cy="118" rx="5.5" ry="3.5" fill="#0a0a0a" />
        <ellipse cx="38" cy="117" rx="5" ry="2" fill="#2a3a3a" />
        <ellipse cx="62" cy="117" rx="5" ry="2" fill="#2a3a3a" />

        {/* Overall subtle 3D depth highlight */}
        <ellipse cx="50" cy="50" rx="28" ry="32" fill="white" opacity="0.05" />
      </svg>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}