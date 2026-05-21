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
    } else if (authError.type === 'auth_required') {
      // Redirect to login automatically
      navigateToLogin();
      return null;
    }
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