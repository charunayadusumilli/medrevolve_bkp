import { Toaster } from "@/components/ui/toaster"
import React from 'react';
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import NavigationTracker from '@/lib/NavigationTracker'
import { pagesConfig } from './pages.config'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
// ── ADMIN-ONLY INTERNAL TOOLS (auth-gated) ────────────────────────────────────
import AdminDashboard from './pages/AdminDashboard';
import ComplianceDashboard from './pages/ComplianceDashboard';
import PartnershipHub from './pages/PartnershipHub';
import PaymentsDashboard from './pages/PaymentsDashboard';
import InboxDashboard from './pages/InboxDashboard';
import MailboxBoard from './pages/MailboxBoard';
import GrowthDashboard from './pages/GrowthDashboard';
import GodModeAds from './pages/GodModeAds';
import AdsManager from './pages/AdsManager';
import CampaignStudio from './pages/CampaignStudio';
import GoLink from './pages/GoLink';
import { base44 } from '@/api/base44Client';
import { detectDomain } from '@/lib/domainConfig';
import DTCHome from './pages/dtc/DTCHome';
import Shop from './pages/dtc/Shop';
import ProductDetail from './pages/dtc/ProductDetail';
import DTCCart from './pages/dtc/DTCCart';
import GetStarted from './pages/dtc/GetStarted';
import SystemArchitecture from './pages/SystemArchitecture';
import ComplianceAuditReport from './pages/ComplianceAuditReport';
import ProjectManagement from './pages/ProjectManagement';
import MarketingDashboard from './pages/MarketingDashboard';
import SocialMediaDashboard from './pages/SocialMediaDashboard';
import SocialMediaManagement from './pages/SocialMediaManagement';
import TelephonyDashboard from './pages/TelephonyDashboard';
import PhoneIntake from './pages/PhoneIntake';
import PatientPortal from './pages/PatientPortal';
import MerchantInventoryPage from './pages/MerchantInventoryPage';
import MerchantDomainPage from './pages/MerchantDomainPage';
import ProviderDashboard from './pages/ProviderDashboard';
import ProviderContracts from './pages/ProviderContracts';
import PharmacyContracts from './pages/PharmacyContracts';
import ProviderOutreach from './pages/ProviderOutreach';
import PartnerPortal from './pages/PartnerPortal';
import PartnerCompliance from './pages/PartnerCompliance';
import PartnerProgram from './pages/PartnerProgram';
import PartnerSignup from './pages/PartnerSignup';
import EmailAudit from './pages/EmailAudit';
import IntegrationsDashboard from './pages/IntegrationsDashboard';
import MDIntegrationsDashboard from './pages/MDIntegrationsDashboard';
import BelugaIntegration from './pages/BelugaIntegration';
import Cart from './pages/Cart';
import MerchantOnboardingIntake from './pages/MerchantOnboardingIntake';
import MerchantDocuments from './pages/MerchantDocuments';
import PatientFAQ from './pages/PatientFAQ';
import WhiteLabelTelehealthPlatform from './pages/lp/WhiteLabelTelehealthPlatform';
import UnifiedCRM from './pages/lp/UnifiedCRM';
import PaymentProcessing from './pages/lp/PaymentProcessing';
import ForCreatorsLP from './pages/lp/ForCreatorsLP';
import ForEntrepreneurs from './pages/lp/ForEntrepreneurs';
import TelehealthServicesForMedSpa from './pages/lp/TelehealthServicesForMedSpa';
import Partnerships from './pages/Partnerships';
import Blog from './pages/Blog';
import OperatorFAQ from './pages/OperatorFAQ';
import ForBusiness from './pages/ForBusiness';
// ── THREE-DOMAIN ROUTING (consumer / partner HQ / RUO) ───────────────────────
import { SiteProvider } from './lib/siteContext';
import {
  SiteHome, SiteCart, SiteCheckout, SiteCheckoutSuccess, SiteContact, ConsumerShell,
} from './components/site/VariantRoutes';
import StoreShell from './components/ruo/store/StoreShell';
import RuoCatalogPage from './pages/ruo/store/RuoCatalogPage';
import RuoVerifyPage from './pages/ruo/store/RuoVerifyPage';
import RuoCoasPage from './pages/ruo/store/RuoCoasPage';
import RuoWholesalePage from './pages/ruo/store/RuoWholesalePage';
import RuoDocumentationPage from './pages/ruo/store/RuoDocumentationPage';
import RuoContactPage from './pages/ruo/store/RuoContactPage';
import RuoCaseCartPage from './pages/ruo/store/RuoCaseCartPage';
import RuoCheckoutPage from './pages/ruo/store/RuoCheckoutPage';
// ── CONSUMER STOREFRONT (medrevolve.com shop, product, intake) ────────────────
import StoreShop from './pages/storefront/StoreShop';
import StoreProduct from './pages/storefront/StoreProduct';
import IntakeStart from './pages/storefront/IntakeStart';
import ToolsPage from './pages/storefront/ToolsPage';
// ── PROVIDER / PATIENT FLOWS (auth-gated) ─────────────────────────────────────
import BookAppointment from './pages/BookAppointment';
import MyAppointments from './pages/MyAppointments';
import Messages from './pages/Messages';
import Consultations from './pages/Consultations';
import VideoCall from './pages/VideoCall';
import WaitingRoom from './pages/WaitingRoom';
import QualiphyConsult from './pages/QualiphyConsult';
import VisitTypeSelector from './pages/VisitTypeSelector';
import PatientOnboarding from './pages/PatientOnboarding';
import AutoRxFollowup from './pages/AutoRxFollowup';
import Questionnaire from './pages/Questionnaire';
import ProviderProfile from './pages/ProviderProfile';
import ProviderIntake from './pages/ProviderIntake';
import ProviderOnboarding from './pages/ProviderOnboarding';
import PharmacyIntake from './pages/PharmacyIntake';
import CustomerIntake from './pages/CustomerIntake';
// ── PERSONALIZED DEMO ─────────────────────────────────────────────────────────
import PersonalizedDemo from './pages/PersonalizedDemo';
import OAuthConsent from './pages/OAuthConsent';
// ── SEO LANDING PAGES ─────────────────────────────────────────────────────────
import ForMedSpas from './pages/ForMedSpas';
import TRTClinicPlatform from './pages/TRTClinicPlatform';
import WeightLossClinicPlatform from './pages/WeightLossClinicPlatform';
import OpenLoopAlternative from './pages/OpenLoopAlternative';
import MyTelemedicineAlternative from './pages/MyTelemedicineAlternative';
import TelehealthFranchise from './pages/TelehealthFranchise';
import IVTherapyClinicPlatform from './pages/IVTherapyClinicPlatform';
// B2C commerce pages removed per B2B repositioning cleanup

// Auth gate — redirects unauthenticated users to login
function AuthGate({ children }) {
  const [checked, setChecked] = React.useState(false);
  const [authed, setAuthed] = React.useState(false);
  React.useEffect(() => {
    base44.auth.isAuthenticated().then(ok => {
      if (!ok) { base44.auth.redirectToLogin(window.location.href); }
      else { setAuthed(true); }
      setChecked(true);
    });
  }, []);
  if (!checked) return <div className="flex items-center justify-center min-h-screen"><div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin" /></div>;
  return authed ? children : null;
}

const { Pages, Layout, mainPage } = pagesConfig;
const mainPageKey = mainPage ?? Object.keys(Pages)[0];
const MainPage = mainPageKey ? Pages[mainPageKey] : <></>;

const LayoutWrapper = ({ children, currentPageName }) => Layout ?
  <Layout currentPageName={currentPageName}>{children}</Layout>
  : <>{children}</>;

// Domain-aware home: patient app on app.medrevolve.com, B2B platform site everywhere else
const DomainHome = () => detectDomain() === 'APP' ? <DTCHome /> : <MainPage />;

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  // Show loading spinner while checking app public settings or auth
  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Handle authentication errors
  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    }
    // For auth_required, don't redirect globally — let individual pages handle their own auth gates
  }

  // Render the main app
  return (
    <Routes>
      {/* ── HOME — hostname decides consumer / partner HQ / RUO ───────────── */}
      <Route path="/" element={<SiteHome />} />

      {/* ── CONSUMER CATALOG (medrevolve.com) ─────────────────────────────── */}
      <Route path="/shop" element={<ConsumerShell><StoreShop /></ConsumerShell>} />
      <Route path="/shop/:category" element={<ConsumerShell><StoreShop /></ConsumerShell>} />
      <Route path="/product/:slug" element={<ConsumerShell><StoreProduct /></ConsumerShell>} />
      <Route path="/intake/:category" element={<ConsumerShell><IntakeStart /></ConsumerShell>} />
      <Route path="/tools/:slug" element={<ConsumerShell><ToolsPage /></ConsumerShell>} />

      {/* ── CART + CHECKOUT — rail-scoped by hostname ─────────────────────── */}
      <Route path="/cart" element={<SiteCart />} />
      <Route path="/checkout" element={<SiteCheckout />} />
      <Route path="/checkout/success" element={<SiteCheckoutSuccess />} />

      {/* ── RUO RESEARCH STORE (medrevolveruo.com) — 21+ gate, institutional ── */}
      <Route path="/ruo/catalog" element={<StoreShell><RuoCatalogPage /></StoreShell>} />
      <Route path="/ruo/verify" element={<StoreShell><RuoVerifyPage /></StoreShell>} />
      <Route path="/ruo/coas" element={<StoreShell><RuoCoasPage /></StoreShell>} />
      <Route path="/ruo/wholesale" element={<StoreShell><RuoWholesalePage /></StoreShell>} />
      <Route path="/ruo/documentation" element={<StoreShell><RuoDocumentationPage /></StoreShell>} />
      <Route path="/ruo/contact" element={<StoreShell><RuoContactPage /></StoreShell>} />
      <Route path="/ruo/cart" element={<StoreShell><RuoCaseCartPage /></StoreShell>} />
      <Route path="/ruo/checkout" element={<StoreShell><RuoCheckoutPage /></StoreShell>} />
      {/* legacy RUO entry points → the same storefront */}
      <Route path="/catalog" element={<StoreShell><RuoCatalogPage /></StoreShell>} />
      <Route path="/catalog/:category" element={<StoreShell><RuoCatalogPage /></StoreShell>} />
      <Route path="/ruo/:slug" element={<StoreShell><RuoCatalogPage /></StoreShell>} />
      <Route path="/lab-results" element={<StoreShell><RuoCoasPage /></StoreShell>} />
      <Route path="/bulk-orders" element={<StoreShell><RuoWholesalePage /></StoreShell>} />
      <Route path="/how-to-order" element={<StoreShell><RuoDocumentationPage /></StoreShell>} />
      <Route path="/track-order" element={<StoreShell><RuoDocumentationPage /></StoreShell>} />
      <Route path="/compliance" element={<StoreShell><RuoDocumentationPage /></StoreShell>} />
      <Route path="/contact" element={<SiteContact />} />
      <Route path="/dtc-cart" element={<LayoutWrapper currentPageName="DTCCart"><DTCCart /></LayoutWrapper>} />
      <Route path="/start" element={<LayoutWrapper currentPageName="GetStarted"><GetStarted /></LayoutWrapper>} />
      {Object.entries(Pages).map(([path, Page]) => (
        <Route
          key={path}
          path={`/${path}`}
          element={
            <LayoutWrapper currentPageName={path}>
              <Page />
            </LayoutWrapper>
          }
        />
      ))}
      {/* ── ADMIN-ONLY INTERNAL TOOLS (auth-gated) ────────────────────────────── */}
      <Route path="/AdminDashboard" element={<LayoutWrapper currentPageName="AdminDashboard"><AuthGate><AdminDashboard /></AuthGate></LayoutWrapper>} />
      <Route path="/ComplianceDashboard" element={<LayoutWrapper currentPageName="ComplianceDashboard"><AuthGate><ComplianceDashboard /></AuthGate></LayoutWrapper>} />
      <Route path="/PartnershipHub" element={<LayoutWrapper currentPageName="PartnershipHub"><PartnershipHub /></LayoutWrapper>} />
      <Route path="/PaymentsDashboard" element={<LayoutWrapper currentPageName="PaymentsDashboard"><AuthGate><PaymentsDashboard /></AuthGate></LayoutWrapper>} />
      <Route path="/InboxDashboard" element={<LayoutWrapper currentPageName="InboxDashboard"><AuthGate><InboxDashboard /></AuthGate></LayoutWrapper>} />
      <Route path="/MailboxBoard" element={<LayoutWrapper currentPageName="MailboxBoard"><AuthGate><MailboxBoard /></AuthGate></LayoutWrapper>} />
      <Route path="/GrowthDashboard" element={<LayoutWrapper currentPageName="GrowthDashboard"><AuthGate><GrowthDashboard /></AuthGate></LayoutWrapper>} />
      <Route path="/GodModeAds" element={<LayoutWrapper currentPageName="GodModeAds"><AuthGate><GodModeAds /></AuthGate></LayoutWrapper>} />
      <Route path="/AdsManager" element={<LayoutWrapper currentPageName="AdsManager"><AuthGate><AdsManager /></AuthGate></LayoutWrapper>} />
      <Route path="/CampaignStudio" element={<LayoutWrapper currentPageName="CampaignStudio"><AuthGate><CampaignStudio /></AuthGate></LayoutWrapper>} />
      {/* ── TRACKED CAMPAIGN LINK — public, records the click then redirects ── */}
      <Route path="/go/:code" element={<GoLink />} />
      <Route path="/SystemArchitecture" element={<LayoutWrapper currentPageName="SystemArchitecture"><SystemArchitecture /></LayoutWrapper>} />
      <Route path="/ComplianceAuditReport" element={<LayoutWrapper currentPageName="ComplianceAuditReport"><ComplianceAuditReport /></LayoutWrapper>} />
      <Route path="/ProjectManagement" element={<LayoutWrapper currentPageName="ProjectManagement"><ProjectManagement /></LayoutWrapper>} />
      <Route path="/MarketingDashboard" element={<LayoutWrapper currentPageName="MarketingDashboard"><AuthGate><MarketingDashboard /></AuthGate></LayoutWrapper>} />
      <Route path="/SocialMediaDashboard" element={<LayoutWrapper currentPageName="SocialMediaDashboard"><AuthGate><SocialMediaDashboard /></AuthGate></LayoutWrapper>} />
      <Route path="/SocialMediaManagement" element={<LayoutWrapper currentPageName="SocialMediaManagement"><SocialMediaManagement /></LayoutWrapper>} />
      <Route path="/TelephonyDashboard" element={<LayoutWrapper currentPageName="TelephonyDashboard"><AuthGate><TelephonyDashboard /></AuthGate></LayoutWrapper>} />
      <Route path="/MerchantInventoryPage" element={<LayoutWrapper currentPageName="MerchantInventoryPage"><MerchantInventoryPage /></LayoutWrapper>} />
      <Route path="/MerchantDomainPage" element={<LayoutWrapper currentPageName="MerchantDomainPage"><MerchantDomainPage /></LayoutWrapper>} />
      <Route path="/ProviderDashboard" element={<LayoutWrapper currentPageName="ProviderDashboard"><AuthGate><ProviderDashboard /></AuthGate></LayoutWrapper>} />
      <Route path="/ProviderContracts" element={<LayoutWrapper currentPageName="ProviderContracts"><ProviderContracts /></LayoutWrapper>} />
      <Route path="/PharmacyContracts" element={<LayoutWrapper currentPageName="PharmacyContracts"><PharmacyContracts /></LayoutWrapper>} />
      <Route path="/ProviderOutreach" element={<LayoutWrapper currentPageName="ProviderOutreach"><ProviderOutreach /></LayoutWrapper>} />
      <Route path="/PartnerPortal" element={<LayoutWrapper currentPageName="PartnerPortal"><PartnerPortal /></LayoutWrapper>} />
      <Route path="/PartnerCompliance" element={<LayoutWrapper currentPageName="PartnerCompliance"><PartnerCompliance /></LayoutWrapper>} />
      <Route path="/PartnerProgram" element={<LayoutWrapper currentPageName="PartnerProgram"><PartnerProgram /></LayoutWrapper>} />
      <Route path="/PartnerSignup" element={<LayoutWrapper currentPageName="PartnerSignup"><PartnerSignup /></LayoutWrapper>} />
      <Route path="/EmailAudit" element={<LayoutWrapper currentPageName="EmailAudit"><EmailAudit /></LayoutWrapper>} />
      <Route path="/IntegrationsDashboard" element={<LayoutWrapper currentPageName="IntegrationsDashboard"><IntegrationsDashboard /></LayoutWrapper>} />
      <Route path="/MDIntegrationsDashboard" element={<LayoutWrapper currentPageName="MDIntegrationsDashboard"><MDIntegrationsDashboard /></LayoutWrapper>} />
      <Route path="/BelugaIntegration" element={<LayoutWrapper currentPageName="BelugaIntegration"><BelugaIntegration /></LayoutWrapper>} />

      {/* ── PROVIDER FLOWS (internal/staff-facing — kept on domain) ─────────── */}
      <Route path="/Messages" element={<LayoutWrapper currentPageName="Messages"><Messages /></LayoutWrapper>} />
      <Route path="/Consultations" element={<LayoutWrapper currentPageName="Consultations"><Consultations /></LayoutWrapper>} />
      <Route path="/QualiphyConsult" element={<LayoutWrapper currentPageName="QualiphyConsult"><QualiphyConsult /></LayoutWrapper>} />
      <Route path="/AutoRxFollowup" element={<LayoutWrapper currentPageName="AutoRxFollowup"><AutoRxFollowup /></LayoutWrapper>} />
      <Route path="/ProviderProfile" element={<LayoutWrapper currentPageName="ProviderProfile"><ProviderProfile /></LayoutWrapper>} />
      <Route path="/ProviderIntake" element={<LayoutWrapper currentPageName="ProviderIntake"><ProviderIntake /></LayoutWrapper>} />
      <Route path="/ProviderOnboarding" element={<LayoutWrapper currentPageName="ProviderOnboarding"><ProviderOnboarding /></LayoutWrapper>} />
      <Route path="/PharmacyIntake" element={<LayoutWrapper currentPageName="PharmacyIntake"><PharmacyIntake /></LayoutWrapper>} />

      {/* ── MCP OAUTH CONSENT — must stay outside every auth guard & layout ── */}
      <Route path="/oauth/consent" element={<OAuthConsent />} />

      {/* ── PERSONALIZED DEMO (no layout — standalone branded page) ────────── */}
      <Route path="/PersonalizedDemo" element={<PersonalizedDemo />} />

      {/* ── SEO LANDING PAGES ─────────────────────────────────────────────── */}
      <Route path="/for-med-spas" element={<LayoutWrapper currentPageName="ForMedSpas"><ForMedSpas /></LayoutWrapper>} />
      <Route path="/trt-clinic-platform" element={<LayoutWrapper currentPageName="TRTClinicPlatform"><TRTClinicPlatform /></LayoutWrapper>} />
      <Route path="/weight-loss-clinic-platform" element={<LayoutWrapper currentPageName="WeightLossClinicPlatform"><WeightLossClinicPlatform /></LayoutWrapper>} />
      <Route path="/openloop-alternative" element={<LayoutWrapper currentPageName="OpenLoopAlternative"><OpenLoopAlternative /></LayoutWrapper>} />
      <Route path="/mytelemedicine-alternative" element={<LayoutWrapper currentPageName="MyTelemedicineAlternative"><MyTelemedicineAlternative /></LayoutWrapper>} />
      <Route path="/telehealth-franchise" element={<LayoutWrapper currentPageName="TelehealthFranchise"><TelehealthFranchise /></LayoutWrapper>} />
      <Route path="/iv-therapy-clinic-platform" element={<LayoutWrapper currentPageName="IVTherapyClinicPlatform"><IVTherapyClinicPlatform /></LayoutWrapper>} />

      {/* ── PATIENT-FACING ROUTES — rendered in-app, never redirected off-site ── */}
      <Route path="/PatientPortal" element={<LayoutWrapper currentPageName="PatientPortal"><PatientPortal /></LayoutWrapper>} />
      <Route path="/PatientOnboarding" element={<LayoutWrapper currentPageName="PatientOnboarding"><PatientOnboarding /></LayoutWrapper>} />
      <Route path="/CustomerIntake" element={<LayoutWrapper currentPageName="CustomerIntake"><CustomerIntake /></LayoutWrapper>} />
      <Route path="/BookAppointment" element={<LayoutWrapper currentPageName="BookAppointment"><BookAppointment /></LayoutWrapper>} />
      <Route path="/MyAppointments" element={<LayoutWrapper currentPageName="MyAppointments"><MyAppointments /></LayoutWrapper>} />
      <Route path="/VisitTypeSelector" element={<LayoutWrapper currentPageName="VisitTypeSelector"><VisitTypeSelector /></LayoutWrapper>} />
      <Route path="/WaitingRoom" element={<LayoutWrapper currentPageName="WaitingRoom"><WaitingRoom /></LayoutWrapper>} />
      <Route path="/VideoCall" element={<LayoutWrapper currentPageName="VideoCall"><VideoCall /></LayoutWrapper>} />
      <Route path="/Questionnaire" element={<LayoutWrapper currentPageName="Questionnaire"><Questionnaire /></LayoutWrapper>} />
      <Route path="/PhoneIntake" element={<LayoutWrapper currentPageName="PhoneIntake"><PhoneIntake /></LayoutWrapper>} />

      {/* ── CART + FLEXIBLE CHECKOUT ──────────────────────────────────────── */}
      <Route path="/Cart" element={<LayoutWrapper currentPageName="Cart"><Cart /></LayoutWrapper>} />
      <Route path="/Checkout" element={<LayoutWrapper currentPageName="Cart"><Cart /></LayoutWrapper>} />

      {/* ── MERCHANT ONBOARDING INTAKE + DOCUMENT E-SIGNATURE ─────────────── */}
      <Route path="/MerchantOnboardingIntake" element={<LayoutWrapper currentPageName="MerchantOnboardingIntake"><MerchantOnboardingIntake /></LayoutWrapper>} />
      <Route path="/MerchantDocuments" element={<LayoutWrapper currentPageName="MerchantDocuments"><MerchantDocuments /></LayoutWrapper>} />
      {/* ── B2B FOR BUSINESS — explicit route, never left to the stale pagesConfig loop ── */}
      <Route path="/ForBusiness" element={<LayoutWrapper currentPageName="ForBusiness"><ForBusiness /></LayoutWrapper>} />
      <Route path="/faq" element={<LayoutWrapper currentPageName="OperatorFAQ"><OperatorFAQ /></LayoutWrapper>} />
      <Route path="/patient-faq" element={<LayoutWrapper currentPageName="PatientFAQ"><PatientFAQ /></LayoutWrapper>} />
      <Route path="/Blog" element={<LayoutWrapper currentPageName="Blog"><Blog /></LayoutWrapper>} />
      <Route path="/white-label-telehealth-platform" element={<LayoutWrapper currentPageName="WhiteLabelTelehealthPlatform"><WhiteLabelTelehealthPlatform /></LayoutWrapper>} />
      <Route path="/unified-crm" element={<LayoutWrapper currentPageName="UnifiedCRM"><UnifiedCRM /></LayoutWrapper>} />
      <Route path="/payment-processing" element={<LayoutWrapper currentPageName="PaymentProcessing"><PaymentProcessing /></LayoutWrapper>} />
      <Route path="/for-creators" element={<LayoutWrapper currentPageName="ForCreatorsLP"><ForCreatorsLP /></LayoutWrapper>} />
      <Route path="/for-entrepreneurs" element={<LayoutWrapper currentPageName="ForEntrepreneurs"><ForEntrepreneurs /></LayoutWrapper>} />
      <Route path="/telehealth-services-for-medspa" element={<LayoutWrapper currentPageName="TelehealthServicesForMedSpa"><TelehealthServicesForMedSpa /></LayoutWrapper>} />
      <Route path="/Partnerships" element={<LayoutWrapper currentPageName="Partnerships"><Partnerships /></LayoutWrapper>} />
      <Route path="/OrderSuccess" element={<PageNotFound />} />
      <Route path="/ProductDetail" element={<PageNotFound />} />
      <Route path="/ProductsAndServices" element={<PageNotFound />} />
      <Route path="/Programs" element={<PageNotFound />} />
      <Route path="/WaterHome" element={<PageNotFound />} />
      <Route path="/ResearchProducts" element={<PageNotFound />} />

      {/* ── CATCH-ALL — removed/consumer pages → 404 ──────────────────────── */}
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};


function App() {

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <SiteProvider>
            <NavigationTracker />
            <AuthenticatedApp />
          </SiteProvider>
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App