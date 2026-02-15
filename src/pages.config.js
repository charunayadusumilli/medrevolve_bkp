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
import BookAppointment from './pages/BookAppointment';
import BusinessInquiry from './pages/BusinessInquiry';
import Consultations from './pages/Consultations';
import Contact from './pages/Contact';
import CreatorApplication from './pages/CreatorApplication';
import CustomerIntake from './pages/CustomerIntake';
import EmailAudit from './pages/EmailAudit';
import ForBusiness from './pages/ForBusiness';
import ForCreators from './pages/ForCreators';
import Home from './pages/Home';
import HowItWorks from './pages/HowItWorks';
import Messages from './pages/Messages';
import MyAppointments from './pages/MyAppointments';
import PatientPortal from './pages/PatientPortal';
import PharmacyIntake from './pages/PharmacyIntake';
import ProductDetail from './pages/ProductDetail';
import Products from './pages/Products';
import ProviderDashboard from './pages/ProviderDashboard';
import ProviderIntake from './pages/ProviderIntake';
import ProviderProfile from './pages/ProviderProfile';
import Questionnaire from './pages/Questionnaire';
import VideoCall from './pages/VideoCall';
import __Layout from './Layout.jsx';


export const PAGES = {
    "BookAppointment": BookAppointment,
    "BusinessInquiry": BusinessInquiry,
    "Consultations": Consultations,
    "Contact": Contact,
    "CreatorApplication": CreatorApplication,
    "CustomerIntake": CustomerIntake,
    "EmailAudit": EmailAudit,
    "ForBusiness": ForBusiness,
    "ForCreators": ForCreators,
    "Home": Home,
    "HowItWorks": HowItWorks,
    "Messages": Messages,
    "MyAppointments": MyAppointments,
    "PatientPortal": PatientPortal,
    "PharmacyIntake": PharmacyIntake,
    "ProductDetail": ProductDetail,
    "Products": Products,
    "ProviderDashboard": ProviderDashboard,
    "ProviderIntake": ProviderIntake,
    "ProviderProfile": ProviderProfile,
    "Questionnaire": Questionnaire,
    "VideoCall": VideoCall,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};