import React from 'react';
import { MessageCircle } from 'lucide-react';
import { useSite } from '@/lib/siteContext';

export default function WhatsAppFloat() {
  const site = useSite();

  return (
    <a
      href={site.whatsapp}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 rounded-full bg-site-moss px-4 py-3 text-[12px] font-semibold tracking-wide text-site-cream shadow-lg transition-transform duration-200 hover:scale-[1.02]"
    >
      <MessageCircle className="h-4 w-4" />
      <span className="hidden sm:inline">Chat with us</span>
    </a>
  );
}