import React from 'react';
import { COA_CONTENTS } from '@/lib/partner/offerings';

export default function DocumentationPanel() {
  return (
    <div className="border border-site-line bg-site-surface p-6">
      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-site-rust">Documentation</p>
      <h3 className="mt-3 max-w-md font-display text-[24px] leading-tight text-site-moss">
        Every lot ships with a third-party certificate of analysis.
      </h3>
      <p className="mt-3 text-[13px] leading-relaxed text-site-greige">
        Each certificate is issued against the specific lot in the box. Contents of every COA:
      </p>
      <ul className="mt-4 divide-y divide-site-line border-t border-site-line">
        {COA_CONTENTS.map((item) => (
          <li key={item} className="flex items-center gap-3 py-2.5">
            <span className="font-mono text-[10px] text-site-rust">&#8226;</span>
            <span className="text-[13px] text-site-moss">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}