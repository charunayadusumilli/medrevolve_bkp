import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { detectDomain } from '@/lib/domainConfig';
// domainConfig simplified — BRAND/NAV_CONFIG no longer exported separately
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Phone, User, LogOut, Settings, LayoutDashboard, ChevronDown } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import AnalyticsTracker from '@/components/analytics/AnalyticsTracker';
import AIAssistant from '@/components/chat/AIAssistant';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

const NAV_LINKS = [
  { label: 'Services',        path: '/Services' },
  { label: 'How It Works',   path: '/HowItWorks' },
  { label: 'For Business',   path: '/ForBusiness' },
  { label: 'University',     path: '/University' },
  { label: 'Contact',        path: '/Contact' },
];

export default function Layout({ children }) {
  const [scrolled, setScrolled]       = useState(false);
  const [mobileOpen, setMobileOpen]   = useState(false);
  const [user, setUser]               = useState(null);
  const location                      = useLocation();
  const domain                        = detectDomain();

  useEffect(() => {
    // Cookiebot
    if (!document.getElementById('Cookiebot')) {
      const s = document.createElement('script');
      s.id = 'Cookiebot';
      s.src = 'https://consent.cookiebot.com/uc.js';
      s.setAttribute('data-cbid', 'f872245e-106f-4258-bb1a-084567404e79');
      s.type = 'text/javascript';
      s.async = true;
      document.head.insertBefore(s, document.head.firstChild);
    }
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const ok = await base44.auth.isAuthenticated();
        if (!ok || cancelled) return;
        const me = await base44.auth.me();
        if (!cancelled) setUser(me);
      } catch { if (!cancelled) setUser(null); }
    })();
    return () => { cancelled = true; };
  }, [location.pathname]);

  const closeMenu = () => { setMobileOpen(false); window.scrollTo({ top: 0 }); };

  // All non-medrevolve.com domains — show nothing, no branding, no links
  if (domain === 'DOWN') {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-300 text-6xl font-black mb-3">404</p>
          <p className="text-gray-300 text-sm">Not Found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <AnalyticsTracker />
      <AIAssistant />

      {/* Top announcement bar */}
      <div className="bg-[#0A0A0A] border-b border-white/5 text-white py-2 px-4 text-center sticky top-0 z-[60]">
        <a href="tel:+12403875224"
          className="inline-flex items-center gap-2 text-sm font-semibold hover:opacity-80 transition-opacity">
          <Phone className="w-3.5 h-3.5 text-green-400" />
          <span className="text-white/60">Speak with a specialist:</span>
          <span className="font-bold tracking-wide">240-387-5224</span>
        </a>
      </div>

      {/* Header */}
      <motion.header
        className={`sticky top-[37px] left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-white/95 backdrop-blur-lg shadow-sm border-b border-gray-100' : 'bg-white border-b border-gray-100'
        }`}
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.35 }}>

        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 flex-shrink-0">
              <div className="w-8 h-8 bg-[#0A0A0A] flex items-center justify-center rounded-sm">
                <span className="text-white font-black text-[11px] tracking-tight">MR</span>
              </div>
              <span className="text-base font-bold text-[#0A0A0A] tracking-tight">MedRevolve</span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-7">
              {NAV_LINKS.map(item => (
                <Link key={item.path} to={item.path}
                  className={`text-sm font-medium transition-colors ${
                    location.pathname === item.path
                      ? 'text-[#0A0A0A]'
                      : 'text-gray-500 hover:text-[#0A0A0A]'
                  }`}>
                  {item.label}
                </Link>
              ))}

              {/* Admin dropdown — only visible to logged-in admins */}
              {user?.role === 'admin' && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-1 text-sm font-medium text-green-700 hover:text-green-800 transition-colors">
                      Admin <ChevronDown className="w-3 h-3" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-white border border-gray-200 rounded-xl shadow-xl p-2 min-w-[220px]" align="end">
                    <DropdownMenuItem asChild><Link to={createPageUrl('AdminDashboard')} className="cursor-pointer rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">Overview</Link></DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-gray-100" />
                    <DropdownMenuItem asChild><Link to={createPageUrl('MerchantOnboarding')} className="cursor-pointer rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">🚀 Merchant Onboarding</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link to={createPageUrl('MerchantDashboard')} className="cursor-pointer rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">📊 Merchant Dashboard</Link></DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-gray-100" />
                    <DropdownMenuItem asChild><Link to={createPageUrl('ComplianceDashboard')} className="cursor-pointer rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">Compliance</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link to={createPageUrl('PartnershipHub')} className="cursor-pointer rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">Partnerships</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link to={createPageUrl('PaymentsDashboard')} className="cursor-pointer rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">Payments</Link></DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-gray-100" />
                    <DropdownMenuItem asChild><Link to="/InboxDashboard" className="cursor-pointer rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">📥 Inbox</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link to="/GrowthDashboard" className="cursor-pointer rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">📈 Growth & Analytics</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link to="/GodModeAds" className="cursor-pointer rounded-lg px-3 py-2 text-sm font-bold text-yellow-700 hover:bg-yellow-50">⚡ God Mode Ads</Link></DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-gray-100" />
                    <DropdownMenuItem asChild><Link to="/SystemArchitecture" className="cursor-pointer rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">⚙️ System Architecture</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link to="/ComplianceAuditReport" className="cursor-pointer rounded-lg px-3 py-2 text-sm text-emerald-700 hover:bg-emerald-50">📋 Compliance Audit</Link></DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-3">
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="hidden sm:flex items-center gap-2 text-gray-600 hover:text-gray-900">
                      <div className="w-7 h-7 rounded-full bg-gray-900 flex items-center justify-center text-white text-xs font-bold">
                        {(user.full_name || user.email)?.[0]?.toUpperCase() || 'U'}
                      </div>
                      <ChevronDown className="w-3 h-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-white border border-gray-200 rounded-xl shadow-xl p-2 min-w-[190px]" align="end">
                    <div className="px-3 py-2 mb-1">
                      <p className="text-sm font-semibold text-gray-900">{user.full_name}</p>
                      <p className="text-xs text-gray-400 truncate">{user.email}</p>
                    </div>
                    <DropdownMenuSeparator className="bg-gray-100" />
                    <DropdownMenuItem asChild>
                      <Link to={createPageUrl('PatientPortal')} className="cursor-pointer rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                        <LayoutDashboard className="w-4 h-4" /> My Portal
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to={createPageUrl('AccountSettings')} className="cursor-pointer rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                        <User className="w-4 h-4" /> Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-gray-100" />
                    <DropdownMenuItem
                      className="cursor-pointer rounded-lg px-3 py-2 text-sm text-red-500 hover:bg-red-50 flex items-center gap-2"
                      onClick={() => base44.auth.logout('/')}>
                      <LogOut className="w-4 h-4" /> Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button variant="ghost" size="sm"
                  className="hidden sm:flex text-sm text-gray-500 hover:text-gray-900"
                  onClick={() => base44.auth.redirectToLogin(window.location.href)}>
                  <User className="w-4 h-4 mr-1" /> Sign In
                </Button>
              )}

              <Link to="/MerchantOnboarding" className="hidden sm:block">
                <Button className="hover:opacity-90 text-white rounded-sm px-5 text-sm font-semibold"
                  style={{ backgroundColor: '#A66B3C' }}>
                  Book a Demo
                </Button>
              </Link>

              {/* Mobile menu */}
              <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                <SheetTrigger asChild className="lg:hidden">
                  <Button variant="ghost" size="icon" className="text-gray-700">
                    <Menu className="w-5 h-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-full max-w-sm bg-white border-l border-gray-100 p-0">
                  <div className="flex flex-col h-full">
                    <div className="flex items-center p-5 border-b border-gray-100">
                      <Link to="/" className="flex items-center gap-2.5" onClick={closeMenu}>
                        <div className="w-7 h-7 bg-[#0A0A0A] flex items-center justify-center rounded-sm">
                          <span className="text-white font-black text-[10px]">MR</span>
                        </div>
                        <span className="font-bold text-[#0A0A0A]">MedRevolve</span>
                      </Link>
                    </div>
                    <nav className="flex-1 p-5 space-y-1">
                      {NAV_LINKS.map(item => (
                        <Link key={item.path} to={item.path}
                          className="block py-3 px-3 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                          onClick={closeMenu}>
                          {item.label}
                        </Link>
                      ))}
                      {user && (
                        <div className="pt-4 border-t border-gray-100 mt-2 space-y-1">
                          <Link to={createPageUrl('PatientPortal')} className="block py-3 px-3 rounded-lg text-sm text-gray-600 hover:bg-gray-50" onClick={closeMenu}>My Portal</Link>
                          {user.role === 'admin' && <Link to={createPageUrl('AdminDashboard')} className="block py-3 px-3 rounded-lg text-sm text-gray-600 hover:bg-gray-50" onClick={closeMenu}>Admin</Link>}
                        </div>
                      )}
                    </nav>
                    <div className="p-5 border-t border-gray-100 space-y-3">
                      <a href="tel:+12403875224"
                        className="flex items-center justify-center gap-2 w-full bg-gray-900 text-white font-semibold rounded-sm py-3 text-sm">
                        <Phone className="w-4 h-4" /> 240-387-5224
                      </a>
                      {user ? (
                        <Button variant="outline" className="w-full rounded-sm border-red-200 text-red-500"
                          onClick={() => { base44.auth.logout('/'); closeMenu(); }}>Sign Out</Button>
                      ) : (
                        <>
                          <Button variant="outline" className="w-full rounded-sm"
                            onClick={() => { base44.auth.redirectToLogin(window.location.href); closeMenu(); }}>Sign In</Button>
                          <Link to="/MerchantOnboarding" onClick={closeMenu}>
                            <Button className="w-full text-white rounded-sm font-semibold" style={{ backgroundColor: '#A66B3C' }}>Book a Demo</Button>
                          </Link>
                        </>
                      )}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>

          </div>
        </div>
      </motion.header>

      {/* Page content */}
      <main>{children}</main>

      {/* Footer */}
      <footer className="bg-[#0A0A0A] text-white border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-16 py-14">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">

            {/* Brand */}
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-7 h-7 bg-white flex items-center justify-center rounded-sm">
                  <span className="text-black font-black text-[10px]">MR</span>
                </div>
                <span className="font-bold text-white">MedRevolve</span>
              </div>
              <p className="text-sm text-white/40 leading-relaxed">
                Full-service B2B telehealth infrastructure. Website setup, provider integration, pharmacy network, compliance, and payments — all under your brand.
              </p>
            </div>

            {/* Platform links */}
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-white/20 mb-4">Platform</p>
              <ul className="space-y-2.5">
                <li><Link to="/Services" className="text-sm text-white/40 hover:text-white transition-colors">Services</Link></li>
                <li><Link to="/HowItWorks" className="text-sm text-white/40 hover:text-white transition-colors">How It Works</Link></li>
                <li><Link to="/ForBusiness" className="text-sm text-white/40 hover:text-white transition-colors">For Business</Link></li>
                <li><Link to="/University" className="text-sm text-white/40 hover:text-white transition-colors">MedRevolve University</Link></li>
                <li><Link to="/MerchantOnboarding" className="text-sm text-white/40 hover:text-white transition-colors">Book a Demo</Link></li>
                <li><a href="tel:+12403875224" className="text-sm text-white/40 hover:text-white transition-colors">(240) 387-5224</a></li>
                <li><Link to="/Contact" className="text-sm text-white/40 hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>

            {/* Legal links */}
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-white/20 mb-4">Legal & Compliance</p>
              <ul className="space-y-2.5">
                <li><Link to="/Privacy" className="text-sm text-white/40 hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link to="/Terms" className="text-sm text-white/40 hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link to="/HIPAANotice" className="text-sm text-white/40 hover:text-white transition-colors">HIPAA Notice</Link></li>
                <li><Link to="/TelehealthConsent" className="text-sm text-white/40 hover:text-white transition-colors">Telehealth Consent</Link></li>
                <li><Link to="/MedicalDisclaimer" className="text-sm text-white/40 hover:text-white transition-colors">Medical Disclaimer</Link></li>
                <li><Link to="/CookiePolicy" className="text-sm text-white/40 hover:text-white transition-colors">Cookie Policy</Link></li>
              </ul>
            </div>

          </div>

          <div className="border-t border-white/5 pt-8 flex flex-col gap-3">
            <p className="text-xs text-white/20">© {new Date().getFullYear()} MedRevolve Corporation. All rights reserved. US residents only.</p>
            <p className="text-xs text-white/15 max-w-3xl leading-relaxed">
              MedRevolve is a B2B infrastructure and services company. We build and operate white-label telehealth platforms for licensed business operators. All clinical services on operator platforms are delivered by independently licensed providers and NABP-verified pharmacies.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}