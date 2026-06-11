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
import GrowthDashboard from './pages/GrowthDashboard';
import GodModeAds from './pages/GodModeAds';
import AdsManager from './pages/AdsManager';
import ExternalRedirect from './lib/ExternalRedirect';
import { base44 } from '@/api/base44Client';
import SystemArchitecture from './pages/SystemArchitecture';
import ComplianceAuditReport from './pages/ComplianceAuditReport';
import ProjectManagement from './pages/ProjectManagement';
import MarketingDashboard from './pages/MarketingDashboard';
import SocialMediaDashboard from './pages/SocialMediaDashboard';
import SocialMediaManagement from './pages/SocialMediaManagement';
import TelephonyDashboard from './pages/TelephonyDashboard';
import PhoneIntake from './pages/PhoneIntake';
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
      <Route path="/" element={
        <LayoutWrapper currentPageName={mainPageKey}>
          <MainPage />
        </LayoutWrapper>
      } />
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
      <Route path="/GrowthDashboard" element={<LayoutWrapper currentPageName="GrowthDashboard"><AuthGate><GrowthDashboard /></AuthGate></LayoutWrapper>} />
      <Route path="/GodModeAds" element={<LayoutWrapper currentPageName="GodModeAds"><AuthGate><GodModeAds /></AuthGate></LayoutWrapper>} />
      <Route path="/AdsManager" element={<LayoutWrapper currentPageName="AdsManager"><AuthGate><AdsManager /></AuthGate></LayoutWrapper>} />
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

      {/* ── PATIENT-FACING → external subdomain redirects (301-equivalent) ── */}
      <Route path="/PatientPortal" element={<ExternalRedirect to="https://app.medrevolve.com/portal" />} />
      <Route path="/PatientOnboarding" element={<ExternalRedirect to="https://app.medrevolve.com/onboarding" />} />
      <Route path="/CustomerIntake" element={<ExternalRedirect to="https://app.medrevolve.com/intake" />} />
      <Route path="/BookAppointment" element={<ExternalRedirect to="https://app.medrevolve.com/book" />} />
      <Route path="/MyAppointments" element={<ExternalRedirect to="https://app.medrevolve.com/my-appointments" />} />
      <Route path="/VisitTypeSelector" element={<ExternalRedirect to="https://app.medrevolve.com/visit-type" />} />
      <Route path="/WaitingRoom" element={<ExternalRedirect to="https://app.medrevolve.com/waiting-room" />} />
      <Route path="/VideoCall" element={<ExternalRedirect to="https://app.medrevolve.com/video-call" />} />
      <Route path="/Questionnaire" element={<ExternalRedirect to="https://app.medrevolve.com/questionnaire" />} />
      <Route path="/TelehealthConsent" element={<ExternalRedirect to="https://app.medrevolve.com/consent" />} />
      <Route path="/PhoneIntake" element={<ExternalRedirect to="https://app.medrevolve.com/phone-intake" />} />

      {/* ── B2C COMMERCE PAGES — return 404 ──────────────────────────────── */}
      <Route path="/Cart" element={<PageNotFound />} />
      <Route path="/Checkout" element={<PageNotFound />} />
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
          <NavigationTracker />
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App