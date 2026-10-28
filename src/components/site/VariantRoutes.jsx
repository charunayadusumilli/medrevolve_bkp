import React from 'react';
import { useSite } from '@/lib/siteContext';
import ConsumerLayout from '@/components/consumer/ConsumerLayout';
import PartnerLayout from '@/components/partner/PartnerLayout';
import RuoLayout from '@/components/ruo/RuoLayout';
import ConsumerHome from '@/pages/consumer/ConsumerHome';
import ConsumerCheckout from '@/pages/consumer/ConsumerCheckout';
import PartnerHome from '@/pages/partner/PartnerHome';
import RuoHome from '@/pages/ruo/RuoHome';
import RuoCart from '@/pages/ruo/RuoCart';
import RuoCheckout from '@/pages/ruo/RuoCheckout';
import StoreCart from '@/pages/storefront/StoreCart';
import CheckoutSuccess from '@/pages/checkout/CheckoutSuccess';
import RuoContact from '@/pages/ruo/RuoContact';
import Contact from '@/pages/Contact';
import Layout from '@/Layout';

/** Hostname decides which of the three sites a route renders. */
export function SiteHome() {
  const { site } = useSite();
  if (site === 'RUO') return <RuoLayout><RuoHome /></RuoLayout>;
  if (site === 'PARTNER') return <PartnerLayout><PartnerHome /></PartnerLayout>;
  return <ConsumerLayout><ConsumerHome /></ConsumerLayout>;
}

export function SiteCart() {
  const { site } = useSite();
  if (site === 'RUO') return <RuoLayout><RuoCart /></RuoLayout>;
  return <ConsumerLayout><StoreCart /></ConsumerLayout>;
}

export function SiteCheckout() {
  const { site } = useSite();
  if (site === 'RUO') return <RuoLayout><RuoCheckout /></RuoLayout>;
  return <ConsumerLayout><ConsumerCheckout /></ConsumerLayout>;
}

export function SiteCheckoutSuccess() {
  const { site } = useSite();
  if (site === 'RUO') return <RuoLayout><CheckoutSuccess /></RuoLayout>;
  if (site === 'PARTNER') return <PartnerLayout><CheckoutSuccess /></PartnerLayout>;
  return <ConsumerLayout><CheckoutSuccess /></ConsumerLayout>;
}

export function SiteContact() {
  const { site } = useSite();
  if (site === 'RUO') return <RuoLayout><RuoContact /></RuoLayout>;
  return <Layout currentPageName="Contact"><Contact /></Layout>;
}

export function ConsumerShell({ children }) {
  return <ConsumerLayout>{children}</ConsumerLayout>;
}

export function RuoShell({ children }) {
  return <RuoLayout>{children}</RuoLayout>;
}