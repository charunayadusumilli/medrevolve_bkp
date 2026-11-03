import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { getRefCode } from '@/lib/tracking';

export const SITE_ORIGIN = 'https://medrevolveb2b.com';

export function buildKitLink(serviceSlug, mediaSlug) {
  const ref = getRefCode() || 'media-kit';
  return `${SITE_ORIGIN}/services/${serviceSlug}?utm_source=affiliate&utm_medium=ugc&utm_campaign=${mediaSlug}&ref=${encodeURIComponent(ref)}`;
}

/** The pre-baked affiliate link for one service, with a copy control. */
export default function TrackedReferralLink({ serviceSlug, mediaSlug }) {
  const [copied, setCopied] = useState(false);
  const link = buildKitLink(serviceSlug, mediaSlug);

  const copy = async () => {
    await navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-site-rust">
        Your tracked link
      </p>
      <p className="mt-1.5 text-[12px] leading-relaxed text-site-greige">
        Source and campaign are already baked in. Swap the ref value for your own partner code if you have one.
      </p>

      <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-stretch">
        <code className="min-w-0 flex-1 break-all border border-site-line bg-site-cream px-3 py-2.5 font-mono text-[11px] leading-relaxed text-site-moss">
          {link}
        </code>
        <button
          type="button"
          onClick={copy}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-site-moss px-4 py-2.5 text-[12px] font-semibold text-site-cream transition-opacity hover:opacity-90"
        >
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? 'Copied' : 'Copy link'}
        </button>
      </div>
    </div>
  );
}