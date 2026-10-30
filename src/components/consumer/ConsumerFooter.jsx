import React from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
import NewsletterForm from '@/components/site/NewsletterForm';
import SocialRow from '@/components/site/SocialRow';
import { useSite } from '@/lib/siteContext';

export default function ConsumerFooter() {
  const site = useSite();

  return (
    <footer className="border-t border-site-line bg-site-cream">
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 md:py-20">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <p className="font-display text-[24px] text-site-moss">MedRevolve</p>
            <p className="mt-3 max-w-xs text-[13px] leading-relaxed text-site-greige">
              Licensed providers, real prescriptions, delivered. Telehealth care for weight, hormones,
              skin, hair and everyday health.
            </p>
            <div className="mt-5">
              <SocialRow />
            </div>
          </div>

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-site-greige">Shop</p>
            <ul className="mt-3 space-y-2 text-[13px] text-site-moss">
              <li><Link to="/shop" className="hover:text-site-rust">All treatments</Link></li>
              <li><Link to="/shop/weight-loss" className="hover:text-site-rust">Weight care</Link></li>
              <li><Link to="/shop/testosterone" className="hover:text-site-rust">Hormone health</Link></li>
              <li><Link to="/shop/labs" className="hover:text-site-rust">Labs</Link></li>
              <li><Link to="/cart" className="hover:text-site-rust">Basket</Link></li>
            </ul>
          </div>

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-site-greige">Company</p>
            <ul className="mt-3 space-y-2 text-[13px] text-site-moss">
              <li><Link to="/HowItWorks" className="hover:text-site-rust">How it works</Link></li>
              <li><Link to="/patient-faq" className="hover:text-site-rust">FAQ</Link></li>
              <li><Link to="/Privacy" className="hover:text-site-rust">Privacy</Link></li>
              <li><Link to="/Terms" className="hover:text-site-rust">Terms</Link></li>
              <li><Link to="/TelehealthConsent" className="hover:text-site-rust">Telehealth consent</Link></li>
              <li><Link to="/RefundPolicy" className="hover:text-site-rust">Refund policy</Link></li>
              <li><Link to="/MedicalDisclaimer" className="hover:text-site-rust">Medical disclaimer</Link></li>
            </ul>
          </div>

          <div>
            <NewsletterForm />
            <a
              href={site.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 rounded-lg border border-site-moss px-4 py-2.5 text-[12px] font-semibold text-site-moss transition-colors duration-200 hover:bg-site-surface"
            >
              <MessageCircle className="h-4 w-4" /> Chat with us
            </a>
          </div>
        </div>

        <div className="mt-12 border-t border-site-line pt-6">
          <p className="text-[11px] leading-relaxed text-site-greige">
            MedRevolve connects patients with independently licensed US providers and state-licensed
            pharmacies. Compounded medications are not FDA-approved and are prepared by a 503A pharmacy
            under a patient-specific prescription. Prescription products require a provider consultation;
            a prescription is not guaranteed. Prices shown are cash-pay and exclude taxes.
          </p>
          <p className="mt-3 text-[11px] text-site-greige">
            © {new Date().getFullYear()} MedRevolve Corporation. US residents only.
          </p>
        </div>
      </div>
    </footer>
  );
}