import React from 'react';
import { BadgeCheck } from 'lucide-react';

export const LEGITSCRIPT_URL = 'https://www.legitscript.com/verification/';

export default function AnnouncementBar() {
  return (
    <div className="bg-sf-ink text-white">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-6 gap-y-1 px-5 py-2.5 text-[11px] font-medium tracking-wide sm:text-xs">
        <a
          href={LEGITSCRIPT_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 hover:text-white/80"
        >
          <BadgeCheck className="h-3.5 w-3.5 text-sf-accent" />
          LegitScript certified
        </a>
        <span className="hidden h-3 w-px bg-white/25 sm:block" />
        <span className="text-white/70">FDA-approved options available</span>
        <span className="hidden h-3 w-px bg-white/25 sm:block" />
        <span className="text-white/70">Free shipping over $50</span>
      </div>
    </div>
  );
}