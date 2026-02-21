import React from 'react';

/**
 * MR Branded Pharmaceutical Visuals
 * AI-generated SVG graphics for:
 * - Auto-injector pens (Semaglutide, Tirzepatide)
 * - Vials (B12, NAD+, Glutathione, etc.)
 * - Pills/Capsules (Oral medications)
 * - Flashcard style product displays
 */

// ─── Auto-Injector Pen (Semaglutide/Tirzepatide Style) ───────────────────────
export function MRAutoPen({ accentColor = '#2D3A2D', productName = 'Semaglutide', size = 'md' }) {
  const dims = size === 'sm' ? { w: 60, h: 140 } : size === 'lg' ? { w: 100, h: 240 } : { w: 80, h: 180 };
  
  return (
    <svg width={dims.w} height={dims.h} viewBox={`0 0 ${dims.w} ${dims.h}`} fill="none">
      {/* Grip section (bottom) */}
      <rect x={dims.w * 0.15} y={dims.h * 0.75} width={dims.w * 0.7} height={dims.h * 0.18} rx={dims.w * 0.1} fill="#E8ECE8"/>
      <rect x={dims.w * 0.18} y={dims.h * 0.78} width={dims.w * 0.64} height={dims.h * 0.12} rx={dims.w * 0.08} fill="white" opacity="0.4"/>
      
      {/* Main barrel */}
      <rect x={dims.w * 0.2} y={dims.h * 0.15} width={dims.w * 0.6} height={dims.h * 0.6} rx={dims.w * 0.08} fill={accentColor}/>
      
      {/* Barrel highlight */}
      <rect x={dims.w * 0.22} y={dims.h * 0.18} width={dims.w * 0.2} height={dims.h * 0.55} rx={dims.w * 0.06} fill="white" opacity="0.12"/>
      
      {/* Display window */}
      <rect x={dims.w * 0.28} y={dims.h * 0.25} width={dims.w * 0.44} height={dims.h * 0.2} rx={dims.w * 0.04} fill="white" opacity="0.88"/>
      <text x={dims.w * 0.5} y={dims.h * 0.315} textAnchor="middle" dominantBaseline="middle" 
        fill={accentColor} fontSize={dims.h * 0.08} fontWeight="700" fontFamily="sans-serif">MR</text>
      <text x={dims.w * 0.5} y={dims.h * 0.38} textAnchor="middle" dominantBaseline="middle" 
        fill={accentColor} fontSize={dims.h * 0.05} fontWeight="600" fontFamily="sans-serif">{productName}</text>
      
      {/* Needle cap (top) */}
      <rect x={dims.w * 0.3} y={0} width={dims.w * 0.4} height={dims.h * 0.12} rx={dims.w * 0.06} fill="#B0BBB0"/>
      <polygon points={`${dims.w * 0.35},${dims.h * 0.12} ${dims.w * 0.5},${dims.h * 0.02} ${dims.w * 0.65},${dims.h * 0.12}`} fill="#9AA39A"/>
      
      {/* Dose indicators on side */}
      <circle cx={dims.w * 0.85} cy={dims.h * 0.3} r={dims.w * 0.04} fill={accentColor} opacity="0.6"/>
      <circle cx={dims.w * 0.85} cy={dims.h * 0.45} r={dims.w * 0.04} fill={accentColor} opacity="0.6"/>
      <circle cx={dims.w * 0.85} cy={dims.h * 0.6} r={dims.w * 0.04} fill={accentColor} opacity="0.6"/>
    </svg>
  );
}

// ─── Injectable Vial ────────────────────────────────────────────────────────
export function MRVial({ accentColor = '#1A3A5C', productName = 'B12', size = 'md' }) {
  const dims = size === 'sm' ? { w: 50, h: 120 } : size === 'lg' ? { w: 90, h: 210 } : { w: 70, h: 160 };
  
  return (
    <svg width={dims.w} height={dims.h} viewBox={`0 0 ${dims.w} ${dims.h}`} fill="none">
      {/* Bottle cap */}
      <rect x={dims.w * 0.2} y={0} width={dims.w * 0.6} height={dims.h * 0.08} rx={dims.w * 0.08} fill="#333"/>
      
      {/* Neck */}
      <rect x={dims.w * 0.28} y={dims.h * 0.08} width={dims.w * 0.44} height={dims.h * 0.06} fill="#B0B0B0"/>
      
      {/* Main vial body */}
      <path d={`M ${dims.w * 0.18} ${dims.h * 0.14} L ${dims.w * 0.15} ${dims.h * 0.5} Q ${dims.w * 0.15} ${dims.h * 0.75} ${dims.w * 0.25} ${dims.h * 0.9} L ${dims.w * 0.75} ${dims.h * 0.9} Q ${dims.w * 0.85} ${dims.h * 0.75} ${dims.w * 0.85} ${dims.h * 0.5} L ${dims.w * 0.82} ${dims.h * 0.14} Z`} 
        fill="white" opacity="0.15" stroke={accentColor} strokeWidth={dims.w * 0.04}/>
      
      {/* Liquid fill (colored section) */}
      <path d={`M ${dims.w * 0.17} ${dims.h * 0.5} L ${dims.w * 0.16} ${dims.h * 0.75} Q ${dims.w * 0.16} ${dims.h * 0.85} ${dims.w * 0.26} ${dims.h * 0.88} L ${dims.w * 0.74} ${dims.h * 0.88} Q ${dims.w * 0.84} ${dims.h * 0.85} ${dims.w * 0.84} ${dims.h * 0.75} L ${dims.w * 0.83} ${dims.h * 0.5} Z`} 
        fill={accentColor} opacity="0.3"/>
      
      {/* Highlight on vial */}
      <ellipse cx={dims.w * 0.25} cy={dims.h * 0.35} rx={dims.w * 0.08} ry={dims.h * 0.15} fill="white" opacity="0.2"/>
      
      {/* Label */}
      <rect x={dims.w * 0.22} y={dims.h * 0.4} width={dims.w * 0.56} height={dims.h * 0.18} rx={dims.w * 0.04} fill="white" opacity="0.9"/>
      <text x={dims.w * 0.5} y={dims.h * 0.47} textAnchor="middle" dominantBaseline="middle" 
        fill={accentColor} fontSize={dims.h * 0.06} fontWeight="800" fontFamily="sans-serif">MR</text>
      <text x={dims.w * 0.5} y={dims.h * 0.54} textAnchor="middle" dominantBaseline="middle" 
        fill={accentColor} fontSize={dims.h * 0.04} fontWeight="600" fontFamily="sans-serif">{productName}</text>
    </svg>
  );
}

// ─── Pill/Capsule ──────────────────────────────────────────────────────────
export function MRPill({ accentColor = '#6B3A8B', productName = 'Estradiol', size = 'md' }) {
  const dims = size === 'sm' ? { w: 45, h: 35 } : size === 'lg' ? { w: 90, h: 70 } : { w: 70, h: 55 };
  
  return (
    <svg width={dims.w} height={dims.h} viewBox={`0 0 ${dims.w} ${dims.h}`} fill="none">
      {/* Left half */}
      <ellipse cx={dims.w * 0.25} cy={dims.h * 0.5} rx={dims.w * 0.25} ry={dims.h * 0.45} fill={accentColor}/>
      
      {/* Right half */}
      <ellipse cx={dims.w * 0.75} cy={dims.h * 0.5} rx={dims.w * 0.25} ry={dims.h * 0.45} fill={accentColor}/>
      
      {/* Middle connector */}
      <rect x={dims.w * 0.25} y={dims.h * 0.1} width={dims.w * 0.5} height={dims.h * 0.8} fill={accentColor}/>
      
      {/* Highlight */}
      <ellipse cx={dims.w * 0.35} cy={dims.h * 0.25} rx={dims.w * 0.15} ry={dims.h * 0.2} fill="white" opacity="0.3"/>
      
      {/* MR mark on surface */}
      <text x={dims.w * 0.5} y={dims.h * 0.5} textAnchor="middle" dominantBaseline="middle" 
        fill="white" fontSize={dims.h * 0.3} fontWeight="800" fontFamily="sans-serif">MR</text>
    </svg>
  );
}

// ─── Product Flashcard ─────────────────────────────────────────────────────
export function MRFlashcard({ 
  productName = 'Semaglutide', 
  category = 'Weight Loss',
  price = 299,
  accentColor = '#2D3A2D',
  visualType = 'pen',
  promise = 'Lose up to 15% body weight'
}) {
  return (
    <div className="w-full max-w-sm bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100">
      {/* Top colored section with visual */}
      <div className={`aspect-square flex items-center justify-center`} style={{ background: `linear-gradient(135deg, ${accentColor}15, ${accentColor}08)` }}>
        {visualType === 'pen' && <MRAutoPen accentColor={accentColor} productName={productName} size="lg" />}
        {visualType === 'vial' && <MRVial accentColor={accentColor} productName={productName} size="lg" />}
        {visualType === 'pill' && <MRPill accentColor={accentColor} productName={productName} size="lg" />}
      </div>
      
      {/* Content section */}
      <div className="p-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold uppercase tracking-widest text-gray-500">{category}</span>
          <span className="text-xs font-semibold px-2 py-1 rounded-full bg-gray-100 text-gray-700">Rx</span>
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 mb-2">{productName}</h3>
        
        <p className="text-sm text-gray-600 mb-4">{promise}</p>
        
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div>
            <p className="text-xs text-gray-500">Starting at</p>
            <p className="text-2xl font-bold text-gray-900">${price}<span className="text-lg text-gray-600">/mo</span></p>
          </div>
          <button className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-full text-sm font-semibold transition-colors">
            Learn More →
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Product Gallery (3 visuals cycling) ────────────────────────────────────
export function MRProductGallery({ product, autoPlay = true }) {
  const [current, setCurrent] = React.useState(0);
  const visuals = [
    { type: 'pen', label: 'Auto-Injector' },
    { type: 'lifestyle', label: 'Real Results' },
    { type: 'clinical', label: 'How It Works' },
  ];
  
  React.useEffect(() => {
    if (!autoPlay) return;
    const interval = setInterval(() => {
      setCurrent(prev => (prev + 1) % visuals.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [autoPlay]);
  
  const accentColor = product.gradient?.[0] || '#2D3A2D';
  
  return (
    <div className="relative w-full aspect-square bg-gray-50 rounded-xl overflow-hidden flex items-center justify-center">
      {/* Render current visual */}
      {current === 0 && product.form?.includes('Pen') && (
        <MRAutoPen accentColor={accentColor} productName={product.name} size="lg" />
      )}
      {current === 0 && product.form?.includes('Vial') && (
        <MRVial accentColor={accentColor} productName={product.name} size="lg" />
      )}
      {current === 0 && product.form?.includes('Tablet') && (
        <MRPill accentColor={accentColor} productName={product.name} size="lg" />
      )}
      
      {/* Lifestyle image for second view */}
      {current === 1 && product.lifestyle && (
        <img src={product.lifestyle} alt={product.name} className="w-full h-full object-cover" />
      )}
      
      {/* Cycle dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {visuals.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`w-2 h-2 rounded-full transition-all ${
              idx === current ? 'bg-gray-900 w-6' : 'bg-gray-400'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export default MRAutoPen;