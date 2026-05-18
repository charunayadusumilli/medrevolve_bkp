import React from 'react';

/**
 * Premium 3D Avatar - Sleek, modern professional figure
 * High-quality SVG with smooth gradients and polished design
 */
export default function Avatar3D({ size = 80, animated = true }) {
  return (
    <div 
      className="relative"
      style={{ 
        width: size, 
        height: size * 1.4,
        filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.2))'
      }}
    >
      <svg
        viewBox="0 0 120 168"
        width={size}
        height={size * 1.4}
        xmlns="http://www.w3.org/2000/svg"
        className={animated ? 'avatar-float' : ''}
      >
        <defs>
          {/* Premium skin gradient */}
          <linearGradient id="skinGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E8B88C" />
            <stop offset="50%" stopColor="#D4A574" />
            <stop offset="100%" stopColor="#C49563" />
          </linearGradient>
          
          {/* Modern hair gradient */}
          <linearGradient id="hairGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#4A3728" />
            <stop offset="100%" stopColor="#2D1F14" />
          </linearGradient>
          
          {/* Premium shirt gradient - Teal/Blue */}
          <linearGradient id="shirtGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#5B8BA8" />
            <stop offset="50%" stopColor="#4A7C96" />
            <stop offset="100%" stopColor="#3D6A82" />
          </linearGradient>
          
          {/* Pants gradient */}
          <linearGradient id="pantsGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#2A2A2A" />
            <stop offset="100%" stopColor="#1A1A1A" />
          </linearGradient>
          
          {/* Shadow */}
          <radialGradient id="avatarShadow" cx="50%" cy="100%" r="50%">
            <stop offset="0%" stopColor="rgba(0,0,0,0.15)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0)" />
          </radialGradient>
          
          {/* Glow ring */}
          <radialGradient id="glowRing" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(91, 139, 168, 0.3)" />
            <stop offset="100%" stopColor="rgba(91, 139, 168, 0)" />
          </radialGradient>
        </defs>
        
        {/* Background glow */}
        <circle cx="60" cy="84" r="55" fill="url(#glowRing)" className={animated ? 'glow-pulse' : ''} />
        
        {/* Shadow base */}
        <ellipse cx="60" cy="162" rx="35" ry="6" fill="url(#avatarShadow)" />
        
        {/* Body Group */}
        <g className={animated ? 'body-breathe' : ''}>
          {/* Legs */}
          <path d="M 48 108 L 46 148 L 52 148 L 54 108 Z" fill="url(#pantsGradient)" />
          <path d="M 72 108 L 74 148 L 68 148 L 66 108 Z" fill="url(#pantsGradient)" />
          
          {/* Shoes - sleek modern design */}
          <path d="M 44 148 Q 44 145 48 145 L 54 145 Q 58 145 58 148 L 58 152 Q 58 155 54 155 L 48 155 Q 44 155 44 152 Z" fill="#1a1a1a" />
          <path d="M 66 148 Q 66 145 70 145 L 76 145 Q 80 145 80 148 L 80 152 Q 80 155 76 155 L 70 155 Q 66 155 66 152 Z" fill="#1a1a1a" />
          <ellipse cx="51" cy="153" rx="5" ry="2" fill="#3a4a5a" opacity="0.6" />
          <ellipse cx="73" cy="153" rx="5" ry="2" fill="#3a4a5a" opacity="0.6" />
          
          {/* Torso - streamlined */}
          <path d="M 42 62 L 38 108 Q 38 112 42 112 L 78 112 Q 82 112 82 108 L 78 62 Q 78 58 60 58 Q 42 58 42 62" fill="url(#shirtGradient)" />
          
          {/* Shirt details - subtle */}
          <path d="M 42 65 L 40 108" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
          <path d="M 78 65 L 80 108" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
          
          {/* Arms - smooth curves */}
          <path d="M 42 65 Q 32 70 28 88 Q 26 95 30 98" stroke="url(#skinGradient)" strokeWidth="7" fill="none" strokeLinecap="round" />
          <path d="M 78 65 Q 88 70 92 88 Q 94 95 90 98" stroke="url(#skinGradient)" strokeWidth="7" fill="none" strokeLinecap="round" />
          
          {/* Hands - simple elegant */}
          <ellipse cx="30" cy="100" rx="5" ry="6" fill="url(#skinGradient)" />
          <ellipse cx="90" cy="100" rx="5" ry="6" fill="url(#skinGradient)" />
        </g>
        
        {/* Neck */}
        <rect x="54" y="48" width="12" height="12" fill="url(#skinGradient)" />
        
        {/* Head - perfect circle */}
        <circle cx="60" cy="38" r="18" fill="url(#skinGradient)" />
        
        {/* Hair - modern styled */}
        <path d="M 42 32 Q 42 18 60 18 Q 78 18 78 32 L 78 38 Q 78 45 60 45 Q 42 45 42 38 Z" fill="url(#hairGradient)" />
        <path d="M 44 30 Q 46 22 60 20 Q 74 22 76 30" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
        
        {/* Face - minimal professional */}
        <circle cx="55" cy="36" r="2.5" fill="#2A2A2A" />
        <circle cx="65" cy="36" r="2.5" fill="#2A2A2A" />
        <path d="M 56 42 Q 60 44 64 42" stroke="#B8956A" strokeWidth="1.2" fill="none" strokeLinecap="round" />
        
        {/* Subtle facial highlights */}
        <ellipse cx="53" cy="34" rx="2" ry="3" fill="white" opacity="0.12" />
        <ellipse cx="67" cy="34" rx="2" ry="3" fill="white" opacity="0.12" />
        
        {/* Overall body highlight for 3D effect */}
        <ellipse cx="60" cy="80" rx="30" ry="45" fill="white" opacity="0.04" />
      </svg>
      
      <style>{`
        @keyframes avatarFloat {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-8px) rotate(0.5deg); }
        }
        @keyframes bodyBreathe {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.01); }
        }
        @keyframes glowPulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.05); }
        }
        .avatar-float {
          animation: avatarFloat 4s ease-in-out infinite;
        }
        .body-breathe {
          animation: bodyBreathe 3s ease-in-out infinite;
        }
        .glow-pulse {
          animation: glowPulse 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}