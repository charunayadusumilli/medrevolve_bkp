import React, { useState } from 'react';

const SWATCHES = ['#1F2D27', '#A66B3C', '#3A453E', '#6B6560'];

export default function BrandPreviewWidget() {
  const [brand, setBrand] = useState('Northline Health');
  const [accent, setAccent] = useState(SWATCHES[1]);

  return (
    <section className="border-t border-site-line bg-site-surface">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-2 md:items-center md:py-24">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-site-rust">Brand preview</p>
          <h2 className="mt-3 font-display text-[32px] leading-tight tracking-tight sm:text-[40px]">
            See your storefront before you commit
          </h2>
          <p className="mt-4 max-w-md text-[13px] leading-relaxed text-site-greige">
            Type your brand name and pick an accent. This is the same shell your patients would land on —
            your name, our clinical rails.
          </p>

          <label className="mt-6 block text-[10px] font-semibold uppercase tracking-[0.08em] text-site-greige">
            Brand name
            <input
              value={brand}
              onChange={(e) => setBrand(e.target.value.slice(0, 28))}
              className="mt-2 h-10 w-full rounded-lg border border-site-line bg-site-cream px-3 text-[13px] font-normal normal-case tracking-normal text-site-moss outline-none focus:border-site-moss"
            />
          </label>

          <div className="mt-4 flex items-center gap-3">
            <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-site-greige">Accent</span>
            {SWATCHES.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => setAccent(color)}
                aria-label={`Accent ${color}`}
                style={{ backgroundColor: color }}
                className={`h-7 w-7 rounded-full transition-transform duration-200 ${
                  accent === color ? 'scale-110 ring-2 ring-site-moss ring-offset-2' : ''
                }`}
              />
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-site-line bg-site-cream p-5">
          <div className="flex items-center justify-between border-b border-site-line pb-3">
            <span className="text-[15px] font-semibold">{brand || 'Your brand'}</span>
            <span className="rounded-lg px-3 py-1.5 text-[11px] font-semibold text-white" style={{ backgroundColor: accent }}>
              Start intake
            </span>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {['Weight care', 'Hormone health'].map((label) => (
              <div key={label} className="rounded-xl border border-site-line bg-site-surface p-3">
                <div className="h-20 rounded-lg" style={{ backgroundColor: `${accent}22` }} />
                <p className="mt-2 text-[12px] font-semibold">{label}</p>
                <p className="text-[11px] text-site-greige">Provider-supervised</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-[11px] text-site-greige">
            Live preview — your real build adds logo files, typography and domain.
          </p>
        </div>
      </div>
    </section>
  );
}