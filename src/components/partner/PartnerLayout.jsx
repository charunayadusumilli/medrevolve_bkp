import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, Menu, X } from 'lucide-react';
import SocialRow from '@/components/site/SocialRow';
import WhatsAppFloat from '@/components/site/WhatsAppFloat';
import BookDemoLink from '@/components/BookDemoLink';
import { useSite } from '@/lib/siteContext';
import { B2B_CONTACT } from '@/lib/partner/offerings';

const NAV = [
  { label: 'Platform', to: '/' },
  { label: 'Modules & pricing', to: '/services' },
  { label: 'RUO supply', to: '/ruo' },
  { label: 'Partners', to: '/partners' },
  { label: 'Audit', to: '/audit' },
  { label: 'Blog', to: '/Blog' },
  { label: 'Contact', to: '/Contact' },
];

const FOOTER_LEGAL = [
  { label: 'Terms', to: '/Terms' },
  { label: 'Privacy', to: '/Privacy' },
  { label: 'Refund Policy', to: '/RefundPolicy' },
  { label: 'Medical Disclaimer', to: '/MedicalDisclaimer' },
];

export default function PartnerLayout({ children }) {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const site = useSite();

  useEffect(() => {
    window.scrollTo({ top: 0 });
    setOpen(false);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen flex-col bg-site-cream font-body text-site-moss antialiased">
      <div className="bg-site-moss text-site-cream">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 px-5 py-2.5 text-[12px] sm:px-8">
          <span className="uppercase tracking-[0.08em] text-site-cream/70">Partner HQ</span>
          <a href="https://medrevolve.com" className="inline-flex items-center gap-1.5 font-semibold hover:text-white">
            Shopping as a patient? Go to medrevolve.com <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>

      <header className="sticky top-0 z-50 border-b border-site-line bg-site-cream/95 backdrop-blur">
        <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between gap-4 px-5 sm:px-8">
          <Link to="/" className="text-[19px] font-semibold tracking-tight">MedRevolve</Link>

          <nav className="hidden items-center gap-6 lg:flex">
            {NAV.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                className="text-[13px] text-site-greige transition-colors duration-200 hover:text-site-moss"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <BookDemoLink className="hidden rounded-lg bg-site-rust px-4 py-2.5 text-[13px] font-semibold text-site-cream transition-opacity duration-200 hover:opacity-90 sm:inline-flex">
              Book a demo
            </BookDemoLink>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label="Toggle menu"
              className="grid h-9 w-9 place-items-center rounded-full border border-site-line lg:hidden"
            >
              {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {open && (
          <div className="border-t border-site-line bg-site-surface px-5 py-4 lg:hidden">
            <div className="grid gap-3">
              {NAV.map((item) => (
                <Link key={item.label} to={item.to} className="text-[14px]">{item.label}</Link>
              ))}
              <BookDemoLink className="rounded-lg bg-site-rust px-4 py-2.5 text-center text-[13px] font-semibold text-site-cream">
                Book a demo
              </BookDemoLink>
            </div>
          </div>
        )}
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-site-line bg-site-surface">
        <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 md:py-16">
          <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="font-display text-[24px]">MedRevolve</p>
              <p className="mt-3 max-w-sm text-[13px] leading-relaxed text-site-greige">
                White-label telehealth infrastructure: clinical, pharmacy, compliance and payments under
                your brand.
              </p>
              <div className="mt-5"><SocialRow /></div>
            </div>
            <div className="flex flex-col gap-3">
              <BookDemoLink className="inline-flex justify-center rounded-lg bg-site-moss px-5 py-3 text-[13px] font-semibold text-site-cream">
                Book a demo
              </BookDemoLink>
              <a href={site.whatsapp} target="_blank" rel="noopener noreferrer" className="text-center text-[12px] font-semibold text-site-rust">
                Message us on WhatsApp
              </a>
              <a href="https://medrevolve.com" className="text-center text-[12px] text-site-greige underline underline-offset-4">
                Patient site: medrevolve.com
              </a>
              <a href={`tel:${B2B_CONTACT.phoneTel}`} className="text-center font-mono text-[14px] font-semibold text-site-moss">
                {B2B_CONTACT.phoneDisplay}
              </a>
              <a href={`mailto:${B2B_CONTACT.email}`} className="text-center text-[12px] text-site-greige underline underline-offset-4">
                {B2B_CONTACT.email}
              </a>
            </div>
          </div>
          <ul className="mt-8 flex flex-wrap gap-x-5 gap-y-2 border-t border-site-line pt-5">
            {FOOTER_LEGAL.map((item) => (
              <li key={item.label}>
                <Link to={item.to} className="text-[12px] text-site-greige underline decoration-transparent underline-offset-4 hover:decoration-site-greige">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-5 text-[11px] text-site-greige">
            © {new Date().getFullYear()} MedRevolve Corporation. Clinical services are delivered by
            independently licensed providers; pharmacy fulfillment by NABP-verified partners.
          </p>
        </div>
      </footer>

      <WhatsAppFloat />
    </div>
  );
}