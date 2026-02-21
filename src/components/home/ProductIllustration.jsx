import React from 'react';

// Branded MR product illustrations — vials, pills, syringes, sprays, droppers
// Style: clean, upscale, Hims/Ro aesthetic with MR brand identity

const BG_GRADIENTS = {
  sage:    ['#E8F0E4', '#D4E8CC'],
  forest:  ['#D8E8D4', '#BDD4B8'],
  warm:    ['#F0EBE1', '#E8DDD0'],
  slate:   ['#E1E8EE', '#CDD8E4'],
  cream:   ['#F5F0E8', '#EDE5D8'],
  mint:    ['#E2EEE8', '#CCDFD4'],
};

// Semaglutide — elegant injection pen
export function VialPenIllustration({ accent = '#4A6741' }) {
  return (
    <svg viewBox="0 0 280 280" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <defs>
        <linearGradient id="penBody" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#2D3A2D" />
          <stop offset="100%" stopColor={accent} />
        </linearGradient>
        <linearGradient id="penShine" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="white" stopOpacity="0.25" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="capGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F5F0E8" />
          <stop offset="100%" stopColor="#E0D8CC" />
        </linearGradient>
      </defs>

      {/* Pen body */}
      <rect x="110" y="60" width="60" height="155" rx="30" fill="url(#penBody)" />
      <rect x="110" y="60" width="60" height="80" rx="30" fill="url(#penShine)" />

      {/* Cap top */}
      <rect x="118" y="50" width="44" height="30" rx="10" fill="url(#capGrad)" />
      <rect x="128" y="42" width="24" height="14" rx="7" fill="#D0C8BC" />

      {/* Needle tip */}
      <rect x="133" y="215" width="14" height="18" rx="4" fill="#C8D4C4" />
      <rect x="137" y="230" width="6" height="14" rx="3" fill="#A8B8A4" />

      {/* MR label on body */}
      <rect x="120" y="130" width="40" height="50" rx="6" fill="white" fillOpacity="0.12" />
      <text x="140" y="152" textAnchor="middle" fontSize="11" fontWeight="900" fill="white" fontFamily="system-ui" letterSpacing="-0.5">MR</text>
      <text x="140" y="166" textAnchor="middle" fontSize="6.5" fontWeight="500" fill="white" fillOpacity="0.7" fontFamily="system-ui" letterSpacing="1">SEMAGLUTIDE</text>

      {/* Dose window */}
      <rect x="124" y="98" width="32" height="20" rx="4" fill="white" fillOpacity="0.2" />
      <rect x="127" y="101" width="26" height="14" rx="3" fill="#A8C49B" fillOpacity="0.5" />

      {/* Grip rings */}
      {[188, 196, 204].map(y => (
        <rect key={y} x="110" y={y} width="60" height="3" rx="1.5" fill="white" fillOpacity="0.1" />
      ))}
    </svg>
  );
}

// Tirzepatide — premium vial
export function VialIllustration({ accent = '#3B6B5A', label = 'TIRZEPATIDE', sublabel = 'Dual GLP-1' }) {
  return (
    <svg viewBox="0 0 280 280" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <defs>
        <linearGradient id="vialGlass" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#E8F0E4" />
          <stop offset="40%" stopColor="white" />
          <stop offset="100%" stopColor="#D4E4D0" />
        </linearGradient>
        <linearGradient id="vialLiquid" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={accent} stopOpacity="0.9" />
          <stop offset="100%" stopColor="#2D3A2D" stopOpacity="0.95" />
        </linearGradient>
        <linearGradient id="capTop" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={accent} />
          <stop offset="100%" stopColor="#2D3A2D" />
        </linearGradient>
      </defs>

      {/* Vial glass body */}
      <rect x="105" y="80" width="70" height="145" rx="12" fill="url(#vialGlass)" stroke="#D0D8CC" strokeWidth="1.5" />

      {/* Liquid fill */}
      <rect x="107" y="130" width="66" height="93" rx="10" fill="url(#vialLiquid)" />

      {/* Liquid surface shimmer */}
      <ellipse cx="140" cy="132" rx="32" ry="4" fill="white" fillOpacity="0.3" />

      {/* Glass shine */}
      <rect x="112" y="85" width="12" height="130" rx="6" fill="white" fillOpacity="0.35" />

      {/* Cap */}
      <rect x="105" y="64" width="70" height="22" rx="8" fill="url(#capTop)" />
      <rect x="115" y="58" width="50" height="12" rx="6" fill={accent} />
      <rect x="128" y="52" width="24" height="10" rx="5" fill="#2D3A2D" />

      {/* Label */}
      <rect x="115" y="95" width="50" height="28" rx="5" fill="white" fillOpacity="0.92" />
      <text x="140" y="108" textAnchor="middle" fontSize="9" fontWeight="900" fill="#2D3A2D" fontFamily="system-ui" letterSpacing="-0.3">MR</text>
      <text x="140" y="118" textAnchor="middle" fontSize="5.5" fontWeight="600" fill={accent} fontFamily="system-ui" letterSpacing="0.8">{label}</text>

      {/* Measurement lines */}
      {[140, 155, 170, 185, 200].map((y, i) => (
        <g key={y}>
          <line x1="172" y1={y} x2={i % 2 === 0 ? "164" : "168"} y2={y} stroke="white" strokeWidth="1" strokeOpacity="0.5" />
        </g>
      ))}

      {/* Bottom meniscus */}
      <ellipse cx="140" cy="222" rx="30" ry="3" fill={accent} fillOpacity="0.6" />
    </svg>
  );
}

// Sermorelin — slim peptide vial
export function PeptideVialIllustration({ accent = '#5A7A8A' }) {
  return (
    <svg viewBox="0 0 280 280" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <defs>
        <linearGradient id="pv1" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#E8EEF2" />
          <stop offset="50%" stopColor="white" />
          <stop offset="100%" stopColor="#D4DCE4" />
        </linearGradient>
        <linearGradient id="pv2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={accent} stopOpacity="0.85" />
          <stop offset="100%" stopColor="#1a3040" />
        </linearGradient>
      </defs>
      {/* Two vials side by side */}
      {/* Vial 1 */}
      <rect x="88" y="85" width="48" height="135" rx="10" fill="url(#pv1)" stroke="#D0D8E0" strokeWidth="1.5" />
      <rect x="90" y="140" width="44" height="78" rx="9" fill="url(#pv2)" />
      <rect x="88" y="70" width="48" height="20" rx="7" fill={accent} />
      <rect x="97" y="63" width="30" height="12" rx="6" fill="#2D3A2D" />
      <rect x="95" y="91" width="8" height="110" rx="4" fill="white" fillOpacity="0.3" />
      <rect x="98" y="92" width="32" height="22" rx="4" fill="white" fillOpacity="0.9" />
      <text x="114" y="103" textAnchor="middle" fontSize="8" fontWeight="900" fill="#2D3A2D" fontFamily="system-ui">MR</text>
      <text x="114" y="112" textAnchor="middle" fontSize="5" fontWeight="600" fill={accent} fontFamily="system-ui" letterSpacing="0.5">SERMORELIN</text>

      {/* Vial 2 (slightly taller, behind) */}
      <rect x="144" y="78" width="48" height="145" rx="10" fill="url(#pv1)" stroke="#D0D8E0" strokeWidth="1.5" />
      <rect x="146" y="148" width="44" height="73" rx="9" fill={accent} fillOpacity="0.7" />
      <rect x="144" y="62" width="48" height="20" rx="7" fill="#8B9E6A" />
      <rect x="153" y="55" width="30" height="12" rx="6" fill="#4A6741" />
      <rect x="149" y="85" width="8" height="118" rx="4" fill="white" fillOpacity="0.28" />
      <rect x="152" y="86" width="32" height="22" rx="4" fill="white" fillOpacity="0.9" />
      <text x="168" y="97" textAnchor="middle" fontSize="8" fontWeight="900" fill="#2D3A2D" fontFamily="system-ui">MR</text>
      <text x="168" y="106" textAnchor="middle" fontSize="5" fontWeight="600" fill="#4A6741" fontFamily="system-ui" letterSpacing="0.5">PEPTIDE+</text>
    </svg>
  );
}

// Glutathione — dropper bottle
export function DropperIllustration({ accent = '#C4A77D' }) {
  return (
    <svg viewBox="0 0 280 280" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <defs>
        <linearGradient id="db1" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#F0EAE0" />
          <stop offset="50%" stopColor="white" />
          <stop offset="100%" stopColor="#E4D8C8" />
        </linearGradient>
        <linearGradient id="db2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E8C87A" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#C4A44A" stopOpacity="0.95" />
        </linearGradient>
      </defs>
      {/* Bottle */}
      <rect x="105" y="110" width="70" height="130" rx="14" fill="url(#db1)" stroke="#E0D0BC" strokeWidth="1.5" />
      {/* Liquid */}
      <rect x="107" y="160" width="66" height="78" rx="12" fill="url(#db2)" />
      {/* Shine */}
      <rect x="112" y="115" width="11" height="118" rx="5.5" fill="white" fillOpacity="0.4" />
      {/* Neck */}
      <rect x="120" y="88" width="40" height="26" rx="8" fill="#E8DCC8" stroke="#D8CCBA" strokeWidth="1" />
      {/* Dropper bulb */}
      <ellipse cx="140" cy="68" rx="22" ry="16" fill={accent} />
      <ellipse cx="140" cy="68" rx="16" ry="11" fill="#D4902A" fillOpacity="0.5" />
      {/* Dropper tube */}
      <rect x="137" y="78" width="6" height="16" rx="3" fill="#C89040" />
      {/* Label */}
      <rect x="115" y="122" width="50" height="32" rx="6" fill="white" fillOpacity="0.95" />
      <text x="140" y="135" textAnchor="middle" fontSize="9" fontWeight="900" fill="#2D3A2D" fontFamily="system-ui">MR</text>
      <text x="140" y="146" textAnchor="middle" fontSize="5.5" fontWeight="600" fill={accent} fontFamily="system-ui" letterSpacing="0.8">GLUTATHIONE</text>
      {/* Drop accent */}
      <path d="M140 172 C137 166, 133 162, 133 158 C133 153.6, 136.1 150, 140 150 C143.9 150, 147 153.6, 147 158 C147 162, 143 166, 140 172Z" fill="white" fillOpacity="0.4" />
    </svg>
  );
}

// NAD+ — sleek ampoule / injection
export function AmpouleIllustration({ accent = '#4A6741' }) {
  return (
    <svg viewBox="0 0 280 280" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <defs>
        <linearGradient id="amp1" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#E4EEE0" />
          <stop offset="50%" stopColor="white" />
          <stop offset="100%" stopColor="#CCDEC8" />
        </linearGradient>
        <linearGradient id="amp2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={accent} />
          <stop offset="100%" stopColor="#1D2A1D" />
        </linearGradient>
      </defs>
      {/* Three ampoules stacked/fanned */}
      {/* Back ampoule */}
      <g transform="rotate(-12, 140, 140)">
        <rect x="125" y="75" width="30" height="130" rx="15" fill="#D8E8D4" stroke="#C4D8C0" strokeWidth="1" />
        <rect x="127" y="140" width="26" height="63" rx="13" fill={accent} fillOpacity="0.5" />
        <path d="M140 75 C140 75, 130 65, 130 58 C130 51, 135 46, 140 46 C145 46, 150 51, 150 58 C150 65, 140 75, 140 75Z" fill="#C4D8C0" />
      </g>
      {/* Front ampoule */}
      <rect x="121" y="80" width="38" height="145" rx="19" fill="url(#amp1)" stroke="#D0DCC8" strokeWidth="1.5" />
      <rect x="123" y="150" width="34" height="73" rx="17" fill="url(#amp2)" />
      <path d="M140 80 C140 80, 128 68, 128 60 C128 52, 133.4 46, 140 46 C146.6 46, 152 52, 152 60 C152 68, 140 80, 140 80Z" fill="#E4EEE0" stroke="#D0DCC8" strokeWidth="1" />
      {/* Shine */}
      <rect x="128" y="86" width="7" height="132" rx="3.5" fill="white" fillOpacity="0.4" />
      {/* Label */}
      <rect x="128" y="95" width="24" height="42" rx="5" fill="white" fillOpacity="0.9" />
      <text x="140" y="110" textAnchor="middle" fontSize="8" fontWeight="900" fill="#2D3A2D" fontFamily="system-ui">MR</text>
      <text x="140" y="121" textAnchor="middle" fontSize="5" fontWeight="700" fill={accent} fontFamily="system-ui" letterSpacing="0.5">NAD+</text>
      <text x="140" y="130" textAnchor="middle" fontSize="4.5" fill="#8A9E8A" fontFamily="system-ui">Injection</text>
      {/* Neck score line */}
      <line x1="124" y1="152" x2="156" y2="152" stroke={accent} strokeWidth="2" strokeOpacity="0.5" />
    </svg>
  );
}

// Testosterone — twin vials arrangement
export function TestosteroneIllustration({ accent = '#5A7A8A' }) {
  return (
    <svg viewBox="0 0 280 280" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <defs>
        <linearGradient id="tv1" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#E0E8EE" />
          <stop offset="50%" stopColor="white" />
          <stop offset="100%" stopColor="#CCD4DC" />
        </linearGradient>
        <linearGradient id="tv2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={accent} stopOpacity="0.9" />
          <stop offset="100%" stopColor="#1A2A34" />
        </linearGradient>
      </defs>
      {/* Main vial */}
      <rect x="100" y="72" width="56" height="160" rx="12" fill="url(#tv1)" stroke="#CCD4DC" strokeWidth="1.5" />
      <rect x="102" y="148" width="52" height="82" rx="10" fill="url(#tv2)" />
      <rect x="100" y="56" width="56" height="20" rx="7" fill={accent} />
      <rect x="110" y="48" width="36" height="13" rx="6.5" fill="#2D3A2D" />
      <rect x="106" y="78" width="10" height="146" rx="5" fill="white" fillOpacity="0.3" />
      {/* Label */}
      <rect x="110" y="88" width="36" height="48" rx="6" fill="white" fillOpacity="0.92" />
      <text x="128" y="105" textAnchor="middle" fontSize="10" fontWeight="900" fill="#2D3A2D" fontFamily="system-ui" letterSpacing="-0.5">MR</text>
      <text x="128" y="117" textAnchor="middle" fontSize="5" fontWeight="700" fill={accent} fontFamily="system-ui" letterSpacing="0.5">TESTOSTERONE</text>
      <text x="128" y="127" textAnchor="middle" fontSize="5" fill="#8A9EAA" fontFamily="system-ui">Therapy</text>
      {/* Measurement lines */}
      {[160, 175, 190, 205, 220].map((y, i) => (
        <line key={y} x1="150" y1={y} x2={i % 2 === 0 ? "144" : "147"} y2={y} stroke="white" strokeWidth="1" strokeOpacity="0.5" />
      ))}
      {/* Second smaller vial */}
      <rect x="162" y="110" width="30" height="90" rx="8" fill="url(#tv1)" stroke="#CCD4DC" strokeWidth="1" />
      <rect x="164" y="158" width="26" height="40" rx="7" fill={accent} fillOpacity="0.65" />
      <rect x="162" y="98" width="30" height="15" rx="5" fill={accent} fillOpacity="0.8" />
      <rect x="168" y="115" width="16" height="26" rx="4" fill="white" fillOpacity="0.9" />
      <text x="176" y="125" textAnchor="middle" fontSize="7" fontWeight="900" fill="#2D3A2D" fontFamily="system-ui">MR</text>
      <text x="176" y="133" textAnchor="middle" fontSize="4.5" fontWeight="600" fill={accent} fontFamily="system-ui">RX</text>
    </svg>
  );
}

// Semaglutide Drops — oral dropper bottle
export function OralDropsIllustration({ accent = '#8B7355' }) {
  return (
    <svg viewBox="0 0 280 280" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <defs>
        <linearGradient id="od1" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#EDE8E0" />
          <stop offset="50%" stopColor="white" />
          <stop offset="100%" stopColor="#E0D8CC" />
        </linearGradient>
        <linearGradient id="od2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#C8A878" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#8B6840" stopOpacity="0.95" />
        </linearGradient>
      </defs>
      {/* Round bottle */}
      <ellipse cx="140" cy="185" rx="48" ry="62" fill="url(#od1)" stroke="#DDD4C4" strokeWidth="1.5" />
      {/* Fill level */}
      <ellipse cx="140" cy="200" rx="46" ry="47" fill="url(#od2)" />
      {/* Shine */}
      <ellipse cx="120" cy="155" rx="10" ry="30" fill="white" fillOpacity="0.35" />
      {/* Neck */}
      <rect x="122" y="108" width="36" height="28" rx="9" fill="#E4D8C8" stroke="#D8CCC0" strokeWidth="1" />
      {/* Cap */}
      <rect x="118" y="86" width="44" height="26" rx="8" fill={accent} />
      <rect x="124" y="80" width="32" height="12" rx="6" fill="#6A5540" />
      {/* Label */}
      <rect x="110" y="150" width="60" height="42" rx="8" fill="white" fillOpacity="0.92" />
      <text x="140" y="167" textAnchor="middle" fontSize="10" fontWeight="900" fill="#2D3A2D" fontFamily="system-ui">MR</text>
      <text x="140" y="179" textAnchor="middle" fontSize="5.5" fontWeight="700" fill={accent} fontFamily="system-ui" letterSpacing="0.5">SEMA DROPS</text>
      <text x="140" y="188" textAnchor="middle" fontSize="5" fill="#A89070" fontFamily="system-ui">Needle-Free</text>
      {/* Drop graphic */}
      <path d="M140 220 C137 213, 133 209, 133 205 C133 200.6, 136.1 197, 140 197 C143.9 197, 147 200.6, 147 205 C147 209, 143 213, 140 220Z" fill="white" fillOpacity="0.35" />
    </svg>
  );
}

// Synapsin Spray — nasal/mouth spray
export function SprayIllustration({ accent = '#4338CA' }) {
  return (
    <svg viewBox="0 0 280 280" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <defs>
        <linearGradient id="sp1" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#E8E6F8" />
          <stop offset="50%" stopColor="white" />
          <stop offset="100%" stopColor="#D8D4F0" />
        </linearGradient>
        <linearGradient id="sp2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={accent} stopOpacity="0.9" />
          <stop offset="100%" stopColor="#1E1A60" />
        </linearGradient>
      </defs>
      {/* Bottle body */}
      <rect x="108" y="100" width="58" height="155" rx="14" fill="url(#sp1)" stroke="#D4D0E8" strokeWidth="1.5" />
      {/* Liquid */}
      <rect x="110" y="160" width="54" height="93" rx="12" fill="url(#sp2)" />
      {/* Shine */}
      <rect x="115" y="106" width="9" height="140" rx="4.5" fill="white" fillOpacity="0.38" />
      {/* Actuator / pump neck */}
      <rect x="120" y="76" width="34" height="28" rx="10" fill="#D4D0E8" stroke="#C8C4E0" strokeWidth="1" />
      {/* Pump button */}
      <rect x="124" y="58" width="26" height="22" rx="8" fill={accent} />
      {/* Nozzle */}
      <rect x="148" y="64" width="24" height="9" rx="4.5" fill={accent} />
      {/* Spray particles */}
      {[
        { cx: 182, cy: 55 }, { cx: 190, cy: 48 }, { cx: 196, cy: 60 },
        { cx: 184, cy: 40 }, { cx: 200, cy: 52 }, { cx: 188, cy: 35 },
      ].map((p, i) => (
        <circle key={i} cx={p.cx} cy={p.cy} r={i % 2 === 0 ? 3 : 2} fill={accent} fillOpacity={0.2 + i * 0.06} />
      ))}
      {/* Label */}
      <rect x="118" y="112" width="38" height="40" rx="6" fill="white" fillOpacity="0.92" />
      <text x="137" y="127" textAnchor="middle" fontSize="9" fontWeight="900" fill="#2D3A2D" fontFamily="system-ui">MR</text>
      <text x="137" y="138" textAnchor="middle" fontSize="5" fontWeight="700" fill={accent} fontFamily="system-ui" letterSpacing="0.5">SYNAPSIN</text>
      <text x="137" y="147" textAnchor="middle" fontSize="4.5" fill="#7070AA" fontFamily="system-ui">Nasal Spray</text>
    </svg>
  );
}

// Generic pill/capsule pack
export function PillPackIllustration({ accent = '#4A6741', label = 'RX', sublabel = '' }) {
  const pills = [
    { x: 100, y: 130 }, { x: 150, y: 115 }, { x: 100, y: 170 },
    { x: 150, y: 155 }, { x: 100, y: 210 }, { x: 150, y: 195 }
  ];
  return (
    <svg viewBox="0 0 280 280" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <defs>
        <linearGradient id="blister" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#E8EEE4" />
          <stop offset="100%" stopColor="#D4DDD0" />
        </linearGradient>
      </defs>
      {/* Blister pack card */}
      <rect x="80" y="100" width="120" height="145" rx="12" fill="url(#blister)" stroke="#C8D4C4" strokeWidth="1.5" />
      {/* Header strip */}
      <rect x="80" y="100" width="120" height="32" rx="12" fill={accent} />
      <rect x="80" y="120" width="120" height="12" fill={accent} />
      <text x="140" y="118" textAnchor="middle" fontSize="10" fontWeight="900" fill="white" fontFamily="system-ui">MR · {label}</text>

      {/* Blister domes */}
      {pills.map((p, i) => (
        <g key={i}>
          <ellipse cx={p.x + 20} cy={p.y + 8} rx="18" ry="12" fill={i < 4 ? accent : '#C4D4C0'} fillOpacity={i < 4 ? '0.3' : '0.15'} />
          <ellipse cx={p.x + 20} cy={p.y + 8} rx="14" ry="9" fill={i < 4 ? accent : '#D8E4D4'} fillOpacity={i < 4 ? '0.7' : '0.4'} />
          {i < 4 && <ellipse cx={p.x + 16} cy={p.y + 5} rx="5" ry="3" fill="white" fillOpacity="0.5" />}
        </g>
      ))}
      {sublabel && <text x="140" y="235" textAnchor="middle" fontSize="6" fill={accent} fontFamily="system-ui" letterSpacing="0.5">{sublabel}</text>}
    </svg>
  );
}

// Master export map by product id
export const PRODUCT_ILLUSTRATIONS = {
  1: (props) => <VialPenIllustration accent="#4A6741" {...props} />,
  2: (props) => <VialIllustration accent="#3B6B5A" label="TIRZEPATIDE" {...props} />,
  3: (props) => <PeptideVialIllustration accent="#5A7A8A" {...props} />,
  4: (props) => <DropperIllustration accent="#C4A77D" {...props} />,
  5: (props) => <AmpouleIllustration accent="#4A6741" {...props} />,
  6: (props) => <TestosteroneIllustration accent="#5A7A8A" {...props} />,
  7: (props) => <OralDropsIllustration accent="#8B7355" {...props} />,
  8: (props) => <SprayIllustration accent="#4338CA" {...props} />,
};

export const PRODUCT_BG = {
  1: ['#E8F0E4', '#D4E8CC'],
  2: ['#E2EEE8', '#CCDFD4'],
  3: ['#E1E8EE', '#CDD8E4'],
  4: ['#F0EBE1', '#E8DDD0'],
  5: ['#E8F0E4', '#D4E8CC'],
  6: ['#E0E8EE', '#CCD4DC'],
  7: ['#F5F0E8', '#EDE5D8'],
  8: ['#ECEAFC', '#DDD8F8'],
};