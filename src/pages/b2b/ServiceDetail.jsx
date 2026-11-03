import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import PageNotFound from '@/lib/PageNotFound';
import ContactBand from '@/components/b2b/ContactBand';
import PayButtons from '@/components/b2b/PayButtons';
import { getService, SERVICE_CATALOG, PRICE_NOTE } from '@/lib/partner/offerings';
import { applyStoreSeo } from '@/lib/storefront/seo';

/** One landing page per service, driven by the service catalog. */
export default function ServiceDetail() {
  const { slug } = useParams();
  const service = getService(slug);

  useEffect(() => {
    if (!service) return;
    applyStoreSeo({
      title: `${service.name} — MedRevolve`,
      description: `${service.summary} ${service.ballpark}.`,
      path: `/services/${service.slug}`,
    });
  }, [service]);

  if (!service) return <PageNotFound />;

  const others = SERVICE_CATALOG.filter((item) => item.slug !== service.slug).slice(0, 4);

  return (
    <>
      <section className="border-b border-site-line bg-site-moss text-site-cream">
        <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 md:py-16">
          <Link
            to="/services"
            className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-site-cream/60 transition-colors hover:text-site-cream"
          >
            <ArrowLeft className="h-3 w-3" /> All services
          </Link>
          <p className="mt-5 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-site-rust">
            {service.group}
          </p>
          <h1 className="mt-3 max-w-3xl font-display text-[34px] leading-[1.08] tracking-tight sm:text-[48px]">
            {service.name}
          </h1>
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-site-cream/70">{service.summary}</p>
          <p className="mt-6 inline-flex border border-site-cream/25 px-4 py-2 font-mono text-[11px] tracking-wide text-site-cream/80">
            Ballpark: {service.ballpark}
          </p>
        </div>
      </section>

      <section className="bg-site-cream">
        <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 md:py-16">
          <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr] lg:gap-12">
            <div>
              <h2 className="font-display text-[26px] leading-tight tracking-tight text-site-moss sm:text-[32px]">
                What this covers
              </h2>
              <p className="mt-3 max-w-xl text-[14px] leading-relaxed text-site-greige">{service.detail}</p>

              <ul className="mt-6 space-y-2.5">
                {service.included.map((item) => (
                  <li key={item} className="flex gap-2.5 text-[13px] leading-relaxed text-site-greige">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-site-rust" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              {service.caveat && (
                <p className="mt-6 max-w-xl border-l-2 border-site-line pl-4 text-[12px] leading-relaxed text-site-greige">
                  {service.caveat}
                </p>
              )}
            </div>

            <aside className="h-fit border border-site-line bg-site-surface p-5 sm:p-6">
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-site-greige">Price</p>
              <p className="mt-2 text-[22px] font-semibold leading-tight text-site-moss">{service.price}</p>
              <p className="mt-1 font-mono text-[11px] text-site-rust">Ballpark: {service.ballpark}</p>

              <div className="mt-5">
                <PayButtons payments={service.payments} />
              </div>

              <p className="mt-4 text-[12px] leading-relaxed text-site-greige">
                Not sure this is the right starting point? Take the $500 audit first.{' '}
                <Link to="/audit" className="font-semibold text-site-moss underline underline-offset-4">
                  See what it covers
                </Link>
              </p>
            </aside>
          </div>

          <p className="mt-10 max-w-3xl text-[11px] leading-relaxed text-site-greige">{PRICE_NOTE}</p>

          <div className="mt-10 border-t border-site-line pt-6">
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-site-greige">
              Other services
            </p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {others.map((item) => (
                <Link
                  key={item.slug}
                  to={`/services/${item.slug}`}
                  className="flex items-center justify-between gap-3 border border-site-line bg-site-surface px-4 py-3 text-[13px] font-semibold text-site-moss transition-colors hover:border-site-moss"
                >
                  <span>{item.name}</span>
                  <ArrowRight className="h-3.5 w-3.5 shrink-0 text-site-rust" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <ContactBand />
    </>
  );
}