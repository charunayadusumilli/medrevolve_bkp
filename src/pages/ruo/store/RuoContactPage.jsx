import React from 'react';
import { Link } from 'react-router-dom';
import { WHATSAPP_URL } from '@/lib/contactConfig';
import { RUO_STATEMENT } from '@/lib/ruo/storefront';

export default function RuoContactPage() {
  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_0.8fr]">
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-ruo-muted">Contact</p>
        <h1 className="mt-2 text-[28px] font-semibold tracking-tight sm:text-[34px]">
          Research support
        </h1>
        <p className="mt-3 max-w-lg text-[12px] leading-relaxed text-ruo-muted">
          Questions about a lot, a certificate of analysis, bulk availability, or an existing order are
          handled by email or WhatsApp. We reply within one business day.
        </p>

        <div className="mt-8 divide-y divide-ruo-line border-t border-ruo-ink">
          <div className="py-4">
            <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-ruo-muted">Email</p>
            <a href="mailto:support@medrevolveruo.com" className="mt-1 block text-[14px] underline underline-offset-4">
              support@medrevolveruo.com
            </a>
          </div>
          <div className="py-4">
            <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-ruo-muted">WhatsApp</p>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 block text-[14px] underline underline-offset-4"
            >
              Message the research desk
            </a>
          </div>
          <div className="py-4">
            <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-ruo-muted">Documents</p>
            <Link to="/ruo/coas" className="mt-1 block text-[14px] underline underline-offset-4">
              COA library
            </Link>
            <Link to="/ruo/verify" className="mt-1 block text-[14px] underline underline-offset-4">
              Verify a lot number
            </Link>
          </div>
        </div>
      </div>

      <aside className="h-fit border border-ruo-line p-6">
        <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-ruo-warn">Notice</p>
        <p className="mt-3 text-[12px] leading-relaxed text-ruo-muted">{RUO_STATEMENT}</p>
        <p className="mt-3 text-[12px] leading-relaxed text-ruo-muted">
          We cannot answer questions about human dosing, administration, or therapeutic use, and we do not
          provide medical advice.
        </p>
      </aside>
    </div>
  );
}