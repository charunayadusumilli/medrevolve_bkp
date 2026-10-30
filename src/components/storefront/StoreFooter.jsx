import React from 'react';
import { Link } from 'react-router-dom';
import { BadgeCheck } from 'lucide-react';
import { STOREFRONT_CATEGORIES, US_STATES } from '@/lib/storefront/catalog';
import { LEGITSCRIPT_URL } from './AnnouncementBar';

export default function StoreFooter() {
  return (
    <footer className="border-t border-sf-line bg-sf-surface">
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-sf-ink text-[11px] font-black text-white">
                MR
              </span>
              <span className="text-[17px] font-semibold tracking-tight">MedRevolve</span>
            </div>
            <p className="mt-4 max-w-xs text-[13px] leading-relaxed text-sf-muted">
              Consumer telehealth for weight, hormones, hair, skin and everyday wellness — delivered by
              licensed US providers and licensed pharmacies.
            </p>
            <a
              href={LEGITSCRIPT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 rounded-full border border-sf-line px-3 py-1.5 text-[11px] font-semibold text-sf-muted hover:text-sf-ink"
            >
              <BadgeCheck className="h-3.5 w-3.5 text-sf-accent" />
              Verify LegitScript certification
            </a>
          </div>

          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-sf-muted">Treatments</p>
            <ul className="mt-4 space-y-2.5">
              {STOREFRONT_CATEGORIES.map((c) => (
                <li key={c.slug}>
                  <Link to={`/shop/${c.slug}`} className="text-[13px] text-sf-ink/80 hover:text-sf-ink">
                    {c.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-sf-muted">Company</p>
            <ul className="mt-4 space-y-2.5">
              <li><Link to="/ForBusiness" className="text-[13px] text-sf-ink/80 hover:text-sf-ink">For business</Link></li>
              <li><Link to="/Partnerships" className="text-[13px] text-sf-ink/80 hover:text-sf-ink">Partnerships</Link></li>
              <li><Link to="/Blog" className="text-[13px] text-sf-ink/80 hover:text-sf-ink">Blog</Link></li>
              <li><Link to="/faq" className="text-[13px] text-sf-ink/80 hover:text-sf-ink">FAQ</Link></li>
              <li><Link to="/Contact" className="text-[13px] text-sf-ink/80 hover:text-sf-ink">Contact</Link></li>
            </ul>
          </div>

          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-sf-muted">Legal</p>
            <ul className="mt-4 space-y-2.5">
              <li><Link to="/Privacy" className="text-[13px] text-sf-ink/80 hover:text-sf-ink">Privacy Policy</Link></li>
              <li><Link to="/Terms" className="text-[13px] text-sf-ink/80 hover:text-sf-ink">Terms of Service</Link></li>
              <li><Link to="/HIPAANotice" className="text-[13px] text-sf-ink/80 hover:text-sf-ink">HIPAA Notice</Link></li>
              <li><Link to="/TelehealthConsent" className="text-[13px] text-sf-ink/80 hover:text-sf-ink">Telehealth Consent</Link></li>
              <li><Link to="/RefundPolicy" className="text-[13px] text-sf-ink/80 hover:text-sf-ink">Refund Policy</Link></li>
              <li><Link to="/MedicalDisclaimer" className="text-[13px] text-sf-ink/80 hover:text-sf-ink">Medical Disclaimer</Link></li>
              <li><Link to="/CookiePolicy" className="text-[13px] text-sf-ink/80 hover:text-sf-ink">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 rounded-2xl border border-sf-line bg-sf-paper p-5">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-sf-muted">State availability</p>
          <p className="mt-2 text-[11px] leading-relaxed text-sf-muted">
            We serve patients in all 50 states and Washington, DC. NAD+, glutathione and cold-chain shipping
            kits cannot ship to Alaska or Hawaii. Confirm your state in the basket before checkout.
          </p>
          <div className="mt-3 flex flex-wrap gap-1">
            {US_STATES.map((s) => (
              <span
                key={s.code}
                title={s.name}
                className="rounded border border-sf-line bg-sf-surface px-1.5 py-0.5 text-[10px] font-semibold text-sf-muted"
              >
                {s.code}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-8 space-y-3 border-t border-sf-line pt-8">
          <p className="text-[11px] leading-relaxed text-sf-muted">
            Prescription products require an online consultation with a licensed provider who will determine
            if a prescription is appropriate. Prescription products are dispensed by licensed US pharmacies.
            Compounded medications are prepared by state-licensed 503A pharmacies and are not FDA-approved;
            compounded medications are not reviewed by the FDA for safety, effectiveness, or quality.
          </p>
          <p className="text-[11px] leading-relaxed text-sf-muted">
            MedRevolve does not sell or dispense medication directly. Clinical services are delivered by
            independently licensed providers. Individual results vary. Information on this site is for
            educational purposes and is not a substitute for medical advice, diagnosis, or treatment.
            Statements about supplements have not been evaluated by the FDA and are not intended to diagnose,
            treat, cure, or prevent any disease.
          </p>
          <p className="text-[11px] text-sf-muted">
            © {new Date().getFullYear()} MedRevolve Corporation. All rights reserved. US residents only.
          </p>
        </div>
      </div>
    </footer>
  );
}