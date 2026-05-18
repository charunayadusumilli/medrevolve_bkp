import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import MerchantSidebar from '@/components/merchant/MerchantSidebar';
import RequireAuth from '@/components/auth/RequireAuth';
import { Globe, Check, AlertCircle, Copy, RefreshCw, Plus, Shield, Zap, ArrowRight, CheckCircle2 } from 'lucide-react';

const STATUS_CONFIG = {
  checking_availability: { label: 'Checking Availability', color: 'bg-blue-500/20 text-blue-400', step: 1 },
  available: { label: 'Available', color: 'bg-green-500/20 text-green-400', step: 2 },
  unavailable: { label: 'Unavailable', color: 'bg-red-500/20 text-red-400', step: 0 },
  purchasing: { label: 'Purchasing...', color: 'bg-blue-500/20 text-blue-400', step: 3 },
  provisioning: { label: 'Provisioning...', color: 'bg-blue-500/20 text-blue-400', step: 4 },
  pending_dns: { label: 'Pending DNS', color: 'bg-amber-500/20 text-amber-400', step: 4 },
  active: { label: 'Active ✓', color: 'bg-green-500/20 text-green-400', step: 5 },
  failed: { label: 'Setup Failed', color: 'bg-red-500/20 text-red-400', step: 0 },
};

const DNS_STEPS = [
  { title: 'Domain Registered', desc: 'Domain purchased or verified' },
  { title: 'DNS Configured', desc: 'Nameservers pointing to platform' },
  { title: 'SSL Certificate', desc: 'HTTPS secured and active' },
  { title: 'Site Live', desc: 'Your storefront is publicly accessible' },
];

function MerchantDomainInner() {
  const queryClient = useQueryClient();
  const [partner, setPartner] = useState(null);
  const [newDomain, setNewDomain] = useState('');
  const [domainType, setDomainType] = useState('new');
  const [showAdd, setShowAdd] = useState(false);

  const { data: partners = [] } = useQuery({
    queryKey: ['my-partner-dom'],
    queryFn: async () => {
      const user = await base44.auth.me();
      return base44.entities.Partner.filter({ email: user.email });
    }
  });

  useEffect(() => { if (partners.length > 0) setPartner(partners[0]); }, [partners]);

  const { data: domains = [], isLoading } = useQuery({
    queryKey: ['merchant-domains-full', partner?.id],
    queryFn: () => base44.entities.MerchantDomain.filter({ merchant_id: partner.id }),
    enabled: !!partner
  });

  const { data: modules = [] } = useQuery({
    queryKey: ['merchant-modules-dom', partner?.id],
    queryFn: () => base44.entities.MerchantModule.filter({ merchant_id: partner.id }),
    enabled: !!partner
  });

  const activeModuleKeys = modules.filter(m => m.is_active).map(m => m.module_key);

  const addDomainMutation = useMutation({
    mutationFn: () => base44.entities.MerchantDomain.create({
      merchant_id: partner.id,
      merchant_name: partner.business_name,
      domain: domainType === 'subdomain' ? `${newDomain}.medrevolve.co` : newDomain,
      domain_type: domainType === 'new' ? 'new_purchase' : domainType === 'existing' ? 'existing' : 'subdomain',
      registrar: domainType === 'subdomain' ? 'medrevolve_subdomain' : 'godaddy',
      status: 'pending_dns',
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['merchant-domains-full'] });
      setShowAdd(false);
      setNewDomain('');
    }
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }) => base44.entities.MerchantDomain.update(id, { status }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['merchant-domains-full'] })
  });

  const primaryDomain = domains[0];
  const statusConf = primaryDomain ? STATUS_CONFIG[primaryDomain.status] || STATUS_CONFIG.pending_dns : null;
  const setupStep = statusConf?.step || 0;

  return (
    <div className="min-h-screen bg-[#0F1A0F] flex">
      <MerchantSidebar partner={partner} activeModules={activeModuleKeys} currentPage="MerchantDomainPage" />
      <main className="flex-1 overflow-auto">
        <div className="p-8 space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Domain & Website</h1>
              <p className="text-white/40 text-sm mt-1">Manage your storefront domain and website configuration</p>
            </div>
            <Button onClick={() => setShowAdd(!showAdd)} className="bg-[#4A6741] hover:bg-[#3D5636] text-white">
              <Plus className="w-4 h-4 mr-2" /> Add Domain
            </Button>
          </div>

          {/* Add Domain Form */}
          {showAdd && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
              <h3 className="text-white font-bold">Configure Domain</h3>
              <div className="grid gap-3">
                {[
                  { value: 'new', label: 'Purchase New Domain', desc: 'Auto-provisioned via GoDaddy API (~$12-18/yr)', icon: Globe },
                  { value: 'existing', label: 'Connect Existing Domain', desc: 'Update DNS to point to MedRevolve platform', icon: ArrowRight },
                  { value: 'subdomain', label: 'Free Subdomain', desc: 'yourname.medrevolve.co — instant setup', icon: Zap },
                ].map(opt => (
                  <button key={opt.value} type="button" onClick={() => setDomainType(opt.value)}
                    className={`flex items-center gap-4 p-4 rounded-xl border text-left transition-all
                      ${domainType === opt.value ? 'bg-[#4A6741]/20 border-[#4A6741]' : 'bg-white/3 border-white/10 hover:border-white/30'}`}>
                    <opt.icon className="w-5 h-5 text-[#6B8F5E] flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-white font-medium text-sm">{opt.label}</p>
                      <p className="text-white/40 text-xs">{opt.desc}</p>
                    </div>
                    {domainType === opt.value && <Check className="w-4 h-4 text-[#4A6741]" />}
                  </button>
                ))}
              </div>
              <div className="flex gap-3 items-end">
                <div className="flex-1">
                  <Label className="text-white/70 text-sm">
                    {domainType === 'subdomain' ? 'Your Subdomain' : 'Domain Name'}
                  </Label>
                  <div className="flex items-center mt-1 gap-2">
                    <Input value={newDomain} onChange={e => setNewDomain(e.target.value)}
                      placeholder={domainType === 'subdomain' ? 'mybusiness' : 'yourdomain.com'}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/30" />
                    {domainType === 'subdomain' && (
                      <span className="text-white/50 text-sm whitespace-nowrap">.medrevolve.co</span>
                    )}
                  </div>
                </div>
                <Button onClick={() => addDomainMutation.mutate()} disabled={!newDomain || addDomainMutation.isPending}
                  className="bg-[#4A6741] hover:bg-[#3D5636] text-white">
                  {addDomainMutation.isPending ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Add'}
                </Button>
              </div>
            </motion.div>
          )}

          {/* Domains List */}
          {isLoading ? (
            <div className="flex justify-center py-16"><RefreshCw className="w-6 h-6 text-white/40 animate-spin" /></div>
          ) : domains.length === 0 ? (
            <div className="text-center py-16 bg-white/5 rounded-2xl border border-white/10">
              <Globe className="w-12 h-12 text-white/20 mx-auto mb-3" />
              <p className="text-white/40 font-medium">No domain configured yet</p>
              <p className="text-white/20 text-sm mb-4">Set up your storefront domain to go live</p>
              <Button onClick={() => setShowAdd(true)} className="bg-[#4A6741] hover:bg-[#3D5636] text-white">
                Configure Domain
              </Button>
            </div>
          ) : domains.map(domain => {
            const conf = STATUS_CONFIG[domain.status] || STATUS_CONFIG.pending_dns;
            const step = conf.step || 0;
            return (
              <motion.div key={domain.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                {/* Domain Header */}
                <div className="p-6 border-b border-white/10">
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#4A6741]/20 rounded-xl flex items-center justify-center">
                        <Globe className="w-5 h-5 text-[#6B8F5E]" />
                      </div>
                      <div>
                        <p className="text-white font-bold">{domain.domain}</p>
                        <p className="text-white/40 text-xs">{domain.registrar?.replace(/_/g, ' ')} · {domain.domain_type?.replace(/_/g, ' ')}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={`${conf.color} border-0`}>{conf.label}</Badge>
                      <button onClick={() => navigator.clipboard.writeText(domain.domain)}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                        <Copy className="w-4 h-4 text-white/40" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Setup Progress */}
                <div className="p-6">
                  <p className="text-white/60 text-xs uppercase tracking-widest font-semibold mb-4">Setup Progress</p>
                  <div className="space-y-3">
                    {DNS_STEPS.map((s, i) => {
                      const done = step > i + 1;
                      const current = step === i + 1;
                      return (
                        <div key={i} className="flex items-center gap-4">
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-all
                            ${done ? 'bg-[#4A6741]' : current ? 'bg-white/20 ring-2 ring-[#4A6741]' : 'bg-white/10'}`}>
                            {done ? <Check className="w-3.5 h-3.5 text-white" /> : (
                              <span className="text-xs text-white/60 font-bold">{i + 1}</span>
                            )}
                          </div>
                          <div className="flex-1">
                            <p className={`text-sm font-medium ${done ? 'text-white' : current ? 'text-white' : 'text-white/40'}`}>{s.title}</p>
                            <p className="text-xs text-white/30">{s.desc}</p>
                          </div>
                          {done && <CheckCircle2 className="w-4 h-4 text-[#4A6741]" />}
                          {current && <div className="w-2 h-2 bg-[#4A6741] rounded-full animate-pulse" />}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* DNS Instructions (if pending) */}
                {(domain.status === 'pending_dns' || domain.status === 'existing') && (
                  <div className="px-6 pb-6">
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                      <p className="text-blue-300 font-semibold text-sm mb-2">DNS Configuration Required</p>
                      <p className="text-blue-400/70 text-xs mb-3">Update your domain's nameservers to:</p>
                      <div className="space-y-1 font-mono">
                        {['ns1.medrevolve.co', 'ns2.medrevolve.co'].map(ns => (
                          <div key={ns} className="flex items-center gap-2 bg-white/5 rounded-lg px-3 py-2">
                            <span className="text-white text-xs flex-1">{ns}</span>
                            <button onClick={() => navigator.clipboard.writeText(ns)}
                              className="text-white/40 hover:text-white">
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                      <Button size="sm" onClick={() => updateStatusMutation.mutate({ id: domain.id, status: 'active' })}
                        className="mt-3 bg-blue-600 hover:bg-blue-700 text-white text-xs">
                        Mark DNS Updated
                      </Button>
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}

          {/* Website Builder Teaser */}
          <div className="bg-gradient-to-r from-[#1A2A1A] to-[#2D3A2D] border border-[#4A6741]/30 rounded-2xl p-6">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="w-12 h-12 bg-[#4A6741]/30 rounded-xl flex items-center justify-center flex-shrink-0">
                <Globe className="w-6 h-6 text-[#6B8F5E]" />
              </div>
              <div className="flex-1">
                <h3 className="text-white font-bold">Website Builder</h3>
                <p className="text-white/50 text-sm">25 professional themes + 5 checkout themes. AI builds your compliant site automatically.</p>
              </div>
              <Button className="bg-[#4A6741] hover:bg-[#3D5636] text-white flex-shrink-0">
                Activate Module <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function MerchantDomainPage() {
  return (
    <RequireAuth portalName="Domain Manager">
      <MerchantDomainInner />
    </RequireAuth>
  );
}