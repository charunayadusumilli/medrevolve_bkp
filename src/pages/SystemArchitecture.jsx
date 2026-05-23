/**
 * MedRevolve System Architecture — God Mode Command Center
 * Admin-only living dashboard of the entire platform's architecture,
 * domain assignments, integration statuses, and action items.
 */
import React, { useState } from 'react';
import { SNAPSHOT } from '@/lib/snapshot';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';
import RequireAuth from '@/components/auth/RequireAuth';
import {
  Globe, Database, Code2, Bot, Zap, CheckCircle2, Clock,
  AlertTriangle, ArrowRight, Package, Shield, BarChart3, RefreshCw, Rocket
} from 'lucide-react';
import DomainDeployPanel from '@/components/admin/DomainDeployPanel';

const DOMAIN_COLORS = {
  B2C:   { bg: 'bg-green-500/15',  text: 'text-green-400',  border: 'border-green-500/30' },
  B2B:   { bg: 'bg-blue-500/15',   text: 'text-blue-400',   border: 'border-blue-500/30' },
  RUO:   { bg: 'bg-purple-500/15', text: 'text-purple-400', border: 'border-purple-500/30' },
  WATER: { bg: 'bg-cyan-500/15',   text: 'text-cyan-400',   border: 'border-cyan-500/30' },
  ADMIN: { bg: 'bg-amber-500/15',  text: 'text-amber-400',  border: 'border-amber-500/30' },
  CROSS: { bg: 'bg-white/10',      text: 'text-white/60',   border: 'border-white/15' },
};

const STATUS_CONFIG = {
  live:          { icon: CheckCircle2, color: 'text-green-400',  label: 'Live' },
  built:         { icon: CheckCircle2, color: 'text-green-400',  label: 'Built' },
  live_mode:     { icon: CheckCircle2, color: 'text-green-400',  label: 'Live Mode' },
  connected:     { icon: CheckCircle2, color: 'text-green-400',  label: 'Connected' },
  planned:       { icon: Clock,        color: 'text-amber-400',  label: 'Planned' },
  pending:       { icon: Clock,        color: 'text-amber-400',  label: 'Pending' },
  pending_domain:{ icon: AlertTriangle,color: 'text-orange-400', label: 'Awaiting Domain' },
  whitelabel_mode:{ icon: RefreshCw,   color: 'text-blue-400',   label: 'Whitelabel Mode' },
  webhook_configured:{ icon: Zap,      color: 'text-violet-400', label: 'Webhook Active' },
};

function DomainBadge({ domain }) {
  const c = DOMAIN_COLORS[domain] || DOMAIN_COLORS.CROSS;
  return (
    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${c.bg} ${c.text} ${c.border}`}>
      {domain}
    </span>
  );
}

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.planned;
  const Icon = cfg.icon;
  return (
    <span className={`flex items-center gap-1 text-[10px] font-semibold ${cfg.color}`}>
      <Icon className="w-3 h-3" />{cfg.label}
    </span>
  );
}

function DomainCard({ key: dk, domain, data }) {
  const c = DOMAIN_COLORS[dk] || DOMAIN_COLORS.CROSS;
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl border p-5 ${c.bg} ${c.border}`}
    >
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className={`text-xs font-bold uppercase tracking-widest ${c.text}`}>{dk}</p>
          <p className="text-white font-semibold text-sm mt-0.5">{data.url}</p>
        </div>
        <StatusBadge status={data.status} />
      </div>
      <div className="flex flex-wrap gap-2 text-xs text-white/40">
        <span>Priority: <strong className="text-white/60">#{data.priority}</strong></span>
        <span>·</span>
        <span>{data.compliance}</span>
      </div>
    </motion.div>
  );
}

function SystemArchitectureInner() {
  const [activeTab, setActiveTab] = useState('deploy');

  const pagesByDomain = Object.entries(SNAPSHOT.pages).reduce((acc, [name, data]) => {
    const d = data.domain;
    if (!acc[d]) acc[d] = [];
    acc[d].push({ name, ...data });
    return acc;
  }, {});

  const totalPages = Object.keys(SNAPSHOT.pages).length;
  const builtPages = Object.values(SNAPSHOT.pages).filter(p => p.status === 'built').length;
  const liveIntegrations = Object.values(SNAPSHOT.integrations).filter(i => ['live', 'live_mode', 'connected'].includes(i.status)).length;
  const pendingActions = SNAPSHOT.action_items.length;

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white p-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center">
              <span className="text-white font-black text-sm">MR</span>
            </div>
            <div>
              <h1 className="text-2xl font-black text-white tracking-tight">System Architecture</h1>
              <p className="text-white/30 text-xs">God Mode Command Center · Snapshot {SNAPSHOT.snapshot_date} · v{SNAPSHOT.version}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 mt-4">
            {[
              { label: 'Pages Built', value: `${builtPages}/${totalPages}`, icon: Code2, color: 'text-green-400' },
              { label: 'Live Integrations', value: liveIntegrations, icon: Zap, color: 'text-blue-400' },
              { label: 'Domains Configured', value: 4, icon: Globe, color: 'text-green-400' },
              { label: 'Action Items', value: pendingActions, icon: AlertTriangle, color: 'text-amber-400' },
            ].map(stat => (
              <div key={stat.label} className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 flex items-center gap-3">
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
                <div>
                  <p className="text-white font-bold text-sm">{stat.value}</p>
                  <p className="text-white/30 text-[10px]">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-white/5 border border-white/10 rounded-xl p-1 mb-6 flex-wrap h-auto gap-1">
            <TabsTrigger value="deploy" className="rounded-lg text-xs text-white/50 data-[state=active]:text-white data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-300">
              <Rocket className="w-3.5 h-3.5 mr-1" />Deploy Domains
            </TabsTrigger>
            <TabsTrigger value="overview" className="rounded-lg text-xs text-white/50 data-[state=active]:text-white data-[state=active]:bg-white/10">
              <Globe className="w-3.5 h-3.5 mr-1" />Architecture
            </TabsTrigger>
            <TabsTrigger value="pages" className="rounded-lg text-xs text-white/50 data-[state=active]:text-white data-[state=active]:bg-white/10">
              <Code2 className="w-3.5 h-3.5 mr-1" />Pages
            </TabsTrigger>
            <TabsTrigger value="functions" className="rounded-lg text-xs text-white/50 data-[state=active]:text-white data-[state=active]:bg-white/10">
              <Zap className="w-3.5 h-3.5 mr-1" />Functions
            </TabsTrigger>
            <TabsTrigger value="entities" className="rounded-lg text-xs text-white/50 data-[state=active]:text-white data-[state=active]:bg-white/10">
              <Database className="w-3.5 h-3.5 mr-1" />Entities
            </TabsTrigger>
            <TabsTrigger value="agents" className="rounded-lg text-xs text-white/50 data-[state=active]:text-white data-[state=active]:bg-white/10">
              <Bot className="w-3.5 h-3.5 mr-1" />Agents
            </TabsTrigger>
            <TabsTrigger value="integrations" className="rounded-lg text-xs text-white/50 data-[state=active]:text-white data-[state=active]:bg-white/10">
              <Package className="w-3.5 h-3.5 mr-1" />Integrations
            </TabsTrigger>
            <TabsTrigger value="actions" className="rounded-lg text-xs text-white/50 data-[state=active]:text-white data-[state=active]:bg-white/10">
              <AlertTriangle className="w-3.5 h-3.5 mr-1" />Action Items
            </TabsTrigger>
          </TabsList>

          {/* DEPLOY TAB */}
          <TabsContent value="deploy">
            <DomainDeployPanel />
          </TabsContent>

          {/* DOMAINS TAB */}
          <TabsContent value="overview" className="space-y-4">
            <p className="text-white/40 text-xs mb-4">All MedRevolve domains and their deployment status. Provide domain names to configure DNS.</p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(SNAPSHOT.domains).map(([dk, data]) => (
                <DomainCard key={dk} domain={dk} data={data} />
              ))}
            </div>
            {/* Architecture Diagram */}
            <div className="mt-6 bg-white/[0.02] border border-white/8 rounded-2xl p-6">
              <h3 className="text-white font-bold mb-4 text-sm">Domain Architecture</h3>
              <div className="space-y-3 text-xs font-mono">
                {[
                  { domain: 'medrevolve.com', type: 'B2C', pages: '19 pages', note: 'GLP-1 Telehealth · HIPAA · LegitScript' },
                  { domain: 'medrevolveb2b.com', type: 'B2B', pages: '14 pages', note: 'Merchant Platform · White-Label · PEPMD' },
                  { domain: 'medrevolveruo.com', type: 'RUO', pages: '1 page', note: 'Research Only · Age Gate · FDA Disclaimer' },
                  { domain: 'medrevolvewater.com', type: 'WATER', pages: '0 pages', note: 'Wellness E-Commerce · Standard Only' },
                  { domain: 'admin.medrevolve.com', type: 'ADMIN', pages: '15 pages', note: 'God Mode · Analytics · Operations' },
                ].map(row => {
                  const c = DOMAIN_COLORS[row.type] || DOMAIN_COLORS.CROSS;
                  return (
                    <div key={row.domain} className="flex items-center gap-4 p-3 bg-white/[0.02] border border-white/8 rounded-xl">
                      <Globe className={`w-4 h-4 flex-shrink-0 ${c.text}`} />
                      <span className={`font-bold w-52 ${c.text}`}>{row.domain}</span>
                      <DomainBadge domain={row.type} />
                      <span className="text-white/40">{row.pages}</span>
                      <span className="text-white/25 text-[10px]">{row.note}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </TabsContent>

          {/* PAGES TAB */}
          <TabsContent value="pages" className="space-y-4">
            {['B2C', 'B2B', 'RUO', 'WATER', 'ADMIN'].map(domain => {
              const domainPages = pagesByDomain[domain] || [];
              if (!domainPages.length) return null;
              const c = DOMAIN_COLORS[domain] || DOMAIN_COLORS.CROSS;
              return (
                <div key={domain} className={`rounded-2xl border p-5 ${c.bg} ${c.border}`}>
                  <div className="flex items-center gap-3 mb-4">
                    <DomainBadge domain={domain} />
                    <span className="text-white/40 text-xs">{domainPages.length} pages</span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                    {domainPages.map(p => (
                      <div key={p.name} className="bg-black/30 border border-white/8 rounded-lg px-3 py-2">
                        <p className="text-white text-xs font-semibold">{p.name}</p>
                        <div className="flex items-center justify-between mt-1">
                          <StatusBadge status={p.status} />
                          <span className={`text-[9px] font-bold uppercase ${
                            p.priority === 'critical' ? 'text-red-400' :
                            p.priority === 'high' ? 'text-orange-400' :
                            p.priority === 'medium' ? 'text-yellow-400' : 'text-white/20'
                          }`}>{p.priority}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </TabsContent>

          {/* FUNCTIONS TAB */}
          <TabsContent value="functions">
            <div className="space-y-2">
              {Object.entries(SNAPSHOT.functions).map(([name, data]) => {
                const c = DOMAIN_COLORS[data.domain] || DOMAIN_COLORS.CROSS;
                return (
                  <div key={name} className="flex items-center gap-4 p-3 bg-white/[0.02] border border-white/8 rounded-xl hover:border-white/15 transition-colors">
                    <Zap className={`w-4 h-4 flex-shrink-0 ${c.text}`} />
                    <span className="text-white font-mono text-xs font-semibold w-64">{name}</span>
                    <DomainBadge domain={data.domain} />
                    <StatusBadge status={data.status} />
                    {data.deps?.length > 0 && (
                      <span className="text-white/25 text-[10px] ml-auto">deps: {data.deps.join(', ')}</span>
                    )}
                  </div>
                );
              })}
            </div>
          </TabsContent>

          {/* ENTITIES TAB */}
          <TabsContent value="entities">
            <div className="grid md:grid-cols-2 gap-2">
              {Object.entries(SNAPSHOT.entities).map(([name, data]) => {
                const c = DOMAIN_COLORS[data.domain] || DOMAIN_COLORS.CROSS;
                return (
                  <div key={name} className="flex items-center gap-3 p-3 bg-white/[0.02] border border-white/8 rounded-xl">
                    <Database className={`w-4 h-4 flex-shrink-0 ${c.text}`} />
                    <span className="text-white text-xs font-semibold flex-1">{name}</span>
                    <DomainBadge domain={data.domain} />
                    <StatusBadge status={data.status} />
                  </div>
                );
              })}
            </div>
          </TabsContent>

          {/* AGENTS TAB */}
          <TabsContent value="agents" className="space-y-3">
            {Object.entries(SNAPSHOT.agents).map(([name, data]) => {
              const c = DOMAIN_COLORS[data.domain] || DOMAIN_COLORS.CROSS;
              return (
                <div key={name} className={`flex items-center gap-4 p-4 rounded-2xl border ${c.bg} ${c.border}`}>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${c.bg} border ${c.border}`}>
                    <Bot className={`w-4 h-4 ${c.text}`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-semibold text-sm">{name.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</p>
                    <p className="text-white/30 text-xs font-mono">{data.file}</p>
                  </div>
                  <DomainBadge domain={data.domain} />
                  <StatusBadge status={data.status} />
                </div>
              );
            })}
          </TabsContent>

          {/* INTEGRATIONS TAB */}
          <TabsContent value="integrations" className="space-y-2">
            {Object.entries(SNAPSHOT.integrations).map(([name, data]) => (
              <div key={name} className="flex items-center gap-4 p-3 bg-white/[0.02] border border-white/8 rounded-xl hover:border-white/15 transition-colors">
                <Package className="w-4 h-4 flex-shrink-0 text-white/40" />
                <span className="text-white font-semibold text-xs w-36 capitalize">{name}</span>
                <StatusBadge status={data.status} />
                {data.secrets?.length > 0 && (
                  <span className="text-white/20 text-[10px] ml-auto font-mono">
                    <Shield className="w-3 h-3 inline mr-1" />{data.secrets.join(', ')}
                  </span>
                )}
                {data.connector && (
                  <span className="text-white/20 text-[10px] ml-auto">
                    <Zap className="w-3 h-3 inline mr-1" />connector:{data.connector}
                  </span>
                )}
                {data.notes && <span className="text-white/20 text-[10px] ml-auto">{data.notes}</span>}
              </div>
            ))}
          </TabsContent>

          {/* ACTION ITEMS TAB */}
          <TabsContent value="actions" className="space-y-3">
            <p className="text-white/40 text-xs">Complete these items in priority order to fully launch the MedRevolve ecosystem.</p>
            {SNAPSHOT.action_items.map(item => (
              <div key={item.priority} className="flex items-start gap-4 p-4 bg-white/[0.02] border border-white/8 rounded-xl hover:border-amber-500/30 transition-colors group">
                <div className="w-7 h-7 rounded-full bg-amber-500/15 border border-amber-500/30 flex items-center justify-center flex-shrink-0">
                  <span className="text-amber-400 text-xs font-bold">{item.priority}</span>
                </div>
                <p className="text-white/70 text-sm leading-relaxed group-hover:text-white transition-colors">{item.item}</p>
                <ArrowRight className="w-4 h-4 text-white/10 group-hover:text-amber-400 flex-shrink-0 mt-0.5 transition-colors" />
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default function SystemArchitecture() {
  return (
    <RequireAuth portalName="System Architecture" requiredRole="admin">
      <SystemArchitectureInner />
    </RequireAuth>
  );
}