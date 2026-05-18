import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import MerchantSidebar from '@/components/merchant/MerchantSidebar';
import ModuleCard from '@/components/merchant/ModuleCard';
import RequireAuth from '@/components/auth/RequireAuth';
import {
  DollarSign, Users, Package, TrendingUp, AlertCircle,
  ArrowRight, Globe, ShieldCheck, Zap, CreditCard, BarChart3, BookOpen, Star
} from 'lucide-react';

const MODULE_DEFS = [
  { key: 'inventory', label: 'Inventory Management', description: 'Track stock levels, alerts & reorders', price: 49, icon: Package },
  { key: 'compliance', label: 'Compliance / PEPMD', description: 'Automated compliance monitoring', price: 99, icon: ShieldCheck },
  { key: 'telehealth', label: 'Telehealth Integration', description: 'Patient consultations & Rx', price: 149, icon: Zap, popular: true },
  { key: 'pharmacy', label: 'Pharmacy Integration', description: 'Direct pharmacy routing & fulfillment', price: 79, icon: Package },
  { key: 'website_builder', label: 'Website Builder', description: '25 themes + 5 checkout themes', price: 59, icon: Globe },
  { key: 'marketing', label: 'Marketing Module', description: 'SEO, ads, analytics', price: 69, icon: BarChart3 },
  { key: 'card_processing', label: 'Card Processing', description: 'Card Group Intl merchant accounts', price: 0, icon: CreditCard, popular: true },
  { key: 'lms', label: 'Peptide University', description: 'Team training & certifications', price: 39, icon: BookOpen },
];

function MerchantDashboardInner() {
  const queryClient = useQueryClient();
  const [partner, setPartner] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  const { data: partners = [], isLoading: partnersLoading, isError: partnersError } = useQuery({
    queryKey: ['my-partner'],
    queryFn: async () => {
      const user = await base44.auth.me();
      setCurrentUser(user);
      return base44.entities.Partner.filter({ email: user.email });
    }
  });

  const { data: modules = [] } = useQuery({
    queryKey: ['merchant-modules', partner?.id],
    queryFn: () => partner ? base44.entities.MerchantModule.filter({ merchant_id: partner.id }) : [],
    enabled: !!partner
  });

  const { data: inventory = [] } = useQuery({
    queryKey: ['merchant-inventory', partner?.id],
    queryFn: () => partner ? base44.entities.MerchantInventory.filter({ merchant_id: partner.id }) : [],
    enabled: !!partner
  });

  const { data: domains = [] } = useQuery({
    queryKey: ['merchant-domains', partner?.id],
    queryFn: () => partner ? base44.entities.MerchantDomain.filter({ merchant_id: partner.id }) : [],
    enabled: !!partner
  });

  const { data: referrals = [] } = useQuery({
    queryKey: ['partner-referrals-dash', partner?.id],
    queryFn: () => partner ? base44.entities.PartnerReferral.filter({ partner_id: partner.id }) : [],
    enabled: !!partner
  });

  useEffect(() => {
    if (partners.length > 0) setPartner(partners[0]);
  }, [partners]);

  const activateModuleMutation = useMutation({
    mutationFn: async (moduleKey) => {
      const existing = modules.find(m => m.module_key === moduleKey);
      if (existing) {
        return base44.entities.MerchantModule.update(existing.id, { is_active: true, status: 'trial', activated_at: new Date().toISOString() });
      } else {
        const mod = MODULE_DEFS.find(m => m.key === moduleKey);
        return base44.entities.MerchantModule.create({
          merchant_id: partner.id,
          merchant_name: partner.business_name,
          module_key: moduleKey,
          is_active: true,
          status: 'trial',
          monthly_fee: mod?.price || 0,
          activated_at: new Date().toISOString(),
        });
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['merchant-modules'] })
  });

  const activeModuleKeys = modules.filter(m => m.is_active).map(m => m.module_key);

  const lowStockItems = inventory.filter(i => i.current_stock <= i.min_stock_threshold);
  const domain = domains[0];
  const totalEarnings = referrals.reduce((sum, r) => sum + (r.partner_earnings || 0), 0);

  const stats = [
    { label: 'Total Earnings', value: `$${totalEarnings.toFixed(2)}`, icon: DollarSign, color: 'text-green-400', bg: 'bg-green-500/10' },
    { label: 'Total Referrals', value: referrals.length, icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { label: 'Inventory Items', value: inventory.length, icon: Package, color: 'text-purple-400', bg: 'bg-purple-500/10' },
    { label: 'Active Modules', value: activeModuleKeys.length, icon: TrendingUp, color: 'text-amber-400', bg: 'bg-amber-500/10' },
  ];

  // ── PHASE 1: Loading ──────────────────────────────────────────
  if (partnersLoading) {
    return (
      <div className="min-h-screen bg-[#0F1A0F] flex items-center justify-center">
        <div className="text-center text-white max-w-sm px-6">
          <div className="w-10 h-10 border-2 border-[#4A6741] border-t-transparent rounded-full animate-spin mx-auto mb-5" />
          <p className="text-white font-semibold mb-1">Loading your platform...</p>
          <p className="text-white/30 text-sm">Checking merchant account for <span className="text-white/60">{currentUser?.email || '...'}</span></p>
          <div className="mt-6 flex items-center justify-center gap-2">
            {['Authenticating', 'Fetching account', 'Loading modules'].map((step, i) => (
              <div key={i} className="flex items-center gap-1.5 text-[10px] text-white/20 tracking-wide">
                <div className="w-1.5 h-1.5 rounded-full bg-[#4A6741]/50 animate-pulse" style={{ animationDelay: `${i * 0.3}s` }} />
                {step}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── PHASE 2: Error fetching ────────────────────────────────────
  if (partnersError) {
    return (
      <div className="min-h-screen bg-[#0F1A0F] flex items-center justify-center">
        <div className="text-center text-white max-w-md px-6">
          <div className="w-14 h-14 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-5">
            <AlertCircle className="w-7 h-7 text-red-400" />
          </div>
          <p className="text-white font-bold text-lg mb-2">Failed to load platform</p>
          <p className="text-white/40 text-sm mb-2">There was a network error fetching your account.</p>
          <p className="text-white/20 text-xs mb-6">Logged in as: <span className="text-white/40">{currentUser?.email}</span></p>
          <div className="flex flex-col gap-3">
            <Button onClick={() => queryClient.invalidateQueries({ queryKey: ['my-partner'] })}
              className="bg-[#4A6741] hover:bg-[#3D5636] text-white w-full">
              Retry Connection
            </Button>
            <Link to={createPageUrl('MerchantOnboarding')}>
              <Button variant="outline" className="border-white/15 text-white/60 hover:text-white w-full">
                Start Fresh Onboarding
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── PHASE 3: No merchant account found ────────────────────────
  if (!partner) {
    return (
      <div className="min-h-screen bg-[#0F1A0F] flex items-center justify-center px-6">
        <div className="text-white max-w-lg w-full">

          {/* Status breakdown */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-amber-500/10 rounded-full flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <p className="text-white font-bold text-lg">No merchant account found</p>
                <p className="text-white/40 text-sm">Signed in as <span className="text-amber-400/70">{currentUser?.email}</span></p>
              </div>
            </div>

            {/* Phase checklist */}
            <div className="bg-white/3 border border-white/8 rounded-2xl p-5 space-y-3 mb-6">
              <p className="text-white/30 text-[10px] tracking-[0.2em] uppercase mb-4 font-semibold">Platform Load Status</p>
              {[
                { label: 'Authentication', detail: `Signed in as ${currentUser?.email || 'unknown'}`, status: 'ok' },
                { label: 'Merchant lookup', detail: `Searched Partner records for email match`, status: 'ok' },
                { label: 'Account found', detail: `No Partner record linked to this email`, status: 'fail' },
                { label: 'Dashboard load', detail: 'Blocked — requires merchant account', status: 'blocked' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-[10px] font-bold
                    ${item.status === 'ok' ? 'bg-green-500/20 text-green-400' :
                      item.status === 'fail' ? 'bg-red-500/20 text-red-400' :
                      'bg-white/10 text-white/30'}`}>
                    {item.status === 'ok' ? '✓' : item.status === 'fail' ? '✗' : '—'}
                  </div>
                  <div>
                    <p className={`text-sm font-semibold ${item.status === 'ok' ? 'text-white/70' : item.status === 'fail' ? 'text-red-400' : 'text-white/25'}`}>
                      {item.label}
                    </p>
                    <p className="text-white/25 text-xs">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-white/30 text-sm leading-relaxed">
              Your email <span className="text-white/60">{currentUser?.email}</span> doesn't have a linked merchant account yet.
              This happens if you signed up but haven't completed onboarding, or if you're using a different email than the one you applied with.
            </p>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Link to={createPageUrl('MerchantOnboarding')} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <Button className="bg-[#4A6741] hover:bg-[#3D5636] text-white w-full h-12 font-semibold">
                Complete Merchant Onboarding
              </Button>
            </Link>
            <p className="text-center text-white/20 text-xs">Already applied with a different email? Contact support.</p>
            <Link to={createPageUrl('Home')} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <Button variant="ghost" className="text-white/30 hover:text-white w-full text-sm">
                ← Return to Homepage
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F1A0F] flex">
      <MerchantSidebar partner={partner} activeModules={activeModuleKeys} currentPage="MerchantDashboard" />

      <main className="flex-1 overflow-auto">
        <div className="p-8 space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Welcome back, {partner.business_name}</h1>
              <p className="text-white/40 text-sm mt-1">Here's your platform overview</p>
            </div>
            <div className="flex gap-3">
              <Badge className={partner.subscription_status === 'active'
                ? 'bg-green-500/20 text-green-400 border-green-500/30'
                : 'bg-amber-500/20 text-amber-400 border-amber-500/30'}>
                {partner.subscription_status || 'Trial'}
              </Badge>
              <Button size="sm" className="bg-[#4A6741] hover:bg-[#3D5636] text-white">
                Upgrade Plan
              </Button>
            </div>
          </div>

          {/* Alerts */}
          {lowStockItems.length > 0 && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
              className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 flex items-center gap-4">
              <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-amber-300 font-semibold text-sm">{lowStockItems.length} item{lowStockItems.length > 1 ? 's' : ''} below minimum stock</p>
                <p className="text-amber-400/60 text-xs">{lowStockItems.map(i => i.product_name).join(', ')}</p>
              </div>
              <Link to={createPageUrl('MerchantInventoryPage')}>
                <Button size="sm" className="bg-amber-500 hover:bg-amber-600 text-white text-xs">View Inventory</Button>
              </Link>
            </motion.div>
          )}

          {domain && domain.status !== 'active' && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
              className="bg-blue-500/10 border border-blue-500/30 rounded-2xl p-4 flex items-center gap-4">
              <Globe className="w-5 h-5 text-blue-400 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-blue-300 font-semibold text-sm">Domain setup in progress: {domain.domain}</p>
                <p className="text-blue-400/60 text-xs">Status: {domain.status?.replace(/_/g, ' ')}</p>
              </div>
              <Link to={createPageUrl('MerchantDomainPage')}>
                <Button size="sm" className="bg-blue-500 hover:bg-blue-600 text-white text-xs">Manage Domain</Button>
              </Link>
            </motion.div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, i) => (
              <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                  <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center mb-3`}>
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-white/40 text-xs mt-1">{stat.label}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="grid sm:grid-cols-3 gap-4">
            <Link to={createPageUrl('MerchantInventoryPage')}>
              <div className="bg-white/5 border border-white/10 hover:border-[#4A6741]/50 rounded-2xl p-5 cursor-pointer transition-all group">
                <Package className="w-6 h-6 text-[#6B8F5E] mb-3" />
                <p className="text-white font-semibold text-sm">Manage Inventory</p>
                <p className="text-white/40 text-xs mt-1">{inventory.length} products tracked</p>
                <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-white/60 mt-2 transition-colors" />
              </div>
            </Link>
            <Link to={createPageUrl('PartnerCompliance')}>
              <div className="bg-white/5 border border-white/10 hover:border-[#4A6741]/50 rounded-2xl p-5 cursor-pointer transition-all group">
                <ShieldCheck className="w-6 h-6 text-[#6B8F5E] mb-3" />
                <p className="text-white font-semibold text-sm">Compliance Center</p>
                <p className="text-white/40 text-xs mt-1">PEPMD compliance tools</p>
                <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-white/60 mt-2 transition-colors" />
              </div>
            </Link>
            <Link to={createPageUrl('MerchantDomainPage')}>
              <div className="bg-white/5 border border-white/10 hover:border-[#4A6741]/50 rounded-2xl p-5 cursor-pointer transition-all group">
                <Globe className="w-6 h-6 text-[#6B8F5E] mb-3" />
                <p className="text-white font-semibold text-sm">Domain & Website</p>
                <p className="text-white/40 text-xs mt-1">{domain ? domain.domain : 'Not configured'}</p>
                <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-white/60 mt-2 transition-colors" />
              </div>
            </Link>
          </div>

          {/* Module Grid */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white">Platform Modules</h2>
              <p className="text-white/40 text-xs">{activeModuleKeys.length} of {MODULE_DEFS.length} active</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {MODULE_DEFS.map(mod => {
                const record = modules.find(m => m.module_key === mod.key);
                return (
                  <ModuleCard
                    key={mod.key}
                    module={mod}
                    moduleRecord={record}
                    onActivate={() => activateModuleMutation.mutate(mod.key)}
                  />
                );
              })}
            </div>
          </div>

          {/* Partner Code */}
          <div className="bg-[#1A2A1A] border border-[#4A6741]/30 rounded-2xl p-6">
            <h3 className="text-white font-bold mb-2">Your Partner Referral Code</h3>
            <div className="flex items-center gap-3">
              <code className="bg-white/10 text-[#6B8F5E] px-4 py-2 rounded-xl font-mono text-lg tracking-wider">
                {partner.partner_code}
              </code>
              <Button size="sm" variant="ghost" className="text-white/60 hover:text-white"
                onClick={() => navigator.clipboard.writeText(partner.partner_code)}>
                Copy
              </Button>
            </div>
            <p className="text-white/40 text-xs mt-2">Share this code to earn {partner.pricing_markup_percentage}% on all referred conversions</p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function MerchantDashboard() {
  return (
    <RequireAuth portalName="Merchant Dashboard">
      <MerchantDashboardInner />
    </RequireAuth>
  );
}