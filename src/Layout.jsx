import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  Menu, ChevronDown, Phone,
  Instagram, Twitter, Facebook, Youtube,
  User, LogOut, Settings, LayoutDashboard } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import AnalyticsTracker from '@/components/analytics/AnalyticsTracker';
import AIAssistant from '@/components/chat/AIAssistant';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from
"@/components/ui/dropdown-menu";

export default function Layout({ children }) {
  useEffect(() => {
    // ── Cookiebot consent ──────────────────────────────────
    if (!document.getElementById('Cookiebot')) {
      const script = document.createElement('script');
      script.id = 'Cookiebot';
      script.src = 'https://consent.cookiebot.com/uc.js';
      script.setAttribute('data-cbid', 'f872245e-106f-4258-bb1a-084567404e79');
      script.type = 'text/javascript';
      script.async = true;
      document.head.insertBefore(script, document.head.firstChild);
    }

    // ── Google Analytics (gtag) ───────────────────────────
    if (!document.getElementById('gtag-script')) {
      const gtagScript = document.createElement('script');
      gtagScript.id = 'gtag-script';
      gtagScript.src = 'https://www.googletagmanager.com/gtag/js?id=G-BZTEFSTDPL';
      gtagScript.async = true;
      document.head.appendChild(gtagScript);

      window.dataLayer = window.dataLayer || [];
      function gtag() {window.dataLayer.push(arguments);}
      window.gtag = gtag;
      gtag('js', new Date());
      gtag('config', 'G-BZTEFSTDPL');
    }

    // ── Preconnect hints for fast image/video load ────────
    ['https://images.unsplash.com', 'https://videos.pexels.com'].forEach((href) => {
      if (!document.querySelector(`link[href="${href}"]`)) {
        const l = document.createElement('link');
        l.rel = 'preconnect';
        l.href = href;
        l.crossOrigin = '';
        document.head.appendChild(l);
      }
    });
  }, []);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const checkUser = async () => {
      try {
        const isAuth = await base44.auth.isAuthenticated();
        if (!isAuth) {if (!cancelled) setUser(null);return;}
        const currentUser = await base44.auth.me();
        if (!cancelled) setUser(currentUser);
      } catch {
        if (!cancelled) setUser(null);
      }
    };
    checkUser();
    return () => {cancelled = true;};
  }, [location.pathname]);

  // Scroll to top & close menus on nav click
  const handleNavClick = (callback) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setMobileMenuOpen(false);
    if (callback) callback();
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7]" style={{ scrollBehavior: 'smooth' }}>
      <AnalyticsTracker />
      <AIAssistant />

      {/* Header */}
      <motion.header
        className={`sticky top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-[#0A0A0A]/95 backdrop-blur-lg border-b border-white/10' : 'bg-[#0A0A0A]'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.4 }}>

        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to={createPageUrl('Home')} className="flex items-center gap-2.5 flex-shrink-0">
              <div className="w-8 h-8 bg-white flex items-center justify-center rounded-sm">
                <span className="text-black font-black text-[11px] tracking-tight">MR</span>
              </div>
              <span className="text-base font-bold text-white tracking-tight">MedRevolve</span>
            </Link>

            {/* Desktop Nav — simple 4 links */}
            <nav className="hidden lg:flex items-center gap-8">
              <Link to="/Platform" onClick={() => handleNavClick()} className="text-sm text-white/60 hover:text-white transition-colors">
                Platform
              </Link>
              <a href="tel:+17044263311" className="text-sm text-[#4A6741] hover:text-[#6B8F5E] transition-colors flex items-center gap-1">
                <Phone className="w-3 h-3" />
                (704) 426-3311
              </a>

              {/* Admin only */}
              {user?.role === 'admin' &&
              <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-1 text-sm text-[#6B8F5E] hover:text-[#8FB88F] transition-colors">
                      Admin <ChevronDown className="w-3 h-3" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-[#111] border border-white/10 rounded-xl shadow-2xl p-2 min-w-[220px]">
                    <DropdownMenuItem asChild><Link to={createPageUrl('AdminDashboard')} className="cursor-pointer rounded-lg px-3 py-2 text-white/70 hover:text-white hover:bg-white/5 text-sm">Overview</Link></DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-white/10" />
                    <DropdownMenuItem asChild><Link to={createPageUrl('MerchantOnboarding')} className="cursor-pointer rounded-lg px-3 py-2 text-white/70 hover:text-white hover:bg-white/5 text-sm">🚀 Merchant Onboarding</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link to={createPageUrl('MerchantDashboard')} className="cursor-pointer rounded-lg px-3 py-2 text-white/70 hover:text-white hover:bg-white/5 text-sm">📊 Merchant Dashboard</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link to={createPageUrl('MerchantInventoryPage')} className="cursor-pointer rounded-lg px-3 py-2 text-white/70 hover:text-white hover:bg-white/5 text-sm">📦 Inventory</Link></DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-white/10" />
                    <DropdownMenuItem asChild><Link to={createPageUrl('ComplianceDashboard')} className="cursor-pointer rounded-lg px-3 py-2 text-white/70 hover:text-white hover:bg-white/5 text-sm">Compliance</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link to={createPageUrl('PartnershipHub')} className="cursor-pointer rounded-lg px-3 py-2 text-white/70 hover:text-white hover:bg-white/5 text-sm">Partnerships</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link to={createPageUrl('PaymentsDashboard')} className="cursor-pointer rounded-lg px-3 py-2 text-white/70 hover:text-white hover:bg-white/5 text-sm">Payments</Link></DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-white/10" />
                    <DropdownMenuItem asChild><Link to={createPageUrl('PartnerProgram')} className="cursor-pointer rounded-lg px-3 py-2 text-white/70 hover:text-white hover:bg-white/5 text-sm">Partner Program</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link to={createPageUrl('ForCreators')} className="cursor-pointer rounded-lg px-3 py-2 text-white/70 hover:text-white hover:bg-white/5 text-sm">Creator Program</Link></DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-white/10" />
                    <DropdownMenuItem asChild><Link to="/InboxDashboard" className="cursor-pointer rounded-lg px-3 py-2 text-white/70 hover:text-white hover:bg-white/5 text-sm">📥 Inbox</Link></DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-white/10" />
                    <DropdownMenuItem asChild><Link to="/SocialMediaDashboard" className="cursor-pointer rounded-lg px-3 py-2 text-white/70 hover:text-white hover:bg-white/5 text-sm">📱 Social Media</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link to="/GodModeAds" className="cursor-pointer rounded-lg px-3 py-2 text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/10 text-sm font-bold">⚡ God Mode Ads</Link></DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-white/10" />
                    <DropdownMenuItem asChild><Link to="/GrowthDashboard" className="cursor-pointer rounded-lg px-3 py-2 text-green-400 hover:text-green-300 hover:bg-green-500/10 text-sm font-bold">📈 Growth & Analytics</Link></DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-white/10" />
                    <DropdownMenuItem asChild><Link to="/SystemArchitecture" className="cursor-pointer rounded-lg px-3 py-2 text-white/90 hover:text-white hover:bg-white/5 text-sm font-bold border border-white/10">⚙️ System Architecture</Link></DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              }
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              {user ?
              <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="hidden sm:flex items-center gap-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full px-3" aria-label="Account">
                      <div className="w-7 h-7 rounded-full bg-[#4A6741] flex items-center justify-center text-white text-xs font-bold">
                        {(user.display_name || user.full_name)?.[0] || user.email?.[0] || 'U'}
                      </div>
                      <ChevronDown className="w-3.5 h-3.5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-[#111] border border-white/10 rounded-xl shadow-2xl p-2 min-w-[200px]" align="end">
                    <div className="px-3 py-2 mb-1">
                      <p className="text-white text-sm font-semibold">{user.display_name || user.full_name}</p>
                      <p className="text-xs text-white/40 truncate">{user.email}</p>
                    </div>
                    <DropdownMenuSeparator className="bg-white/10" />
                    <DropdownMenuItem asChild>
                      <Link to={createPageUrl('PatientPortal')} className="cursor-pointer rounded-lg px-3 py-2 text-white/70 hover:text-white hover:bg-white/5 text-sm flex items-center gap-2">
                        <LayoutDashboard className="w-4 h-4" /><span>My Portal</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to={createPageUrl('AccountSettings')} className="cursor-pointer rounded-lg px-3 py-2 text-white/70 hover:text-white hover:bg-white/5 text-sm flex items-center gap-2">
                        <User className="w-4 h-4" /><span>Settings</span>
                      </Link>
                    </DropdownMenuItem>
                    {user.role === 'admin' &&
                      <DropdownMenuItem asChild>
                        <Link to={createPageUrl('AdminDashboard')} className="cursor-pointer rounded-lg px-3 py-2 text-white/70 hover:text-white hover:bg-white/5 text-sm flex items-center gap-2">
                          <Settings className="w-4 h-4" /><span>Admin</span>
                        </Link>
                      </DropdownMenuItem>
                    }
                    <DropdownMenuSeparator className="bg-white/10" />
                    <DropdownMenuItem
                      className="cursor-pointer rounded-lg px-3 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 text-sm flex items-center gap-2"
                      onClick={() => base44.auth.logout('/')}>
                      <LogOut className="w-4 h-4" /><span>Sign Out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              :
              <Button variant="ghost"
                className="hidden sm:flex text-sm font-medium text-white/60 hover:text-white hover:bg-white/10 rounded-full items-center gap-1.5"
                onClick={() => base44.auth.redirectToLogin(window.location.href)}>
                <User className="w-4 h-4" /> Sign In
              </Button>
              }

              <Link to={createPageUrl('MerchantOnboarding')} className="hidden sm:block">
                <Button className="bg-white text-black hover:bg-white/90 rounded-sm px-5 text-sm font-bold tracking-wide">
                  Get Started
                </Button>
              </Link>

              {/* Mobile Menu */}
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild className="lg:hidden">
                  <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                    <Menu className="w-5 h-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-full max-w-sm bg-[#0A0A0A] border-l border-white/10 p-0">
                  <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between p-5 border-b border-white/10">
                      <Link to={createPageUrl('Home')} className="flex items-center gap-2.5" onClick={() => setMobileMenuOpen(false)}>
                        <div className="w-7 h-7 bg-white flex items-center justify-center rounded-sm">
                          <span className="text-black font-black text-[10px]">MR</span>
                        </div>
                        <span className="text-base font-bold text-white">MedRevolve</span>
                      </Link>
                    </div>

                    <nav className="flex-1 overflow-y-auto p-5 space-y-1">
                      <Link to="/Platform" className="block py-3 px-3 rounded-lg text-sm font-medium text-white/70 hover:text-white hover:bg-white/5" onClick={() => {setMobileMenuOpen(false);window.scrollTo({top:0});}}>Platform</Link>

                      {user && (
                        <div className="pt-4 border-t border-white/10 mt-2">
                          <p className="text-xs font-bold uppercase tracking-widest text-white/25 mb-2 px-3">My Account</p>
                          <Link to={createPageUrl('PatientPortal')} className="block py-3 px-3 rounded-lg text-sm text-white/70 hover:text-white hover:bg-white/5" onClick={() => {setMobileMenuOpen(false);window.scrollTo({top:0});}}>My Portal</Link>
                          {user.role === 'admin' && <Link to={createPageUrl('AdminDashboard')} className="block py-3 px-3 rounded-lg text-sm text-white/70 hover:text-white hover:bg-white/5" onClick={() => {setMobileMenuOpen(false);window.scrollTo({top:0});}}>Admin Dashboard</Link>}
                        </div>
                      )}
                    </nav>

                    <div className="p-5 border-t border-white/10 space-y-2">
                      {user ?
                        <Button variant="outline" className="w-full rounded-sm border-red-500/40 text-red-400 hover:bg-red-500/10"
                          onClick={() => {base44.auth.logout('/');setMobileMenuOpen(false);}}>
                          Sign Out
                        </Button>
                      :
                        <>
                          <Button variant="outline" className="w-full rounded-sm border-white/20 text-white hover:bg-white/10"
                            onClick={() => {base44.auth.redirectToLogin(window.location.href);setMobileMenuOpen(false);}}>
                            Sign In
                          </Button>
                          <Link to={createPageUrl('MerchantOnboarding')} onClick={() => setMobileMenuOpen(false)}>
                            <Button className="w-full bg-white text-black hover:bg-white/90 rounded-sm font-bold">
                              Get Started
                            </Button>
                          </Link>
                        </>
                      }
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main>
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-[#060606] border-t border-white/8 text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-16 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Brand */}
            <div className="lg:col-span-1">
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-7 h-7 bg-white flex items-center justify-center rounded-sm">
                  <span className="text-black font-black text-[10px]">MR</span>
                </div>
                <span className="text-base font-bold text-white">MedRevolve</span>
              </div>
              <p className="text-white/35 text-sm leading-relaxed mb-6 max-w-xs">
                The complete platform to launch a compliant telehealth, GLP-1, or RUO business — website, marketing, compliance, and university support under your brand.
              </p>
              <div className="flex gap-3">
                <a href="#" className="w-8 h-8 border border-white/10 flex items-center justify-center hover:border-white/30 transition-colors rounded-sm"><Instagram className="w-3.5 h-3.5 text-white/50" /></a>
                <a href="#" className="w-8 h-8 border border-white/10 flex items-center justify-center hover:border-white/30 transition-colors rounded-sm"><Twitter className="w-3.5 h-3.5 text-white/50" /></a>
                <a href="#" className="w-8 h-8 border border-white/10 flex items-center justify-center hover:border-white/30 transition-colors rounded-sm"><Youtube className="w-3.5 h-3.5 text-white/50" /></a>
              </div>
            </div>

            {/* Platform */}
            <div>
              <h4 className="font-semibold mb-5 text-xs uppercase tracking-widest text-white/25">Platform</h4>
              <ul className="space-y-3">
                <li><Link to={createPageUrl('TelehealthPlatform')} className="text-white/45 hover:text-white text-sm transition-colors">Telehealth</Link></li>
                <li><Link to={createPageUrl('ForBusiness')} className="text-white/45 hover:text-white text-sm transition-colors">For Business</Link></li>
                <li><Link to={createPageUrl('MerchantOnboarding')} className="text-white/45 hover:text-white text-sm transition-colors">Get Started</Link></li>
                <li><Link to={createPageUrl('BookAppointment')} className="text-white/45 hover:text-white text-sm transition-colors">Book a Consultation</Link></li>
                <li><Link to={createPageUrl('HowItWorks')} className="text-white/45 hover:text-white text-sm transition-colors">How It Works</Link></li>
              </ul>
            </div>

            {/* Partners */}
            <div>
              <h4 className="font-semibold mb-5 text-xs uppercase tracking-widest text-white/25">Partners</h4>
              <ul className="space-y-3">
                <li><Link to={createPageUrl('ForBusiness')} className="text-white/45 hover:text-white text-sm transition-colors">For Business</Link></li>
                <li><Link to={createPageUrl('PartnerProgram')} className="text-white/45 hover:text-white text-sm transition-colors">Partner Program</Link></li>
                <li><Link to={createPageUrl('ForCreators')} className="text-white/45 hover:text-white text-sm transition-colors">Creator Program</Link></li>
                <li><Link to={createPageUrl('ProviderIntake')} className="text-white/45 hover:text-white text-sm transition-colors">Join as Provider</Link></li>
                <li><Link to={createPageUrl('PharmacyIntake')} className="text-white/45 hover:text-white text-sm transition-colors">Join as Pharmacy</Link></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="font-semibold mb-5 text-xs uppercase tracking-widest text-white/25">Company</h4>
              <ul className="space-y-3">
                <li><Link to={createPageUrl('HowItWorks')} className="text-white/45 hover:text-white text-sm transition-colors">How It Works</Link></li>
                <li><Link to={createPageUrl('Contact')} className="text-white/45 hover:text-white text-sm transition-colors">Contact</Link></li>
                <li><Link to={createPageUrl('Privacy')} className="text-white/45 hover:text-white text-sm transition-colors">Privacy Policy</Link></li>
                <li><Link to={createPageUrl('Terms')} className="text-white/45 hover:text-white text-sm transition-colors">Terms of Service</Link></li>
                <li><Link to="/HIPAANotice" className="text-white/45 hover:text-white text-sm transition-colors">HIPAA Notice of Privacy Practices</Link></li>
                <li><Link to="/TelehealthConsent" className="text-white/45 hover:text-white text-sm transition-colors">Telehealth Informed Consent</Link></li>
                <li><Link to="/MedicalDisclaimer" className="text-white/45 hover:text-white text-sm transition-colors">Medical Disclaimer</Link></li>
                <li><Link to="/CookiePolicy" className="text-white/45 hover:text-white text-sm transition-colors">Cookie Policy</Link></li>
                <li><a href="mailto:support@medrevolve.com" className="text-white/45 hover:text-white text-sm transition-colors">support@medrevolve.com</a></li>
                <li><a href="mailto:info@medrevolve.com" className="text-white/45 hover:text-white text-sm transition-colors">info@medrevolve.com</a></li>
                <li><a href="tel:+17044263311" className="text-white/45 hover:text-white text-sm transition-colors">(704) 426-3311</a></li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-white/8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-white/20 text-xs">© 2025 MedRevolve. All rights reserved.</p>
            <p className="text-white/15 text-xs">Telehealth services provided by licensed providers through affiliated medical groups.</p>
          </div>
        </div>
      </footer>
    </div>);

}