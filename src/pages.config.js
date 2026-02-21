/**
 * pages.config.js - Page routing configuration
 * 
 * This file is AUTO-GENERATED. Do not add imports or modify PAGES manually.
 * Pages are auto-registered when you create files in the ./pages/ folder.
 * 
 * THE ONLY EDITABLE VALUE: mainPage
 * This controls which page is the landing page (shown when users visit the app).
 * 
 * Example file structure:
 * 
 *   import HomePage from './pages/HomePage';
 *   import Dashboard from './pages/Dashboard';
 *   import Settings from './pages/Settings';
 *   
 *   export const PAGES = {
 *       "HomePage": HomePage,
 *       "Dashboard": Dashboard,
 *       "Settings": Settings,
 *   }
 *   
 *   export const pagesConfig = {
 *       mainPage: "HomePage",
 *       Pages: PAGES,
 *   };
 * 
 * Example with Layout (wraps all pages):
 *
 *   import Home from './pages/Home';
 *   import Settings from './pages/Settings';
 *   import __Layout from './Layout.jsx';
 *
 *   export const PAGES = {
 *       "Home": Home,
 *       "Settings": Settings,
 *   }
 *
 *   export const pagesConfig = {
 *       mainPage: "Home",
 *       Pages: PAGES,
 *       Layout: __Layout,
 *   };
 *
 * To change the main page from HomePage to Dashboard, use find_replace:
 *   Old: mainPage: "HomePage",
 *   New: mainPage: "Dashboard",
 *
 * The mainPage value must match a key in the PAGES object exactly.
 */
import AdminDashboard from './pages/AdminDashboard';
import AutoRxFollowup from './pages/AutoRxFollowup';
import BelugaIntegration from './pages/BelugaIntegration';
import BookAppointment from './pages/BookAppointment';
import BusinessInquiry from './pages/BusinessInquiry';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import ComplianceDashboard from './pages/ComplianceDashboard';
import Consultations from './pages/Consultations';
import Contact from './pages/Contact';
import CreatorApplication from './pages/CreatorApplication';
import CustomerIntake from './pages/CustomerIntake';
import EmailAudit from './pages/EmailAudit';
import ForBusiness from './pages/ForBusiness';
import ForCreators from './pages/ForCreators';
import Home from './pages/Home';
import HowItWorks from './pages/HowItWorks';
import IntegrationsDashboard from './pages/IntegrationsDashboard';
import Messages from './pages/Messages';
import MyAppointments from './pages/MyAppointments';
import OrderSuccess from './pages/OrderSuccess';
import PartnerCompliance from './pages/PartnerCompliance';
import PartnerPortal from './pages/PartnerPortal';
import PartnerProgram from './pages/PartnerProgram';
import PartnerSignup from './pages/PartnerSignup';
import PartnershipHub from './pages/PartnershipHub';
import PatientOnboarding from './pages/PatientOnboarding';
import PatientPortal from './pages/PatientPortal';
import PaymentsDashboard from './pages/PaymentsDashboard';
import PharmacyContracts from './pages/PharmacyContracts';
import PharmacyIntake from './pages/PharmacyIntake';
import Privacy from './pages/Privacy';
import ProductDetail from './pages/ProductDetail';
import Products from './pages/Products';
import ProviderContracts from './pages/ProviderContracts';
import ProviderDashboard from './pages/ProviderDashboard';
import ProviderIntake from './pages/ProviderIntake';
import ProviderOutreach from './pages/ProviderOutreach';
import ProviderProfile from './pages/ProviderProfile';
import Questionnaire from './pages/Questionnaire';
import Terms from './pages/Terms';
import VideoCall from './pages/VideoCall';
import VisitTypeSelector from './pages/VisitTypeSelector';
import WaitingRoom from './pages/WaitingRoom';
import Programs from './pages/Programs';
import __Layout from './Layout.jsx';


export const PAGES = {
    "AdminDashboard": AdminDashboard,
    "AutoRxFollowup": AutoRxFollowup,
    "BelugaIntegration": BelugaIntegration,
    "BookAppointment": BookAppointment,
    "BusinessInquiry": BusinessInquiry,
    "Cart": Cart,
    "Checkout": Checkout,
    "ComplianceDashboard": ComplianceDashboard,
    "Consultations": Consultations,
    "Contact": Contact,
    "CreatorApplication": CreatorApplication,
    "CustomerIntake": CustomerIntake,
    "EmailAudit": EmailAudit,
    "ForBusiness": ForBusiness,
    "ForCreators": ForCreators,
    "Home": Home,
    "HowItWorks": HowItWorks,
    "IntegrationsDashboard": IntegrationsDashboard,
    "Messages": Messages,
    "MyAppointments": MyAppointments,
    "OrderSuccess": OrderSuccess,
    "PartnerCompliance": PartnerCompliance,
    "PartnerPortal": PartnerPortal,
    "PartnerProgram": PartnerProgram,
    "PartnerSignup": PartnerSignup,
    "PartnershipHub": PartnershipHub,
    "PatientOnboarding": PatientOnboarding,
    "PatientPortal": PatientPortal,
    "PaymentsDashboard": PaymentsDashboard,
    "PharmacyContracts": PharmacyContracts,
    "PharmacyIntake": PharmacyIntake,
    "Privacy": Privacy,
    "ProductDetail": ProductDetail,
    "Products": Products,
    "ProviderContracts": ProviderContracts,
    "ProviderDashboard": ProviderDashboard,
    "ProviderIntake": ProviderIntake,
    "ProviderOutreach": ProviderOutreach,
    "ProviderProfile": ProviderProfile,
    "Questionnaire": Questionnaire,
    "Terms": Terms,
    "VideoCall": VideoCall,
    "VisitTypeSelector": VisitTypeSelector,
    "WaitingRoom": WaitingRoom,
    "Programs": Programs,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};