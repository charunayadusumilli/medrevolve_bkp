import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingBag } from 'lucide-react';
import ResearchGate from './ResearchGate';
import WhatsAppFloat from '@/components/site/WhatsAppFloat';
import SocialRow from '@/components/site/SocialRow';
import useRuoCart from '@/hooks/useRuoCart';
import { ruoCaseCount } from '@/lib/ruo/cart';
import { RUO_BANNER, RUO_NAV } from '@/lib/ruo/catalog';
import { useSite } from '@/lib/siteContext';

export default function RuoLayout({ children }) {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const cart = useRuoCart();
  const cases = ruoCaseCount(cart);
  const site = useSite();

  useEffect(() => {
    window.scrollTo({ top: 0 });
    setOpen(false);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen flex-col bg-site-cream font-body text-site-moss antialiased">
      <ResearchGate />

      <div className="sticky top-0 z-50 bg-site-moss px-4 py-2 text-center text-[10px] font-semibold uppercase tracking-[0.08em] text-site-cream">
        {RUO_BANNER}
      </div>

      <header className="sticky top-[32px] z-40 border-b border-site-line bg-site-cream/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-5 sm:px-8">
          <Link to="/" className="text-[17px] font-semibold tracking-tight">
            MedRevolve <span className="text-site-greige">Research</span>
          </Link>

          <nav className="hidden items-center gap-5 lg:flex">
            {RUO_NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`text-[12px] transition-colors duration-200 hover:text-site-moss ${
                  location.pathname === item.to ? 'text-site-moss' : 'text-site-greige'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              to="/cart"
              aria-label={`Research cart, ${cases} case${cases === 1 ? '' : 's'}`}
              className="relative grid h-9 w-9 place-items-center rounded-full text-site-moss hover:bg-site-surface"
            >
              <ShoppingBag className="h-[18px] w-[18px]" />
              {cases > 0 && (
                <span className="absolute -right-0.5 -top-0.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-site-rust px-1 text-[10px] font-bold text-site-cream">
                  {cases}
                </span>
              )}
            </Link>
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
              {RUO_NAV.map((item) => (
                <Link key={item.to} to={item.to} className="text-[14px]">{item.label}</Link>
              ))}
            </div>
          </div>
        )}
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-site-line bg-site-surface">
        <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="font-display text-[22px]">MedRevolve Research</p>
              <p className="mt-3 max-w-md text-[12px] leading-relaxed text-site-greige">
                {RUO_BANNER}. Materials are supplied to qualified researchers only. Business verification is
                required before first shipment. Net-30 terms available on approved accounts.
              </p>
              <div className="mt-4"><SocialRow /></div>
            </div>
            <div className="text-[12px] text-site-greige">
              <a href={site.whatsapp} target="_blank" rel="noopener noreferrer" className="font-semibold text-site-rust">
                Bulk quote on WhatsApp
              </a>
              <p className="mt-3">Batch documentation: <Link to="/lab-results" className="underline underline-offset-4">lab results</Link></p>
            </div>
          </div>
          <p className="mt-8 border-t border-site-line pt-5 text-[11px] text-site-greige">
            © {new Date().getFullYear()} MedRevolve Research. Not for human or animal consumption. No
            statements on this site have been evaluated by the FDA.
          </p>
        </div>
      </footer>

      <WhatsAppFloat />
    </div>
  );
}