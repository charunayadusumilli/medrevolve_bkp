import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { 
  Menu, ChevronDown, Leaf,
  Phone, Mail, MapPin,
  Instagram, Twitter, Facebook, Youtube, ShoppingCart
} from 'lucide-react';
import { base44 } from '@/api/base44Client';
import AnalyticsTracker from '@/components/analytics/AnalyticsTracker';
import AIAssistant from '@/components/chat/AIAssistant';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navItems = [
  { name: 'Shop', href: 'Products' },
  { name: 'Consultations', href: 'Consultations' },
  { name: 'Patient Portal', href: 'PatientPortal' },
];

export default function Layout({ children }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
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

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      {/* Analytics Tracker */}
      <AnalyticsTracker />
      
      {/* AI Assistant */}
      <AIAssistant />
      
      {/* Header */}
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled 
            ? 'bg-white/95 backdrop-blur-lg shadow-sm' 
            : 'bg-transparent'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to={createPageUrl('Home')} className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#4A6741] to-[#6B8F5E] flex items-center justify-center">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-semibold text-[#2D3A2D]">
                MedRevolve
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={createPageUrl(item.href)}
                  className="text-sm font-medium text-[#5A6B5A] hover:text-[#4A6741] transition-colors"
                >
                  {item.name}
                </Link>
              ))}
              {/* Portals dropdown — visible to all, protected at page level */}
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-medium text-[#5A6B5A] hover:text-[#4A6741] transition-colors">
                  Portals
                  <ChevronDown className="w-4 h-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white rounded-xl border-none shadow-xl">
                  <DropdownMenuItem asChild><Link to={createPageUrl('PatientPortal')} className="cursor-pointer">Patient Portal</Link></DropdownMenuItem>
                  <DropdownMenuItem asChild><Link to={createPageUrl('ProviderDashboard')} className="cursor-pointer">Provider Portal</Link></DropdownMenuItem>
                  <DropdownMenuItem asChild><Link to={createPageUrl('PartnerPortal')} className="cursor-pointer">Partner Portal</Link></DropdownMenuItem>
                  <DropdownMenuItem asChild><Link to={createPageUrl('ForCreators')} className="cursor-pointer">Creator Portal</Link></DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              {/* Admin-only — invisible to regular users */}
              {user?.role === 'admin' && (
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center gap-1 text-xs font-semibold text-[#4A6741] bg-[#4A6741]/10 px-3 py-1.5 rounded-full hover:bg-[#4A6741]/20 transition-colors">
                    Command Center
                    <ChevronDown className="w-3 h-3" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-white rounded-xl border-none shadow-xl">
                    <DropdownMenuItem asChild><Link to={createPageUrl('AdminDashboard')} className="cursor-pointer">Overview</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link to={createPageUrl('PartnershipHub')} className="cursor-pointer">Partnerships</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link to={createPageUrl('ComplianceDashboard')} className="cursor-pointer">Compliance</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link to={createPageUrl('PharmacyContracts')} className="cursor-pointer">Pharmacy Contracts</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link to={createPageUrl('ProviderContracts')} className="cursor-pointer">Provider Contracts</Link></DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-4">
              <Link to={createPageUrl('Login')} className="hidden sm:block">
                <Button 
                  variant="ghost" 
                  className="text-[#5A6B5A] hover:text-[#4A6741] hover:bg-[#4A6741]/5"
                >
                  Login
                </Button>
              </Link>
              <Link to={createPageUrl('Products')} className="hidden sm:block">
                <Button 
                  className="bg-[#4A6741] hover:bg-[#3D5636] text-white rounded-full px-6"
                >
                  Sign Up
                </Button>
              </Link>
              <Link to={createPageUrl('Cart')}>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="relative text-[#5A6B5A] hover:text-[#4A6741] hover:bg-[#4A6741]/5"
                >
                  <ShoppingCart className="w-5 h-5" />
                </Button>
              </Link>

              {/* Mobile Menu */}
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild className="lg:hidden">
                  <Button variant="ghost" size="icon">
                    <Menu className="w-5 h-5 text-[#2D3A2D]" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-full max-w-sm bg-white p-0">
                  <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between p-6 border-b border-[#E8E0D5]">
                      <Link to={createPageUrl('Home')} className="flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#4A6741] to-[#6B8F5E] flex items-center justify-center">
                          <Leaf className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-lg font-semibold text-[#2D3A2D]">MedRevolve</span>
                      </Link>
                    </div>
                    
                    <nav className="flex-1 p-6 space-y-1">
                      {navItems.map((item) => (
                        <Link
                          key={item.name}
                          to={createPageUrl(item.href)}
                          className="block py-3 text-sm font-medium text-[#2D3A2D] hover:text-[#4A6741]"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {item.name}
                        </Link>
                      ))}
                      <div className="pt-4 border-t border-[#E8E0D5] mt-4">
                        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">Ecosystem</p>
                        <Link to={createPageUrl('ForCreators')} className="block py-2 text-sm text-[#5A6B5A] hover:text-[#4A6741]" onClick={() => setMobileMenuOpen(false)}>For Creators</Link>
                        <Link to={createPageUrl('ForBusiness')} className="block py-2 text-sm text-[#5A6B5A] hover:text-[#4A6741]" onClick={() => setMobileMenuOpen(false)}>For Businesses</Link>
                        <Link to={createPageUrl('PartnerSignup')} className="block py-2 text-sm text-[#5A6B5A] hover:text-[#4A6741]" onClick={() => setMobileMenuOpen(false)}>Become a Partner</Link>
                      </div>
                      {user?.role === 'admin' && (
                        <div className="pt-4 border-t border-[#E8E0D5] mt-4">
                          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">Command Center</p>
                          <Link to={createPageUrl('AdminDashboard')} className="block py-2 text-sm text-[#4A6741] font-medium" onClick={() => setMobileMenuOpen(false)}>Overview</Link>
                          <Link to={createPageUrl('ComplianceDashboard')} className="block py-2 text-sm text-[#4A6741] font-medium" onClick={() => setMobileMenuOpen(false)}>Compliance</Link>
                          <Link to={createPageUrl('PartnershipHub')} className="block py-2 text-sm text-[#4A6741] font-medium" onClick={() => setMobileMenuOpen(false)}>Partnerships</Link>
                        </div>
                      )}
                    </nav>

                    <div className="p-6 border-t border-[#E8E0D5] space-y-3">
                      <Link to={createPageUrl('Login')} onClick={() => setMobileMenuOpen(false)}>
                        <Button variant="outline" className="w-full rounded-full border-[#4A6741] text-[#4A6741]">
                          Login
                        </Button>
                      </Link>
                      <Link to={createPageUrl('Products')} onClick={() => setMobileMenuOpen(false)}>
                        <Button className="w-full bg-[#4A6741] hover:bg-[#3D5636] text-white rounded-full">
                          Sign Up
                        </Button>
                      </Link>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="pt-20">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-[#2D3A2D] text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                  <Leaf className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-semibold">MedRevolve</span>
              </div>
              <p className="text-white/60 text-sm leading-relaxed mb-6">
                Your path to better health, curated. Wellness doesn't have to feel clinical—it should feel like connection.
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                  <Youtube className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Products */}
            <div>
              <h4 className="font-medium mb-6">Products</h4>
              <ul className="space-y-3">
                <li><Link to={createPageUrl('Products?category=weight')} className="text-white/60 hover:text-white text-sm transition-colors">Weight Loss</Link></li>
                <li><Link to={createPageUrl('Products?category=longevity')} className="text-white/60 hover:text-white text-sm transition-colors">Longevity</Link></li>
                <li><Link to={createPageUrl('Products?category=hormone')} className="text-white/60 hover:text-white text-sm transition-colors">Hormone</Link></li>
                <li><span className="text-white/40 text-sm">Hair (Coming Soon)</span></li>
                <li><span className="text-white/40 text-sm">Skin (Coming Soon)</span></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="font-medium mb-6">Company</h4>
              <ul className="space-y-3">
                <li><Link to={createPageUrl('Consultations')} className="text-white/60 hover:text-white text-sm transition-colors">Consultations</Link></li>
                <li><Link to={createPageUrl('PatientPortal')} className="text-white/60 hover:text-white text-sm transition-colors">Patient Portal</Link></li>
                <li><Link to={createPageUrl('ForCreators')} className="text-white/60 hover:text-white text-sm transition-colors">For Creators</Link></li>
                <li><Link to={createPageUrl('ForBusiness')} className="text-white/60 hover:text-white text-sm transition-colors">For Businesses</Link></li>
                <li><Link to={createPageUrl('Contact')} className="text-white/60 hover:text-white text-sm transition-colors">Contact Us</Link></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-medium mb-6">Get in Touch</h4>
              <ul className="space-y-4">
                <li className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-white/40" />
                  <span className="text-white/60 text-sm">support@medrevolve.com</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-white/40" />
                  <span className="text-white/60 text-sm">1-800-MED-REVO</span>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-white/40 flex-shrink-0" />
                  <span className="text-white/60 text-sm">Los Angeles, CA<br />United States</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Portal Access — bottom of footer */}
          <div className="mt-12 pt-8 border-t border-white/10">
            <p className="text-white/30 text-xs uppercase tracking-widest mb-4">Portal Access (Login Required)</p>
            <div className="flex flex-wrap gap-4">
              <Link to={createPageUrl('PatientPortal')} className="text-white/50 hover:text-white text-sm transition-colors">Patient Portal</Link>
              <Link to={createPageUrl('ProviderDashboard')} className="text-white/50 hover:text-white text-sm transition-colors">Provider Portal</Link>
              <Link to={createPageUrl('PartnerPortal')} className="text-white/50 hover:text-white text-sm transition-colors">Partner Portal</Link>
              <Link to={createPageUrl('ForCreators')} className="text-white/50 hover:text-white text-sm transition-colors">Creator Portal</Link>
              {user?.role === 'admin' && (
                <Link to={createPageUrl('AdminDashboard')} className="text-[#A8C99B] hover:text-white text-sm transition-colors">Command Center</Link>
              )}
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-white/40 text-sm">
              © 2024 MedRevolve. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link to={createPageUrl('Privacy')} className="text-white/40 hover:text-white text-sm transition-colors">Privacy Policy</Link>
              <Link to={createPageUrl('Terms')} className="text-white/40 hover:text-white text-sm transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}