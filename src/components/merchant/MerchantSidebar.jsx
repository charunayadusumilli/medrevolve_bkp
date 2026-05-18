import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import {
  LayoutDashboard, Package, ShieldCheck, Globe, CreditCard,
  BarChart3, BookOpen, Settings, Zap, LogOut, Building2, ChevronRight
} from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { Badge } from '@/components/ui/badge';

const NAV_ITEMS = [
  { label: 'Dashboard', icon: LayoutDashboard, page: 'MerchantDashboard', key: 'dashboard' },
  { label: 'Inventory', icon: Package, page: 'MerchantInventoryPage', key: 'inventory' },
  { label: 'Compliance', icon: ShieldCheck, page: 'PartnerCompliance', key: 'compliance' },
  { label: 'Domain & Site', icon: Globe, page: 'MerchantDomainPage', key: 'domain' },
  { label: 'Processing', icon: CreditCard, page: 'MerchantDashboard', key: 'card_processing' },
  { label: 'Analytics', icon: BarChart3, page: 'MerchantDashboard', key: 'analytics' },
  { label: 'Peptide U', icon: BookOpen, page: 'MerchantDashboard', key: 'lms' },
  { label: 'Settings', icon: Settings, page: 'AccountSettings', key: 'settings' },
];

export default function MerchantSidebar({ partner, activeModules = [], currentPage }) {
  const location = useLocation();

  const isModuleActive = (key) => {
    if (['dashboard', 'settings', 'analytics'].includes(key)) return true;
    return activeModules.includes(key);
  };

  return (
    <aside className="w-64 bg-[#0F1A0F] min-h-screen flex flex-col border-r border-white/10">
      {/* Logo */}
      <div className="p-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#2D3A2D] to-[#4A6741] flex items-center justify-center">
            <span className="text-white font-black text-sm">MR</span>
          </div>
          <div>
            <p className="text-white font-bold text-sm">MedRevolve</p>
            <p className="text-white/40 text-xs">Merchant Platform</p>
          </div>
        </div>
      </div>

      {/* Merchant Info */}
      {partner && (
        <div className="px-4 py-3 border-b border-white/10">
          <div className="flex items-center gap-2 p-2 bg-white/5 rounded-xl">
            <div className="w-8 h-8 rounded-lg bg-[#4A6741] flex items-center justify-center flex-shrink-0">
              <Building2 className="w-4 h-4 text-white" />
            </div>
            <div className="min-w-0">
              <p className="text-white text-xs font-semibold truncate">{partner.business_name}</p>
              <Badge className={`text-xs border-0 px-1 py-0 ${partner.subscription_status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-amber-500/20 text-amber-400'}`}>
                {partner.subscription_status || 'trial'}
              </Badge>
            </div>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1">
        {NAV_ITEMS.map(item => {
          const active = isModuleActive(item.key);
          const isCurrentPage = location.pathname.includes(item.page);
          const Icon = item.icon;
          return (
            <div key={item.key}>
              {active ? (
                <Link to={createPageUrl(item.page)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group
                    ${isCurrentPage ? 'bg-[#4A6741] text-white' : 'text-white/60 hover:bg-white/10 hover:text-white'}`}>
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span className="text-sm font-medium">{item.label}</span>
                  {isCurrentPage && <ChevronRight className="w-3 h-3 ml-auto" />}
                </Link>
              ) : (
                <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/20 cursor-not-allowed">
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span className="text-sm font-medium">{item.label}</span>
                  <span className="ml-auto text-xs bg-white/10 px-1.5 py-0.5 rounded-full">Add</span>
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-white/10">
        <button onClick={() => base44.auth.logout('/')}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all w-full">
          <LogOut className="w-4 h-4" />
          <span className="text-sm">Sign Out</span>
        </button>
      </div>
    </aside>
  );
}