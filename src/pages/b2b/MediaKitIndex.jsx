import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import ContactBand from '@/components/b2b/ContactBand';
import { SERVICES_PAGE_CATALOG, mediaKitSlug } from '@/lib/partner/servicesPage';
import { getMediaKit } from '@/lib/partner/mediaKits';
import { applyStoreSeo } from '@/lib/storefront/seo';

export default function MediaKitIndex() {
  useEffect(() => {
    applyStoreSeo({
      title: 'Media partner kits — MedRevolve',
      description:
        'One URL per service: tracked affiliate link, three video hooks, two captions, hashtags and talking points for every MedRevolve service.',
      path: '/media-kit',
    });
  }, []);

  return (
    <>
      <section className="bg-site-moss text-site-cream">
        <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 md:py-16">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-site-rust">
            Media partners
          </p>
          <h1 className="mt-3 max-w-3xl font-display text-[34px] leading-[1.08] tracking-tight sm:text-[48px]">
            One kit per service. Pick what you want to promote.
          </h1>
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-site-cream/70">
            Send a partner this single URL. Every kit carries a pre-baked tracked link, hooks, captions,
            hashtags and the exact price, so nothing gets paraphrased.
          </p>
        </div>
      </section>

      <section className="bg-site-cream">
        <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 md:py-16">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES_PAGE_CATALOG.map((service) => {
              const kit = getMediaKit(service.slug);
              const shortSlug = mediaKitSlug(service.slug);
              return (
                <article
                  key={service.slug}
                  className="flex flex-col border border-site-line bg-site-surface p-5 sm:p-6"
                >
                  <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-site-greige">
                    {service.group}
                  </p>
                  <h2 className="mt-2 font-display text-[22px] leading-snug tracking-tight text-site-moss">
                    {service.name}
                  </h2>
                  <p className="mt-2 flex-1 text-[13px] leading-relaxed text-site-greige">
                    {kit ? kit.promise : service.summary}
                  </p>
                  <p className="mt-4 border-t border-site-line pt-3 font-mono text-[11px] text-site-rust">
                    {service.price}
                  </p>
                  <Link
                    to={`/media-kit/${shortSlug}`}
                    className="mt-4 inline-flex items-center gap-1.5 text-[12px] font-semibold text-site-moss underline decoration-site-line underline-offset-4 hover:decoration-site-moss"
                  >
                    Open kit <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <ContactBand />
    </>
  );
}