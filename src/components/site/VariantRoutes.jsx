import React from 'react';
import { useSite } from '@/lib/siteContext';
import ConsumerLayout from '@/components/consumer/ConsumerLayout';
import PartnerLayout from '@/components/partner/PartnerLayout';
import StoreShell from '@/components/ruo/store/StoreShell';
import ConsumerHome from '@/pages/consumer/ConsumerHome';
import ConsumerCheckout from '@/pages/consumer/ConsumerCheckout';
import PartnerHome from '@/pages/partner/PartnerHome';
import RuoCatalogPage from '@/pages/ruo/store/RuoCatalogPage';
import RuoCaseCartPage from '@/pages/ruo/store/RuoCaseCartPage';
import RuoCheckoutPage from '@/pages/ruo/store/RuoCheckoutPage';
import RuoContactPage from '@/pages/ruo/store/RuoContactPage';
import StoreCart from '@/pages/storefront/StoreCart';
import CheckoutSuccess from '@/pages/checkout/CheckoutSuccess';
import Contact from '@/pages/Contact';
import Layout from '@/Layout';

/** Hostname decides which of the three sites a route renders. */
export function SiteHome() {
  const { site } = useSite();
  if (site === 'RUO') return <StoreShell><RuoCatalogPage /></StoreShell>;
  if (site === 'PARTNER') return <PartnerLayout><PartnerHome /></PartnerLayout>;
  return <ConsumerLayout><ConsumerHome /></ConsumerLayout>;
}

export function SiteCart() {
  const { site } = useSite();
  if (site === 'RUO') return <StoreShell><RuoCaseCartPage /></StoreShell>;
  return <ConsumerLayout><StoreCart /></ConsumerLayout>;
}

export function SiteCheckout() {
  const { site } = useSite();
  if (site === 'RUO') return <StoreShell><RuoCheckoutPage /></StoreShell>;
  return <ConsumerLayout><ConsumerCheckout /></ConsumerLayout>;
}

export function SiteCheckoutSuccess() {
  const { site } = useSite();
  // The RUO checkout confirms on its own page, so this route only serves legacy links.
  if (site === 'RUO') return <StoreShell><RuoCatalogPage /></StoreShell>;
  if (site === 'PARTNER') return <PartnerLayout><CheckoutSuccess /></PartnerLayout>;
  return <ConsumerLayout><CheckoutSuccess /></ConsumerLayout>;
}

export function SiteContact() {
  const { site } = useSite();
  if (site === 'RUO') return <StoreShell><RuoContactPage /></StoreShell>;
  return <Layout currentPageName="Contact"><Contact /></Layout>;
}

export function ConsumerShell({ children }) {
  return <ConsumerLayout>{children}</ConsumerLayout>;
}

export function RuoShell({ children }) {
  return <StoreShell>{children}</StoreShell>;
}