import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import NavigationTracker from '@/lib/NavigationTracker'
import { pagesConfig } from './pages.config'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import InboxDashboard from './pages/InboxDashboard';
import Platform from './pages/Platform';
import BrandingAssets from './pages/BrandingAssets';
import CompetitorIntelligence from './pages/CompetitorIntelligence';
import QualiphyIntegration from './pages/QualiphyIntegration';
import EmailSignature from './pages/EmailSignature';
import TelephonyDashboard from './pages/TelephonyDashboard';
import PhoneIntake from './pages/PhoneIntake';
import SocialMediaDashboard from './pages/SocialMediaDashboard';
import GodModeAds from './pages/GodModeAds';
import GrowthDashboard from './pages/GrowthDashboard';
import HIPAANotice from './pages/HIPAANotice';
import TelehealthConsent from './pages/TelehealthConsent';
import MedicalDisclaimer from './pages/MedicalDisclaimer';
import CookiePolicy from './pages/CookiePolicy';
import SystemArchitecture from './pages/SystemArchitecture';
import WaterHome from './pages/WaterHome';
import ProjectManagement from './pages/ProjectManagement';
import MarketingDashboard from './pages/MarketingDashboard';
import SocialMediaManagement from './pages/SocialMediaManagement';
import AppointmentsSyncPage from './pages/AppointmentsSync';
import ProductsAndServices from './pages/ProductsAndServices';
import ComplianceAuditReport from './pages/ComplianceAuditReport';

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
      <Route path="/InboxDashboard" element={<LayoutWrapper currentPageName="InboxDashboard"><InboxDashboard /></LayoutWrapper>} />
      <Route path="/Platform" element={<LayoutWrapper currentPageName="Platform"><Platform /></LayoutWrapper>} />
      <Route path="/BrandingAssets" element={<LayoutWrapper currentPageName="BrandingAssets"><BrandingAssets /></LayoutWrapper>} />
      <Route path="/CompetitorIntelligence" element={<LayoutWrapper currentPageName="CompetitorIntelligence"><CompetitorIntelligence /></LayoutWrapper>} />
      <Route path="/QualiphyIntegration" element={<LayoutWrapper currentPageName="QualiphyIntegration"><QualiphyIntegration /></LayoutWrapper>} />
      <Route path="/EmailSignature" element={<LayoutWrapper currentPageName="EmailSignature"><EmailSignature /></LayoutWrapper>} />
      <Route path="/TelephonyDashboard" element={<LayoutWrapper currentPageName="TelephonyDashboard"><TelephonyDashboard /></LayoutWrapper>} />
      <Route path="/PhoneIntake" element={<LayoutWrapper currentPageName="PhoneIntake"><PhoneIntake /></LayoutWrapper>} />
      <Route path="/SocialMediaDashboard" element={<LayoutWrapper currentPageName="SocialMediaDashboard"><SocialMediaDashboard /></LayoutWrapper>} />
      <Route path="/GodModeAds" element={<LayoutWrapper currentPageName="GodModeAds"><GodModeAds /></LayoutWrapper>} />
      <Route path="/GrowthDashboard" element={<LayoutWrapper currentPageName="GrowthDashboard"><GrowthDashboard /></LayoutWrapper>} />
      <Route path="/HIPAANotice" element={<LayoutWrapper currentPageName="HIPAANotice"><HIPAANotice /></LayoutWrapper>} />
      <Route path="/TelehealthConsent" element={<LayoutWrapper currentPageName="TelehealthConsent"><TelehealthConsent /></LayoutWrapper>} />
      <Route path="/MedicalDisclaimer" element={<LayoutWrapper currentPageName="MedicalDisclaimer"><MedicalDisclaimer /></LayoutWrapper>} />
      <Route path="/CookiePolicy" element={<LayoutWrapper currentPageName="CookiePolicy"><CookiePolicy /></LayoutWrapper>} />
      <Route path="/SystemArchitecture" element={<LayoutWrapper currentPageName="SystemArchitecture"><SystemArchitecture /></LayoutWrapper>} />
      <Route path="/WaterHome" element={<LayoutWrapper currentPageName="WaterHome"><WaterHome /></LayoutWrapper>} />
      <Route path="/ProjectManagement" element={<LayoutWrapper currentPageName="ProjectManagement"><ProjectManagement /></LayoutWrapper>} />
      <Route path="/MarketingDashboard" element={<LayoutWrapper currentPageName="MarketingDashboard"><MarketingDashboard /></LayoutWrapper>} />
      <Route path="/SocialMediaManagement" element={<LayoutWrapper currentPageName="SocialMediaManagement"><SocialMediaManagement /></LayoutWrapper>} />
      <Route path="/AppointmentsSync" element={<LayoutWrapper currentPageName="AppointmentsSync"><AppointmentsSyncPage /></LayoutWrapper>} />
      <Route path="/ProductsAndServices" element={<LayoutWrapper currentPageName="ProductsAndServices"><ProductsAndServices /></LayoutWrapper>} />
      <Route path="/ComplianceAuditReport" element={<LayoutWrapper currentPageName="ComplianceAuditReport"><ComplianceAuditReport /></LayoutWrapper>} />
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