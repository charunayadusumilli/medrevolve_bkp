import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Download } from 'lucide-react';
import PageNotFound from '@/lib/PageNotFound';
import TrackedReferralLink, { buildKitLink } from '@/components/b2b/TrackedReferralLink';
import BrandKitRequestForm from '@/components/b2b/BrandKitRequestForm';
import { getServiceByMediaSlug, mediaKitSlug } from '@/lib/partner/servicesPage';
import { getMediaKit } from '@/lib/partner/mediaKits';
import { applyStoreSeo } from '@/lib/storefront/seo';

function coverDataUri(name, price) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1080" viewBox="0 0 1080 1080"><rect width="1080" height="1080" fill="#1F2D27"/><text x="80" y="140" fill="#A66B3C" font-family="monospace" font-size="30" letter-spacing="6">MEDREVOLVE</text><text x="80" y="520" fill="#F7F4ED" font-family="Georgia, serif" font-size="76">${name.replace(/&/g, '&amp;')}</text><text x="80" y="980" fill="#F7F4ED" font-family="monospace" font-size="34" opacity="0.7">${price.replace(/\//g, ' / ')}</text></svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export default function MediaKitPage() {
  const { slug } = useParams();
  const service = getServiceByMediaSlug(slug);
  const kit = service ? getMediaKit(service.slug) : null;

  useEffect(() => {
    if (!service || !kit) return;
    applyStoreSeo({
      title: `${service.name} media kit — MedRevolve`,
      description: `Creator assets for ${service.name}: ${kit.promise}`,
      path: `/media-kit/${slug}`,
    });
  }, [service, kit, slug]);

  if (!service || !kit) return <PageNotFound />;

  const shortSlug = mediaKitSlug(service.slug);

  return (
    <>
      <section className="bg-site-moss text-site-cream">
        <div className="mx-auto max-w-5xl px-5 py-12 sm:px-8 md:py-16">
          <Link
            to="/media-kit"
            className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-site-cream/60 transition-colors hover:text-site-cream"
          >
            <ArrowLeft className="h-3 w-3" /> All kits
          </Link>
          <p className="mt-5 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-site-rust">
            Media partner kit
          </p>
          <h1 className="mt-3 max-w-3xl font-display text-[34px] leading-[1.08] tracking-tight sm:text-[48px]">
            {service.name}
          </h1>
          <p className="mt-3 font-mono text-[13px] text-site-cream/75">{service.price}</p>
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-site-cream/70">{kit.promise}</p>
        </div>
      </section>

      <section className="bg-site-cream">
        <div className="mx-auto max-w-5xl space-y-8 px-5 py-12 sm:px-8 md:py-16">
          <div className="border border-site-line bg-site-surface p-6 sm:p-8">
            <TrackedReferralLink serviceSlug={service.slug} mediaSlug={shortSlug} />
          </div>

          <div>
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-site-rust">
              Three video hooks
            </p>
            <ul className="mt-3 space-y-3">
              {kit.hooks.map((hook) => (
                <li key={hook} className="border-l-2 border-site-line pl-4 text-[14px] leading-relaxed text-site-moss">
                  {hook}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-site-rust">
              Two caption options
            </p>
            <div className="mt-3 grid gap-4 md:grid-cols-2">
              <div className="border border-site-line bg-site-surface p-5">
                <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-site-greige">Short</p>
                <p className="mt-2 text-[13px] leading-relaxed text-site-greige">{kit.captions.short}</p>
              </div>
              <div className="border border-site-line bg-site-surface p-5">
                <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-site-greige">Long</p>
                <p className="mt-2 text-[13px] leading-relaxed text-site-greige">{kit.captions.long}</p>
              </div>
            </div>
          </div>

          <div>
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-site-rust">
              Five hashtags
            </p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {kit.hashtags.map((tag) => (
                <li
                  key={tag}
                  className="rounded-full border border-site-line px-3 py-1.5 font-mono text-[11px] text-site-moss"
                >
                  {tag}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-site-rust">
              Who it is for
            </p>
            <ul className="mt-3 space-y-2">
              {kit.talkingPoints.map((point) => (
                <li key={point} className="flex gap-2.5 text-[13px] leading-relaxed text-site-greige">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-site-rust" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="border border-site-line bg-site-surface p-6 sm:p-8">
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-site-rust">
              Cover image
            </p>
            <div className="mt-4 flex flex-col gap-5 sm:flex-row sm:items-center">
              <div className="flex h-[160px] w-[160px] shrink-0 flex-col justify-between border border-dashed border-site-line bg-site-cream p-3">
                <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-site-rust">1080 × 1080</span>
                <span className="font-display text-[16px] leading-tight text-site-moss">{service.name}</span>
                <span className="font-mono text-[9px] text-site-greige">cover placeholder</span>
              </div>
              <div>
                <a
                  href={coverDataUri(service.name, service.price)}
                  download={`medrevolve-${shortSlug}-cover.svg`}
                  className="inline-flex items-center gap-2 rounded-lg border border-site-moss px-4 py-2.5 text-[12px] font-semibold text-site-moss transition-colors hover:bg-site-moss hover:text-site-cream"
                >
                  <Download className="h-3.5 w-3.5" /> Download placeholder
                </a>
                <p className="mt-2 max-w-md text-[11px] leading-relaxed text-site-greige">
                  This is a placeholder only. Finished square covers, story crops and video end cards are
                  provided on request.
                </p>
              </div>
            </div>
          </div>

          <BrandKitRequestForm serviceName={service.name} />

          <p className="text-[11px] leading-relaxed text-site-greige">
            Tracked link target:{' '}
            <span className="break-all font-mono">{buildKitLink(service.slug, shortSlug)}</span>
          </p>
        </div>
      </section>
    </>
  );
}