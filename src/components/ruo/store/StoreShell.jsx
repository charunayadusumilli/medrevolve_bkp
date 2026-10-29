import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { WHATSAPP_URL } from '@/lib/contactConfig';
import { totalUnits } from '@/lib/ruo/storeCart';
import { RUO_STATEMENT } from '@/lib/ruo/storefront';
import useCaseCart from '@/hooks/useCaseCart';
import AgeGate, { hasAcceptedGate } from './AgeGate';

const NAV = [
  { label: 'Catalog', to: '/ruo/catalog' },
  { label: 'COA Library', to: '/ruo/coas' },
  { label: 'Verify', to: '/ruo/verify' },
  { label: 'Wholesale', to: '/ruo/wholesale' },
  { label: 'Documentation', to: '/ruo/documentation' },
  { label: 'Contact', to: '/ruo/contact' },
];

export default function StoreShell({ children }) {
  const [accepted, setAccepted] = useState(() => hasAcceptedGate());
  const [open, setOpen] = useState(false);
  const cart = useCaseCart();
  const units = totalUnits(cart);
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0 });
    setOpen(false);
  }, [location.pathname]);

  if (!accepted) return <AgeGate onAccept={() => setAccepted(true)} />;

  return (
    <div className="min-h-screen bg-ruo-bg font-body text-ruo-ink antialiased">
      <div className="sticky top-0 z-50 border-b border-ruo-ink bg-ruo-ink px-4 py-1.5 text-center font-mono text-[9px] uppercase tracking-[0.22em] text-ruo-bg">
        Research use only · 21+ · Not for human or veterinary use
      </div>

      <header className="sticky top-[27px] z-40 border-b border-ruo-line bg-ruo-bg/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-[1180px] items-center justify-between gap-6 px-5 sm:px-8">
          <Link to="/ruo/catalog" className="shrink-0">
            <span className="block font-mono text-[11px] uppercase tracking-[0.2em] text-ruo-muted">
              MedRevolve
            </span>
            <span className="block text-[15px] font-semibold leading-tight tracking-tight">
              Research Supply
            </span>
          </Link>

          <nav className="hidden items-center gap-6 lg:flex">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`text-[12px] transition-colors hover:text-ruo-ink ${
                  location.pathname === item.to ? 'text-ruo-ink' : 'text-ruo-muted'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <Link
              to="/ruo/cart"
              className="border border-ruo-ink px-3 py-2 font-mono text-[10px] uppercase tracking-[0.14em]"
            >
              Case cart{units > 0 ? ` (${units})` : ''}
            </Link>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="font-mono text-[10px] uppercase tracking-[0.14em] lg:hidden"
            >
              {open ? 'Close' : 'Menu'}
            </button>
          </div>
        </div>

        {open && (
          <div className="border-t border-ruo-line px-5 py-4 lg:hidden">
            <div className="grid gap-3">
              {NAV.map((item) => (
                <Link key={item.to} to={item.to} className="text-[13px]">
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>

      <main className="mx-auto max-w-[1180px] px-5 py-10 sm:px-8">{children}</main>

      <footer className="border-t border-ruo-ink bg-ruo-surface">
        <div className="mx-auto max-w-[1180px] px-5 py-10 sm:px-8">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-ruo-warn">
            Research use only
          </p>
          <p className="mt-4 max-w-3xl text-[12px] leading-relaxed text-ruo-muted">{RUO_STATEMENT}</p>
          <p className="mt-3 max-w-3xl text-[12px] leading-relaxed text-ruo-muted">
            21 or older. Not for human or veterinary use. No therapeutic claims are made for any material
            on this site. Statements here have not been evaluated by the FDA.
          </p>

          <div className="mt-8 grid gap-6 border-t border-ruo-line pt-6 text-[12px] sm:grid-cols-2">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-ruo-muted">Support</p>
              <a href="mailto:support@medrevolveruo.com" className="mt-2 block underline underline-offset-4">
                support@medrevolveruo.com
              </a>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 block underline underline-offset-4"
              >
                WhatsApp — bulk and lot questions
              </a>
            </div>
            <div className="sm:text-right">
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-ruo-muted">Documents</p>
              <Link to="/ruo/coas" className="mt-2 block underline underline-offset-4">COA library</Link>
              <Link to="/ruo/verify" className="mt-2 block underline underline-offset-4">Verify a lot</Link>
            </div>
          </div>

          <p className="mt-8 border-t border-ruo-line pt-5 font-mono text-[10px] text-ruo-muted">
            © {new Date().getFullYear()} MedRevolve Research · Not a 503A or 503B pharmacy
          </p>
        </div>
      </footer>
    </div>
  );
}