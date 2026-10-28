import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ConsumerHeader from './ConsumerHeader';
import ConsumerFooter from './ConsumerFooter';
import WhatsAppFloat from '@/components/site/WhatsAppFloat';

export default function ConsumerLayout({ children }) {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen flex-col bg-site-cream font-body text-site-moss antialiased">
      <ConsumerHeader />
      <main className="flex-1">{children}</main>
      <ConsumerFooter />
      <WhatsAppFloat />
    </div>
  );
}