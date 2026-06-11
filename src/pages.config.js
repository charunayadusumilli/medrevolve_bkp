/**
 * pages.config.js - Page routing configuration
 * 
 * PUBLIC routes only — no consumer pages, no admin-only tools, no internal dashboards.
 * All admin/internal routes are handled explicitly in App.jsx behind RequireAuth.
 * 
 * LegitScript Compliance: This file defines what is publicly crawlable.
 * Only B2B platform marketing pages + auth-required portals belong here.
 */

// ── PUBLIC B2B PAGES ─────────────────────────────────────────────────────────
import Home from './pages/Home';
import Services from './pages/Services.jsx';
import HowItWorks from './pages/HowItWorks.jsx';
import ForBusiness from './pages/ForBusiness';
import University from './pages/University';
import Contact from './pages/Contact';
import MerchantOnboarding from './pages/MerchantOnboarding';
import MerchantDemo from './pages/MerchantDemo';
import BusinessInquiry from './pages/BusinessInquiry';
import ForCreators from './pages/ForCreators';
import CreatorApplication from './pages/CreatorApplication';

// ── LEGAL PAGES ───────────────────────────────────────────────────────────────
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import HIPAANotice from './pages/HIPAANotice';
import TelehealthConsent from './pages/TelehealthConsent';
import MedicalDisclaimer from './pages/MedicalDisclaimer';
import CookiePolicy from './pages/CookiePolicy';

// ── AUTH-GATED PORTALS (require login — handled by the pages themselves) ──────
import PatientPortal from './pages/PatientPortal';
import AccountSettings from './pages/AccountSettings';
import MerchantDashboard from './pages/MerchantDashboard';

// ── LAYOUT ────────────────────────────────────────────────────────────────────
import __Layout from './Layout.jsx';

export const PAGES = {
    // Public B2B Marketing
    "Home": Home,
    "Services": Services,
    "HowItWorks": HowItWorks,
    "ForBusiness": ForBusiness,
    "University": University,
    "Contact": Contact,
    "MerchantOnboarding": MerchantOnboarding,
    "MerchantDemo": MerchantDemo,
    "BusinessInquiry": BusinessInquiry,
    "ForCreators": ForCreators,
    "CreatorApplication": CreatorApplication,

    // Legal
    "Privacy": Privacy,
    "Terms": Terms,
    "HIPAANotice": HIPAANotice,
    "TelehealthConsent": TelehealthConsent,
    "MedicalDisclaimer": MedicalDisclaimer,
    "CookiePolicy": CookiePolicy,

    // Auth-gated portals
    "PatientPortal": PatientPortal,
    "AccountSettings": AccountSettings,
    "MerchantDashboard": MerchantDashboard,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};