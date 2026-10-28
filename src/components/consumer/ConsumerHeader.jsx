import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Menu, X } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import useStoreCart from '@/hooks/useStoreCart';
import { cartCount } from '@/lib/storefront/cart';

const NAV = [
  { label: 'Shop', to: '/shop' },
  { label: 'Weight Care', to: '/shop/weight-loss' },
  { label: 'Hormone Health', to: '/shop/testosterone' },
  { label: 'Skin', to: '/shop/skin' },
  { label: 'Labs', to: '/shop/labs' },
  { label: 'How It Works', to: '/HowItWorks' },
];

export default function ConsumerHeader() {
  const cart = useStoreCart();
  const count = cartCount(cart);
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 border-b border-site-moss/15 bg-site-cream/95 backdrop-blur">
      <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between gap-4 px-5 sm:px-8">
        <Link to="/" className="text-[19px] font-semibold tracking-tight text-site-moss" onClick={() => setOpen(false)}>
          MedRevolve
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`text-[13px] transition-colors duration-200 hover:text-site-moss ${
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
            aria-label={`Basket, ${count} item${count === 1 ? '' : 's'}`}
            className="relative grid h-9 w-9 place-items-center rounded-full text-site-moss transition-colors duration-200 hover:bg-site-surface"
          >
            <ShoppingBag className="h-[18px] w-[18px]" />
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-site-rust px-1 text-[10px] font-bold text-site-cream">
                {count}
              </span>
            )}
          </Link>

          <button
            type="button"
            onClick={() => base44.auth.redirectToLogin(window.location.href)}
            className="hidden rounded-lg px-3 py-2 text-[13px] font-medium text-site-greige transition-colors duration-200 hover:text-site-moss sm:inline-flex"
          >
            Sign In
          </button>

          <Link
            to="/start"
            className="hidden rounded-lg bg-site-rust px-4 py-2.5 text-[13px] font-semibold text-site-cream transition-opacity duration-200 hover:opacity-90 sm:inline-flex"
          >
            Start Intake
          </Link>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            className="grid h-9 w-9 place-items-center rounded-full border border-site-line text-site-moss lg:hidden"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-site-line bg-site-surface px-5 py-4 lg:hidden">
          <div className="grid gap-3">
            {NAV.map((item) => (
              <Link key={item.to} to={item.to} onClick={() => setOpen(false)} className="text-[14px] text-site-moss">
                {item.label}
              </Link>
            ))}
            <Link to="/start" onClick={() => setOpen(false)} className="rounded-lg bg-site-rust px-4 py-2.5 text-center text-[13px] font-semibold text-site-cream">
              Start Intake
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}