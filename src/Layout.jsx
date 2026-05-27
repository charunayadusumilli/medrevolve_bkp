import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { detectDomain, NAV_CONFIG, BRAND } from '@/lib/domainConfig';
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

// Domain-aware home redirect — only fires on LIVE published domains, never in DEV/preview
const DOMAIN_HOME_MAP = { B2C: '/', B2B: '/ForBusiness', RUO: '/ResearchProducts', WATER: '/WaterHome', ADMIN: '/AdminDashboard' };

function DomainHomeRedirect() {
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    const domain = detectDomain();
    // Only redirect on actual live domains — never in Base44 preview/dev
    if (domain === 'DEV') return;
    const home = DOMAIN_HOME_MAP[domain];
    if (home && home !== '/' && location.pathname === '/') {
      navigate(home, { replace: true });
    }
  }, [location.pathname]);
  return null;
}

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

    // ── IONOS AI Voice Receptionist Web Chat ───────────────
    if (!document.getElementById('ionos-web-chat')) {
      const ionosScript = document.createElement('script');
      ionosScript.id = 'ionos-web-chat';
      ionosScript.src = 'https://ionos.ai-voice-receptionist.com/chat-scripts-MqGN74WP/web-chat.js';
      ionosScript.setAttribute('name', 'web-chat');
      ionosScript.setAttribute('data-client-secret', 'b7ca0b0f-ecbd-43b6-bddf-0ad67f8f6eb1');
      ionosScript.defer = true;
      document.body.appendChild(ionosScript);
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
  const domain = detectDomain();
  const brand = BRAND[domain] || BRAND.DEV;
  const domainNav = NAV_CONFIG[domain] || [];

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
      <DomainHomeRedirect />
      <AnalyticsTracker />
      <AIAssistant />

      {/* Top Phone Bar - Always visible with dynamic CTA */}
      <div className="bg-gradient-to-r from-cyan-700 via-blue-700 to-cyan-700 text-white py-2.5 px-4 text-center sticky top-0 z-[60] animate-pulse-slow">
        <a href="tel:+12403875224" className="inline-flex items-center gap-2.5 text-sm font-bold hover:scale-105 transition-all duration-300 group">
          <div className="relative">
            <Phone className="w-4 h-4 group-hover:rotate-12 transition-transform" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full animate-ping" />
          </div>
          <span className="hidden sm:inline text-cyan-100 group-hover:text-white transition-colors">Start Here: </span>
          <span className="text-lg font-black tracking-wide bg-white/20 px-3 py-0.5 rounded-full group-hover:bg-white/30 transition-all">240-387-5224</span>
          <span className="hidden md:inline text-xs text-cyan-200 ml-1">← Click to Call Now</span>
        </a>
      </div>

      {/* Header */}
      <motion.header
        className={`sticky top-[40px] left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-[#0A0A0A]/95 backdrop-blur-lg border-b border-white/10' : 'bg-[#0A0A0A]'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.4 }}>

        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to={DOMAIN_HOME_MAP[domain] || '/'} className="flex items-center gap-2.5 flex-shrink-0">
              <div className="w-8 h-8 bg-white flex items-center justify-center rounded-sm">
                <span className="text-black font-black text-[11px] tracking-tight">{brand.logoText}</span>
              </div>
              <span className="text-base font-bold text-white tracking-tight">{brand.name}</span>
            </Link>

            {/* Desktop Nav — domain-aware */}
            <nav className="hidden lg:flex items-center gap-8">
              {domain === 'DEV' || domain === 'B2C' ? (
                <Link to="/Platform" onClick={() => handleNavClick()} className="text-sm text-white/60 hover:text-white transition-colors">
                  Platform
                </Link>
              ) : null}
              {domainNav.slice(0, 4).map(item => (
                <Link key={item.path} to={item.path} onClick={() => handleNavClick()} className="text-sm text-white/60 hover:text-white transition-colors">
                  {item.label}
                </Link>
              ))}
              <a href="tel:+12403875224" className="text-sm text-white font-bold hover:text-cyan-400 transition-colors flex items-center gap-1.5 bg-white/10 border border-white/20 rounded-full px-3 py-1.5">
                <Phone className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden xl:inline">Call Now: </span>
                240-387-5224
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
                    <DropdownMenuItem asChild><Link to="/ProjectManagement" className="cursor-pointer rounded-lg px-3 py-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 text-sm font-bold">🎫 Project Management</Link></DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-white/10" />
                    <DropdownMenuItem asChild><Link to="/ProductsAndServices" className="cursor-pointer rounded-lg px-3 py-2 text-orange-400 hover:text-orange-300 hover:bg-orange-500/10 text-sm font-bold">📦 Products & Services</Link></DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-white/10" />
                    <DropdownMenuItem asChild><Link to="/SystemArchitecture" className="cursor-pointer rounded-lg px-3 py-2 text-white/90 hover:text-white hover:bg-white/5 text-sm font-bold border border-white/10">⚙️ System Architecture</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link to="/ComplianceAuditReport" className="cursor-pointer rounded-lg px-3 py-2 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 text-sm font-bold">📋 Compliance Audit Report</Link></DropdownMenuItem>
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

              <Link to={domain === 'B2B' ? '/ForBusiness' : domain === 'WATER' ? '/WaterHome#products' : createPageUrl('MerchantOnboarding')} className="hidden sm:block">
                <Button className="bg-white text-black hover:bg-white/90 rounded-sm px-5 text-sm font-bold tracking-wide">
                  {domain === 'B2B' ? 'View Platform' : domain === 'WATER' ? 'Shop Vials' : 'Get Started'}
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
                      <Link to={DOMAIN_HOME_MAP[domain] || '/'} className="flex items-center gap-2.5" onClick={() => setMobileMenuOpen(false)}>
                        <div className="w-7 h-7 bg-white flex items-center justify-center rounded-sm">
                          <span className="text-black font-black text-[10px]">{brand.logoText}</span>
                        </div>
                        <span className="text-base font-bold text-white">{brand.name}</span>
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

                    <div className="p-5 border-t border-white/10 space-y-3">
                      {/* Phone CTA - Always visible in mobile */}
                      <a href="tel:+12403875224" className="block w-full bg-cyan-600 hover:bg-cyan-500 text-white text-center font-bold rounded-sm py-3 transition-colors">
                        <Phone className="w-4 h-4 inline mr-2 -mt-0.5" />
                        Call 240-387-5224
                      </a>
                      
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
                          <Link to={domain === 'B2B' ? '/ForBusiness' : domain === 'WATER' ? '/WaterHome#products' : createPageUrl('MerchantOnboarding')} onClick={() => setMobileMenuOpen(false)}>
                            <Button className="w-full bg-white text-black hover:bg-white/90 rounded-sm font-bold">
                              {domain === 'B2B' ? 'View Platform' : domain === 'WATER' ? 'Shop Vials' : 'Get Started'}
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

      {/* Floating Call Button - Appears on scroll */}
      <a
        href="tel:+12403875224"
        className="fixed bottom-6 right-6 z-[70] bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-full p-4 shadow-2xl hover:shadow-cyan-500/50 transition-all duration-300 hover:scale-110 group animate-bounce-slow hidden lg:flex items-center gap-2 overflow-hidden">
        <Phone className="w-6 h-6 flex-shrink-0 group-hover:rotate-12 transition-transform" />
        <span className="font-bold text-sm whitespace-nowrap max-w-0 group-hover:max-w-xs transition-all duration-500">Call Now: 240-387-5224</span>
      </a>

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
                  <span className="text-black font-black text-[10px]">{brand.logoText}</span>
                </div>
                <span className="text-base font-bold text-white">{brand.name}</span>
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
                {domain === 'B2B' ? (
                  <>
                    <li><Link to="/ForBusiness" className="text-white/45 hover:text-white text-sm transition-colors">For Business</Link></li>
                    <li><Link to="/MerchantOnboarding" className="text-white/45 hover:text-white text-sm transition-colors">Get Started</Link></li>
                    <li><Link to="/PartnerProgram" className="text-white/45 hover:text-white text-sm transition-colors">Partner Program</Link></li>
                    <li><Link to="/ForCreators" className="text-white/45 hover:text-white text-sm transition-colors">Creator Program</Link></li>
                    <li><Link to="/MerchantDemo" className="text-white/45 hover:text-white text-sm transition-colors">See Demo</Link></li>
                  </>
                ) : domain === 'WATER' ? (
                  <>
                    <li><a href="/WaterHome#products" className="text-white/45 hover:text-white text-sm transition-colors">5mL Vials</a></li>
                    <li><a href="/WaterHome#products" className="text-white/45 hover:text-white text-sm transition-colors">10mL Vials</a></li>
                    <li><a href="/WaterHome#products" className="text-white/45 hover:text-white text-sm transition-colors">30mL Vials</a></li>
                    <li><a href="/WaterHome#bulk" className="text-white/45 hover:text-white text-sm transition-colors">Bulk & Wholesale</a></li>
                    <li><Link to="/Contact" className="text-white/45 hover:text-white text-sm transition-colors">Contact</Link></li>
                  </>
                ) : (
                  <>
                    <li><Link to={createPageUrl('TelehealthPlatform')} className="text-white/45 hover:text-white text-sm transition-colors">Telehealth</Link></li>
                    <li><Link to={createPageUrl('ForBusiness')} className="text-white/45 hover:text-white text-sm transition-colors">For Business</Link></li>
                    <li><Link to={createPageUrl('MerchantOnboarding')} className="text-white/45 hover:text-white text-sm transition-colors">Get Started</Link></li>
                    <li><Link to={createPageUrl('BookAppointment')} className="text-white/45 hover:text-white text-sm transition-colors">Book a Consultation</Link></li>
                    <li><Link to={createPageUrl('HowItWorks')} className="text-white/45 hover:text-white text-sm transition-colors">How It Works</Link></li>
                  </>
                )}
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
                <li><a href="tel:+12403875224" className="text-white/45 hover:text-white text-sm transition-colors">240-387-5224</a></li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-white/8 flex flex-col items-center gap-4">
            <p className="text-white/25 text-xs text-center max-w-4xl leading-relaxed">
              These statements have not been evaluated by the FDA. All programs require a valid prescription from a licensed physician. Results may vary. Telehealth services provided by licensed providers through affiliated medical groups.
            </p>
            <div className="flex flex-col md:flex-row items-center justify-between w-full gap-2">
              <p className="text-white/20 text-xs">© 2025 MedRevolve. All rights reserved.</p>
              <p className="text-white/15 text-xs">Not intended to diagnose, treat, cure, or prevent any disease.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>);

}