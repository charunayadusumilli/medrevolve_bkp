import React from 'react';
import { Megaphone, Clapperboard, Share2, LayoutTemplate, Palette, Users } from 'lucide-react';
import { CHANNELS } from '@/lib/partner/marketingPage';

const ICONS = {
  ads: Megaphone,
  creative: Clapperboard,
  organic: Share2,
  web: LayoutTemplate,
  brand: Palette,
  crm: Users,
};

export default function MarketingChannels() {
  return (
    <section className="bg-site-cream">
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 md:py-20">
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-site-rust">
          What we do
        </p>
        <h2 className="mt-3 max-w-2xl font-display text-[30px] leading-tight tracking-tight text-site-moss sm:text-[40px]">
          Every channel a telehealth brand needs to grow
        </h2>
        <p className="mt-4 max-w-2xl text-[14px] leading-relaxed text-site-greige">
          One team for the ads, the creative and the pages they send traffic to, so nothing gets lost
          between vendors.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CHANNELS.map((channel) => {
            const Icon = ICONS[channel.key];
            return (
              <article key={channel.key} className="border border-site-line bg-site-surface p-5 sm:p-6">
                <Icon className="h-5 w-5 text-site-rust" strokeWidth={1.6} />
                <h3 className="mt-4 font-display text-[22px] leading-snug tracking-tight text-site-moss">
                  {channel.title}
                </h3>
                <p className="mt-2 text-[13px] leading-relaxed text-site-greige">{channel.body}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}