import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  Menu, ChevronDown, Leaf, X,
  Phone, Mail, MapPin,
  Instagram, Twitter, Facebook, Youtube, ShoppingCart,
  User, LogOut, Settings, LayoutDashboard
} from 'lucide-react';
import { base44 } from '@/api/base44Client';
import AnalyticsTracker from '@/components/analytics/AnalyticsTracker';
import AIAssistant from '@/components/chat/AIAssistant';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const treatCategories = [
  { name: 'Weight Loss', href: 'Products?category=weight_loss', image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=120&q=80' },
  { name: "Men's Health", href: 'Products?category=mens_health', image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=120&q=80' },
  { name: "Women's Health", href: 'Products?category=womens_health', image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=120&q=80' },
  { name: 'Longevity', href: 'Products?category=longevity', image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=120&q=80' },
  { name: 'Hair Loss', href: 'Products?category=hair_loss', image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=120&q=80' },
  { name: 'Peptides', href: 'Products?category=peptides', image: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=120&q=80' },
];

function TreatMegaMenu({ onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.18 }}
      className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[680px] bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 z-50"
    >
      <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">Browse by Category</p>
      <div className="grid grid-cols-3 gap-3">
        {treatCategories.map((cat) => (
          <Link
            key={cat.name}
            to={createPageUrl(cat.href)}
            onClick={onClose}
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#F5F0E8] transition-colors group"
          >
            <img src={cat.image} alt={cat.name} className="w-10 h-10 rounded-lg object-cover" />
            <span className="font-medium text-[#2D3A2D] text-sm group-hover:text-[#4A6741] transition-colors">{cat.name}</span>
          </Link>
        ))}
      </div>
      <div className="mt-4 pt-4 border-t border-gray-100">
        <Link to={createPageUrl('Products')} onClick={onClose}
          className="flex items-center justify-between px-3 py-2 rounded-xl bg-[#4A6741]/5 hover:bg-[#4A6741]/10 transition-colors">
          <span className="font-semibold text-[#4A6741] text-sm">View All Products →</span>
        </Link>
      </div>
    </motion.div>
  );
}

export default function Layout({ children }) {
  const cyclingWords = ['Feel Better', 'Look Better', 'Live Longer', 'Be Stronger', 'Start Today'];
  const [cycleIndex, setCycleIndex] = useState(0);
  const [fadeIn, setFadeIn] = useState(true);

  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [treatOpen, setTreatOpen] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const interval = setInterval(() => {
      setFadeIn(false);
      setTimeout(() => {
        setCycleIndex(prev => (prev + 1) % cyclingWords.length);
        setFadeIn(true);
      }, 300);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
      } catch {
        setUser(null);
      }
    };
    checkUser();
  }, [location.pathname]);

  // Determine user's dashboard based on role
  const getDashboardUrl = () => {
    if (!user) return null;
    if (user.role === 'admin') return createPageUrl('AdminDashboard');
    // Check user attributes for role hints
    return createPageUrl('PatientPortal');
  };

  const handleTreatToggle = () => setTreatOpen(!treatOpen);

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      <AnalyticsTracker />
      <AIAssistant />

      {/* Announcement Bar */}
      <div className="bg-[#2D3A2D] text-white text-center py-2.5 px-4 text-sm font-medium">
        ✦ Your wellness, elevated. Personalized protocols from licensed providers, delivered to your door.{' '}
          <Link to={createPageUrl('Products')} className="underline underline-offset-2 hover:text-[#A8C99B] transition-colors">
            Begin your journey →
          </Link>
      </div>

      {/* Header */}
      <motion.header
        className={`sticky top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-white/98 backdrop-blur-lg shadow-sm' : 'bg-white'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to={createPageUrl('Home')} className="flex items-center gap-2 flex-shrink-0">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#4A6741] to-[#6B8F5E] flex items-center justify-center">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-[#2D3A2D] tracking-tight">MedRevolve</span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {/* What We Treat Mega Menu */}
              <div className="relative" onMouseEnter={() => setTreatOpen(true)} onMouseLeave={() => setTreatOpen(false)}>
                <button className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-[#2D3A2D] hover:text-[#4A6741] rounded-lg hover:bg-[#F5F0E8] transition-all">
                  <span
                    style={{ transition: 'opacity 0.3s ease', opacity: fadeIn ? 1 : 0, minWidth: 90, display: 'inline-block', textAlign: 'left' }}
                  >
                    {cyclingWords[cycleIndex]}
                  </span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${treatOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {treatOpen && <TreatMegaMenu onClose={() => setTreatOpen(false)} />}
                </AnimatePresence>
              </div>

              <Link to={createPageUrl('Consultations')}
                className="px-4 py-2 text-sm font-medium text-[#2D3A2D] hover:text-[#4A6741] rounded-lg hover:bg-[#F5F0E8] transition-all">
                Consultations
              </Link>

              {/* Partners dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-[#2D3A2D] hover:text-[#4A6741] rounded-lg hover:bg-[#F5F0E8] transition-all">
                    Partners
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white rounded-2xl border-none shadow-2xl p-2 min-w-[220px]">
                  <DropdownMenuItem asChild>
                    <Link to={createPageUrl('PartnerProgram')} className="cursor-pointer rounded-xl px-3 py-2.5 flex flex-col gap-0.5">
                      <span className="font-semibold text-[#2D3A2D]">Partner Program</span>
                      <span className="text-xs text-gray-400">Gyms, spas, wellness centers</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to={createPageUrl('ForCreators')} className="cursor-pointer rounded-xl px-3 py-2.5 flex flex-col gap-0.5">
                      <span className="font-semibold text-[#2D3A2D]">Creator Program</span>
                      <span className="text-xs text-gray-400">Influencers & content creators</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to={createPageUrl('ForBusiness')} className="cursor-pointer rounded-xl px-3 py-2.5 flex flex-col gap-0.5">
                      <span className="font-semibold text-[#2D3A2D]">For Business</span>
                      <span className="text-xs text-gray-400">White-label & enterprise</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to={createPageUrl('ProviderIntake')} className="cursor-pointer rounded-xl px-3 py-2.5 flex flex-col gap-0.5">
                      <span className="font-semibold text-[#2D3A2D]">Join as Provider</span>
                      <span className="text-xs text-gray-400">Physicians & NPs</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to={createPageUrl('PharmacyIntake')} className="cursor-pointer rounded-xl px-3 py-2.5 flex flex-col gap-0.5">
                      <span className="font-semibold text-[#2D3A2D]">Join as Pharmacy</span>
                      <span className="text-xs text-gray-400">Compounding pharmacies</span>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Admin only */}
              {user?.role === 'admin' && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-[#4A6741] bg-[#4A6741]/10 rounded-full hover:bg-[#4A6741]/20 transition-all">
                      ⚡ Admin
                      <ChevronDown className="w-3 h-3" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-white rounded-2xl border-none shadow-2xl p-2">
                    <DropdownMenuItem asChild><Link to={createPageUrl('AdminDashboard')} className="cursor-pointer rounded-xl px-3 py-2">Overview</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link to={createPageUrl('PartnershipHub')} className="cursor-pointer rounded-xl px-3 py-2">Partnerships</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link to={createPageUrl('ComplianceDashboard')} className="cursor-pointer rounded-xl px-3 py-2">Compliance</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link to={createPageUrl('PharmacyContracts')} className="cursor-pointer rounded-xl px-3 py-2">Pharmacy Contracts</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link to={createPageUrl('ProviderContracts')} className="cursor-pointer rounded-xl px-3 py-2">Provider Contracts</Link></DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              <Link to={createPageUrl('Cart')} className="hidden sm:flex">
                <Button variant="ghost" size="icon" className="relative text-[#2D3A2D] hover:text-[#4A6741] hover:bg-[#F5F0E8]">
                  <ShoppingCart className="w-5 h-5" />
                </Button>
              </Link>

              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="hidden sm:flex items-center gap-2 text-[#2D3A2D] hover:bg-[#F5F0E8] rounded-full px-3">
                      <div className="w-7 h-7 rounded-full bg-[#4A6741] flex items-center justify-center text-white text-xs font-bold">
                        {user.full_name?.[0] || user.email?.[0] || 'U'}
                      </div>
                      <span className="text-sm font-medium max-w-[100px] truncate">{user.full_name || 'Account'}</span>
                      <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-white rounded-2xl border-none shadow-2xl p-2 min-w-[200px]" align="end">
                    <div className="px-3 py-2 mb-1">
                      <p className="font-semibold text-[#2D3A2D] text-sm">{user.full_name}</p>
                      <p className="text-xs text-gray-400 truncate">{user.email}</p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to={createPageUrl('PatientPortal')} className="cursor-pointer rounded-xl px-3 py-2 flex items-center gap-2">
                        <LayoutDashboard className="w-4 h-4 text-[#4A6741]" />
                        <span>My Portal</span>
                      </Link>
                    </DropdownMenuItem>
                    {user.role === 'admin' && (
                      <DropdownMenuItem asChild>
                        <Link to={createPageUrl('AdminDashboard')} className="cursor-pointer rounded-xl px-3 py-2 flex items-center gap-2">
                          <Settings className="w-4 h-4 text-[#4A6741]" />
                          <span>Admin Dashboard</span>
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="cursor-pointer rounded-xl px-3 py-2 flex items-center gap-2 text-red-500 hover:text-red-600 hover:bg-red-50"
                      onClick={() => base44.auth.logout('/')}
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <Button variant="ghost"
                    className="hidden sm:flex text-sm font-medium text-[#2D3A2D] hover:text-[#4A6741] hover:bg-[#F5F0E8] rounded-full"
                    onClick={() => base44.auth.redirectToLogin(window.location.href)}>
                    Sign In
                  </Button>
                  <Link to={createPageUrl('Questionnaire')} className="hidden sm:block">
                    <Button className="bg-[#2D3A2D] hover:bg-[#1D2A1D] text-white rounded-full px-5 text-sm font-semibold">
                      Get Started
                    </Button>
                  </Link>
                </>
              )}

              {/* Mobile Menu */}
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild className="lg:hidden">
                  <Button variant="ghost" size="icon">
                    <Menu className="w-5 h-5 text-[#2D3A2D]" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-full max-w-sm bg-white p-0">
                  <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between p-5 border-b border-[#E8E0D5]">
                      <Link to={createPageUrl('Home')} className="flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#4A6741] to-[#6B8F5E] flex items-center justify-center">
                          <Leaf className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-lg font-bold text-[#2D3A2D]">MedRevolve</span>
                      </Link>
                    </div>

                    <nav className="flex-1 overflow-y-auto p-5 space-y-1">
                      {treatCategories.map(cat => (
                        <Link key={cat.name} to={createPageUrl(cat.href)}
                          className="flex items-center gap-3 py-2.5 px-3 rounded-xl hover:bg-[#F5F0E8] text-sm font-medium text-[#2D3A2D]"
                          onClick={() => setMobileMenuOpen(false)}>
                          <img src={cat.image} alt={cat.name} className="w-8 h-8 rounded-lg object-cover" />
                          {cat.name}
                        </Link>
                      ))}

                      <div className="pt-4 border-t border-[#E8E0D5] mt-2">
                        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 px-3">Consultations & Services</p>
                        <Link to={createPageUrl('Consultations')} className="block py-2.5 px-3 rounded-xl text-sm font-medium text-[#2D3A2D] hover:bg-[#F5F0E8]" onClick={() => setMobileMenuOpen(false)}>Book Consultation</Link>
                        <Link to={createPageUrl('HowItWorks')} className="block py-2.5 px-3 rounded-xl text-sm font-medium text-[#2D3A2D] hover:bg-[#F5F0E8]" onClick={() => setMobileMenuOpen(false)}>How It Works</Link>
                      </div>

                      <div className="pt-4 border-t border-[#E8E0D5]">
                        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 px-3">Programs</p>
                        <Link to={createPageUrl('PartnerProgram')} className="block py-2.5 px-3 rounded-xl text-sm font-medium text-[#2D3A2D] hover:bg-[#F5F0E8]" onClick={() => setMobileMenuOpen(false)}>Partner Program</Link>
                        <Link to={createPageUrl('ForCreators')} className="block py-2.5 px-3 rounded-xl text-sm font-medium text-[#2D3A2D] hover:bg-[#F5F0E8]" onClick={() => setMobileMenuOpen(false)}>Creator Program</Link>
                        <Link to={createPageUrl('ForBusiness')} className="block py-2.5 px-3 rounded-xl text-sm font-medium text-[#2D3A2D] hover:bg-[#F5F0E8]" onClick={() => setMobileMenuOpen(false)}>For Business</Link>
                      </div>

                      {user && (
                        <div className="pt-4 border-t border-[#E8E0D5]">
                          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 px-3">My Account</p>
                          <Link to={createPageUrl('PatientPortal')} className="block py-2.5 px-3 rounded-xl text-sm font-medium text-[#4A6741] hover:bg-[#F5F0E8]" onClick={() => setMobileMenuOpen(false)}>My Portal</Link>
                          {user.role === 'admin' && (
                            <Link to={createPageUrl('AdminDashboard')} className="block py-2.5 px-3 rounded-xl text-sm font-medium text-[#4A6741] hover:bg-[#F5F0E8]" onClick={() => setMobileMenuOpen(false)}>Admin Dashboard</Link>
                          )}
                        </div>
                      )}

                      {user?.role === 'admin' && (
                        <div className="pt-4 border-t border-[#E8E0D5]">
                          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 px-3">Command Center</p>
                          <Link to={createPageUrl('ComplianceDashboard')} className="block py-2.5 px-3 rounded-xl text-sm font-medium text-[#4A6741] hover:bg-[#F5F0E8]" onClick={() => setMobileMenuOpen(false)}>Compliance</Link>
                          <Link to={createPageUrl('PartnershipHub')} className="block py-2.5 px-3 rounded-xl text-sm font-medium text-[#4A6741] hover:bg-[#F5F0E8]" onClick={() => setMobileMenuOpen(false)}>Partnerships</Link>
                        </div>
                      )}
                    </nav>

                    <div className="p-5 border-t border-[#E8E0D5] space-y-2">
                      {user ? (
                        <Button
                          variant="outline"
                          className="w-full rounded-full border-red-200 text-red-500"
                          onClick={() => { base44.auth.logout('/'); setMobileMenuOpen(false); }}
                        >
                          Sign Out
                        </Button>
                      ) : (
                        <>
                          <Button variant="outline" className="w-full rounded-full border-[#4A6741] text-[#4A6741]"
                            onClick={() => { base44.auth.redirectToLogin(window.location.href); setMobileMenuOpen(false); }}>
                            Sign In
                          </Button>
                          <Link to={createPageUrl('Questionnaire')} onClick={() => setMobileMenuOpen(false)}>
                            <Button className="w-full bg-[#2D3A2D] hover:bg-[#1D2A1D] text-white rounded-full">
                              Get Started Free
                            </Button>
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

      {/* Main Content */}
      <main>
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-[#1A2A1A] text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
            {/* Brand */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
                  <Leaf className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold">MedRevolve</span>
              </div>
              <p className="text-white/50 text-sm leading-relaxed mb-6 max-w-xs">
                Prescription telehealth at transparent prices. Real doctors, licensed pharmacies, delivered to your door.
              </p>
              <div className="flex gap-3">
                {[Instagram, Twitter, Facebook, Youtube].map((Icon, i) => (
                  <a key={i} href="#" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>

            {/* Treatments */}
            <div>
              <h4 className="font-semibold mb-4 text-sm uppercase tracking-widest text-white/40">Treatments</h4>
              <ul className="space-y-2.5">
                {treatCategories.map(cat => (
                  <li key={cat.name}>
                    <Link to={createPageUrl(cat.href)} className="text-white/60 hover:text-white text-sm transition-colors">{cat.name}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Programs */}
            <div>
              <h4 className="font-semibold mb-4 text-sm uppercase tracking-widest text-white/40">Programs</h4>
              <ul className="space-y-2.5">
                <li><Link to={createPageUrl('PartnerProgram')} className="text-white/60 hover:text-white text-sm transition-colors">Partner Program</Link></li>
                <li><Link to={createPageUrl('ForCreators')} className="text-white/60 hover:text-white text-sm transition-colors">Creator Program</Link></li>
                <li><Link to={createPageUrl('ForBusiness')} className="text-white/60 hover:text-white text-sm transition-colors">For Business</Link></li>
                <li><Link to={createPageUrl('ProviderIntake')} className="text-white/60 hover:text-white text-sm transition-colors">Join as Provider</Link></li>
                <li><Link to={createPageUrl('PharmacyIntake')} className="text-white/60 hover:text-white text-sm transition-colors">Join as Pharmacy</Link></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="font-semibold mb-4 text-sm uppercase tracking-widest text-white/40">Company</h4>
              <ul className="space-y-2.5">
                <li><Link to={createPageUrl('Consultations')} className="text-white/60 hover:text-white text-sm transition-colors">Consultations</Link></li>
                <li><Link to={createPageUrl('HowItWorks')} className="text-white/60 hover:text-white text-sm transition-colors">How It Works</Link></li>
                <li><Link to={createPageUrl('Contact')} className="text-white/60 hover:text-white text-sm transition-colors">Contact</Link></li>
                <li><Link to={createPageUrl('Privacy')} className="text-white/60 hover:text-white text-sm transition-colors">Privacy Policy</Link></li>
                <li><Link to={createPageUrl('Terms')} className="text-white/60 hover:text-white text-sm transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>

          {/* Portal Access */}
          <div className="mt-12 pt-8 border-t border-white/10">
            <p className="text-white/25 text-xs uppercase tracking-widest mb-3">Account Access</p>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              {[
                { label: 'Patient Portal', page: 'PatientPortal' },
                { label: 'Provider Portal', page: 'ProviderDashboard' },
                { label: 'Partner Portal', page: 'PartnerPortal' },
                { label: 'Creator Portal', page: 'ForCreators' },
              ].map(item => (
                <Link key={item.page} to={createPageUrl(item.page)}
                  className="text-white/40 hover:text-white text-sm transition-colors">
                  {item.label}
                </Link>
              ))}
              {user?.role === 'admin' && (
                <Link to={createPageUrl('AdminDashboard')} className="text-[#A8C99B] hover:text-white text-sm transition-colors">
                  Admin Dashboard
                </Link>
              )}
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-white/30 text-xs">© 2024 MedRevolve. All rights reserved. Not affiliated with any insurance provider.</p>
            <p className="text-white/20 text-xs">Telehealth services provided by licensed providers through affiliated medical groups.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}