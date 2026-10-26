import React from 'react';
import { WHATSAPP_URL } from '@/lib/contactConfig';

/**
 * Click-to-chat link. Renders nothing at all when no WhatsApp number is
 * configured, so the site never shows a WhatsApp CTA that goes nowhere.
 */
export default function WhatsAppLink({ className, onClick, children }) {
  if (!WHATSAPP_URL) return null;
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={onClick}>
      {children}
    </a>
  );
}