/**
 * DomainDeployPanel
 * Shows all 4 live domains, their domain-specific pages/functions,
 * DNS setup instructions, and a "pre-publish checklist" per domain.
 */
import React, { useState } from 'react';
import { SNAPSHOT } from '@/lib/snapshot';
import { PAGE_DOMAIN_MAP, FUNCTION_DOMAIN_MAP } from '@/lib/domainConfig';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Globe, CheckCircle2, Clock, AlertTriangle, ChevronDown,
  ChevronUp, Copy, ExternalLink, Zap, Code2, Shield, Info
} from 'lucide-react';

const DOMAIN_COLORS = {
  B2C:   { bg: 'bg-green-500/10',  text: 'text-green-400',  border: 'border-green-500/25',  accent: '#4ade80' },
  B2B:   { bg: 'bg-blue-500/10',   text: 'text-blue-400',   border: 'border-blue-500/25',   accent: '#60a5fa' },
  RUO:   { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/25', accent: '#c084fc' },
  WATER: { bg: 'bg-cyan-500/10',   text: 'text-cyan-400',   border: 'border-cyan-500/25',   accent: '#22d3ee' },
};

const DOMAIN_META = {
  B2C:   { label: 'Consumer Telehealth', emoji: '🏥', url: 'medrevolve.com',          home: '/',               compliance: ['HIPAA', 'LegitScript Required', 'Telehealth Consent'] },
  B2B:   { label: 'Merchant Platform',   emoji: '🏢', url: 'medrevolveb2b.com',        home: '/ForBusiness',    compliance: ['B2B SaaS', 'White-Label', 'Partner Agreements'] },
  RUO:   { label: 'Research Catalog',    emoji: '🔬', url: 'medrevolveruo.com',        home: '/ResearchProducts', compliance: ['RUO FDA Disclaimer', 'Age Gate Required', 'No Rx Claims'] },
  WATER: { label: 'Wellness Products',   emoji: '💧', url: 'medrevolvewater.com',      home: '/WaterHome',      compliance: ['Standard Ecommerce', 'FTC Guidelines'] },
};

function CopyBtn({ text }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <button onClick={copy} className="ml-2 text-white/30 hover:text-white/70 transition-colors">
      {copied ? <CheckCircle2 className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
    </button>
  );
}

function DomainCard({ domainKey }) {
  const [expanded, setExpanded] = useState(false);
  const c = DOMAIN_COLORS[domainKey];
  const meta = DOMAIN_META[domainKey];
  const snapshotData = SNAPSHOT.domains[domainKey];

  // Pages for this domain
  const domainPages = Object.entries(PAGE_DOMAIN_MAP)
    .filter(([, domains]) => domains.includes(domainKey))
    .map(([page]) => page);

  // Functions for this domain
  const domainFunctions = FUNCTION_DOMAIN_MAP[domainKey] || [];

  // Pages from snapshot
  const builtPages = Object.entries(SNAPSHOT.pages)
    .filter(([, data]) => data.domain === domainKey && data.status === 'built')
    .map(([name]) => name);

  const plannedPages = Object.entries(SNAPSHOT.pages)
    .filter(([, data]) => data.domain === domainKey && data.status === 'planned')
    .map(([name]) => name);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl border ${c.bg} ${c.border} overflow-hidden`}
    >
      {/* Header */}
      <div className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl border ${c.border} bg-black/20`}>
              {meta.emoji}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className={`font-bold text-sm ${c.text}`}>{meta.label}</p>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${c.bg} ${c.text} ${c.border}`}>{domainKey}</span>
              </div>
              <a
                href={`https://${meta.url}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/50 text-xs hover:text-white flex items-center gap-1 mt-0.5"
              >
                {meta.url} <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {snapshotData?.status === 'live' ? (
              <span className="flex items-center gap-1 text-[11px] text-green-400 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" /> Live
              </span>
            ) : (
              <span className="flex items-center gap-1 text-[11px] text-amber-400 font-semibold">
                <Clock className="w-3.5 h-3.5" /> Awaiting DNS
              </span>
            )}
          </div>
        </div>

        {/* Quick stats */}
        <div className="flex gap-4 mt-4 text-xs">
          <div>
            <p className="text-white/30">Pages Built</p>
            <p className={`font-bold ${c.text}`}>{builtPages.length}</p>
          </div>
          <div>
            <p className="text-white/30">Pages Planned</p>
            <p className="font-bold text-amber-400">{plannedPages.length}</p>
          </div>
          <div>
            <p className="text-white/30">Functions</p>
            <p className={`font-bold ${c.text}`}>{domainFunctions.length}</p>
          </div>
          <div>
            <p className="text-white/30">Homepage</p>
            <p className="font-bold text-white/60 font-mono text-[11px]">{meta.home}</p>
          </div>
        </div>

        {/* Compliance tags */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {meta.compliance.map(tag => (
            <span key={tag} className="text-[10px] px-2 py-0.5 bg-black/30 border border-white/10 rounded-full text-white/40">
              <Shield className="w-2.5 h-2.5 inline mr-1" />{tag}
            </span>
          ))}
        </div>

        <button
          onClick={() => setExpanded(v => !v)}
          className={`mt-4 w-full flex items-center justify-between text-xs font-semibold ${c.text} hover:opacity-80 transition-opacity`}
        >
          <span>View DNS Setup & Pages</span>
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Expandable Detail */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="border-t border-white/8 p-5 space-y-5 bg-black/20">

              {/* DNS Instructions */}
              <div>
                <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-3 flex items-center gap-2">
                  <Globe className="w-3.5 h-3.5" /> DNS Configuration
                </p>
                <div className="bg-black/40 border border-white/8 rounded-xl p-4 font-mono text-xs space-y-2">
                  <p className="text-white/30 text-[10px] mb-2">Add this to your GoDaddy DNS panel for <strong className={c.text}>{meta.url}</strong>:</p>
                  <div className="flex items-center gap-2">
                    <span className="text-white/40 w-16">Type:</span>
                    <span className="text-white">CNAME</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-white/40 w-16">Name:</span>
                    <span className="text-white">@</span>
                    <span className="text-white/30 text-[10px]">(or www)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-white/40 w-16">Value:</span>
                    <span className={c.text}>[Your Base44 Published App URL]</span>
                    <CopyBtn text="[Your Base44 Published App URL]" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-white/40 w-16">TTL:</span>
                    <span className="text-white">3600</span>
                  </div>
                  <div className="mt-3 pt-3 border-t border-white/8 flex items-start gap-2 text-[10px] text-amber-300/70">
                    <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
                    <span>After DNS propagates, this domain auto-detects and serves the <strong>{domainKey}</strong> experience — correct homepage, nav, SEO, and compliance for this brand.</span>
                  </div>
                </div>
              </div>

              {/* Built Pages */}
              {builtPages.length > 0 && (
                <div>
                  <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Code2 className="w-3.5 h-3.5" /> Built Pages ({builtPages.length})
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {builtPages.map(p => (
                      <span key={p} className="flex items-center gap-1 text-[11px] bg-green-500/10 border border-green-500/20 text-green-300 px-2 py-1 rounded-lg font-mono">
                        <CheckCircle2 className="w-2.5 h-2.5" /> {p}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Planned Pages */}
              {plannedPages.length > 0 && (
                <div>
                  <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5" /> Planned Pages ({plannedPages.length})
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {plannedPages.map(p => (
                      <span key={p} className="flex items-center gap-1 text-[11px] bg-amber-500/10 border border-amber-500/20 text-amber-300 px-2 py-1 rounded-lg font-mono">
                        <Clock className="w-2.5 h-2.5" /> {p}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Functions */}
              {domainFunctions.length > 0 && (
                <div>
                  <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Zap className="w-3.5 h-3.5" /> Backend Functions ({domainFunctions.length})
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {domainFunctions.map(fn => (
                      <span key={fn} className={`text-[11px] border ${c.border} ${c.text} px-2 py-1 rounded-lg font-mono bg-black/20`}>
                        {fn}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function DomainDeployPanel() {
  return (
    <div className="space-y-4">
      {/* How Publishing Works */}
      <div className="bg-amber-500/10 border border-amber-500/25 rounded-2xl p-5">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-amber-300 font-bold text-sm mb-1">How Multi-Domain Publishing Works</p>
            <p className="text-white/50 text-xs leading-relaxed">
              Base44 publishes <strong className="text-white/70">one app URL</strong>. You point all 4 domains at that same URL via DNS (CNAME records in GoDaddy). 
              The app then auto-detects which domain the visitor came from using <code className="bg-white/10 px-1 rounded text-amber-200">detectDomain()</code> and automatically serves the correct homepage, navigation, SEO meta tags, and compliance pages for that brand.
              <br /><br />
              <strong className="text-white/70">Step 1:</strong> Publish the app in Base44 → copy the published URL.<br />
              <strong className="text-white/70">Step 2:</strong> Add a CNAME record for each of the 4 domains pointing to that URL.<br />
              <strong className="text-white/70">Step 3:</strong> DNS propagates (1–48h) → each domain shows its own experience automatically.
            </p>
          </div>
        </div>
      </div>

      {/* Domain Cards */}
      {['B2C', 'B2B', 'RUO', 'WATER'].map(dk => (
        <DomainCard key={dk} domainKey={dk} />
      ))}
    </div>
  );
}