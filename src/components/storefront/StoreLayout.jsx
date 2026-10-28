import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, ShoppingBasket, X, User, BadgeCheck } from 'lucide-react';
import AnnouncementBar, { LEGITSCRIPT_URL } from './AnnouncementBar';
import StoreFooter from './StoreFooter';
import { STOREFRONT_CATEGORIES } from '@/lib/storefront/catalog';
import { cartCount } from '@/lib/storefront/cart';
import useStoreCart from '@/hooks/useStoreCart';
import { base44 } from '@/api/base44Client';

const NAV = [
  { label: 'Shop all', to: '/shop' },
  { label: 'Weight loss', to: '/shop/weight-loss' },
  { label: 'Sexual health', to: '/shop/sexual-health' },
  { label: 'Hair', to: '/shop/hair' },
  { label: 'Skin', to: '/shop/skin' },
  { label: 'Labs', to: '/shop/labs' },
  { label: 'Free tools', to: '/tools/bmi' },
];

export default function StoreLayout({ children }) {
  const cart = useStoreCart();
  const count = cartCount(cart);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0 });
    setMenuOpen(false);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen flex-col bg-sf-paper font-body text-sf-ink antialiased">
      <AnnouncementBar />

      <header className="sticky top-0 z-50 border-b border-sf-line bg-sf-paper/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-5 sm:px-8">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-sf-ink text-[11px] font-black tracking-tight text-white">
              MR
            </span>
            <span className="text-[17px] font-semibold tracking-tight">MedRevolve</span>
          </Link>

          <nav className="hidden items-center gap-6 lg:flex">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="text-[13px] font-medium text-sf-muted transition-colors hover:text-sf-ink"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1.5">
            <a
              href={LEGITSCRIPT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mr-1 hidden items-center gap-1.5 rounded-full border border-sf-line px-3 py-1.5 text-[11px] font-semibold text-sf-muted transition-colors hover:text-sf-ink sm:inline-flex"
              title="Verify our LegitScript certification"
            >
              <BadgeCheck className="h-3.5 w-3.5 text-sf-accent" />
              LegitScript
            </a>

            <button
              type="button"
              onClick={() => base44.auth.redirectToLogin(window.location.href)}
              className="hidden items-center gap-1.5 rounded-full px-3 py-2 text-[13px] font-medium text-sf-muted transition-colors hover:text-sf-ink sm:inline-flex"
            >
              <User className="h-4 w-4" />
              Sign in
            </button>

            <Link
              to="/cart"
              className="relative inline-flex items-center gap-2 rounded-full bg-sf-ink px-4 py-2 text-[13px] font-semibold text-white transition-opacity hover:opacity-90"
              aria-label={`Basket, ${count} item${count === 1 ? '' : 's'}`}
            >
              <ShoppingBasket className="h-4 w-4" />
              <span className="hidden sm:inline">Basket</span>
              {count > 0 && (
                <span className="grid h-5 min-w-5 place-items-center rounded-full bg-sf-sun px-1 text-[11px] font-bold text-sf-ink">
                  {count}
                </span>
              )}
            </Link>

            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              className="ml-0.5 grid h-9 w-9 place-items-center rounded-full border border-sf-line text-sf-ink lg:hidden"
              aria-label="Toggle menu"
            >
              {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="border-t border-sf-line bg-sf-surface px-5 py-4 lg:hidden">
            <div className="grid grid-cols-2 gap-x-4 gap-y-3">
              {STOREFRONT_CATEGORIES.map((c) => (
                <Link key={c.slug} to={`/shop/${c.slug}`} className="text-sm font-medium text-sf-ink">
                  {c.label}
                </Link>
              ))}
              <Link to="/shop" className="text-sm font-semibold text-sf-accent">Shop all</Link>
              <Link to="/tools/bmi" className="text-sm font-medium text-sf-ink">Free tools</Link>
              <Link to="/ForBusiness" className="text-sm font-medium text-sf-ink">For business</Link>
              <button
                type="button"
                onClick={() => base44.auth.redirectToLogin(window.location.href)}
                className="text-left text-sm font-medium text-sf-ink"
              >
                Sign in
              </button>
            </div>
          </div>
        )}
      </header>

      <main className="flex-1">{children}</main>

      <StoreFooter />
    </div>
  );
}