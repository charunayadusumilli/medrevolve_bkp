import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Zap, Target, TrendingUp, CheckCircle2, XCircle, Loader2, Instagram, Mail, FileSpreadsheet, ExternalLink } from 'lucide-react';

const SERVICES = [
  { key: 'telehealth', name: 'Telehealth Platform', type: 'Static', emoji: '🩺', audience: 'Patients seeking virtual care' },
  { key: 'glp1', name: 'GLP-1 Weight Loss', type: 'Static', emoji: '⚖️', audience: 'Weight loss seekers' },
  { key: 'mens_health', name: "Men's Health", type: 'Static', emoji: '💪', audience: 'Men 35-65' },
  { key: 'womens_health', name: "Women's Health", type: 'Static', emoji: '🌸', audience: 'Women 30-55' },
  { key: 'longevity', name: 'Longevity & Anti-Aging', type: 'Static', emoji: '⚡', audience: 'Biohackers 40-65' },
  { key: 'white_label', name: 'White Label B2B', type: 'Static', emoji: '🏢', audience: 'Clinic & spa owners' },
  { key: 'pharmacy', name: 'Compounding Pharmacy', type: 'Static', emoji: '💊', audience: 'Medication seekers' },
  { key: 'ugc_testimonial', name: 'Patient Success UGC', type: 'UGC', emoji: '🌟', audience: 'Social proof seekers' },
  { key: 'ugc_provider', name: 'Provider Testimonial UGC', type: 'UGC', emoji: '👨‍⚕️', audience: 'Healthcare providers' },
  { key: 'ugc_merchant', name: 'Merchant Success UGC', type: 'UGC', emoji: '📈', audience: 'Business owners' },
];

export default function GodModeAds() {
  const [selected, setSelected] = useState(SERVICES.map(s => s.key));
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [postToIG, setPostToIG] = useState(true);
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailResult, setEmailResult] = useState(null);
  const [emailError, setEmailError] = useState(null);

  const launchEmailSheets = async () => {
    setEmailLoading(true);
    setEmailError(null);
    setEmailResult(null);
    try {
      const res = await base44.functions.invoke('godModeEmailSheets', { create_drafts: true });
      setEmailResult(res.data);
    } catch (e) {
      setEmailError(e.message || 'Email/Sheets launch failed');
    }
    setEmailLoading(false);
  };

  const toggle = (key) => setSelected(prev =>
    prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
  );

  const launch = async () => {
    setLoading(true);
    setError(null);
    setResults(null);
    try {
      const res = await base44.functions.invoke('godModeAdCampaign', {
        service_keys: selected,
        post_to_instagram: postToIG,
        dry_run: false
      });
      setResults(res.data);
    } catch (e) {
      setError(e.message || 'Campaign failed');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 md:p-10">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500/10 border border-yellow-500/30 rounded-full mb-4">
            <Zap className="w-4 h-4 text-yellow-400" />
            <span className="text-yellow-400 text-sm font-bold tracking-widest uppercase">God Mode Activated</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-3">Ad Campaign Engine</h1>
          <p className="text-white/50 text-lg">AI-generated static + UGC ads for every service — all linked to <span className="text-[#4A6741] font-semibold">medrevolve.com</span></p>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Services', value: SERVICES.length },
            { label: 'Selected', value: selected.length },
            { label: 'Destination', value: 'medrevolve.com' },
          ].map(({ label, value }) => (
            <div key={label} className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
              <Target className="w-5 h-5 text-[#4A6741] mx-auto mb-1" />
              <div className="text-xl font-black">{value}</div>
              <div className="text-white/40 text-xs uppercase tracking-wider">{label}</div>
            </div>
          ))}
        </div>

        {/* Service Grid */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white/80">Select Ad Campaigns</h2>
            <div className="flex gap-2">
              <button onClick={() => setSelected(SERVICES.map(s => s.key))} className="text-xs text-[#4A6741] hover:underline">Select All</button>
              <span className="text-white/20">|</span>
              <button onClick={() => setSelected([])} className="text-xs text-white/40 hover:underline">Clear</button>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {SERVICES.map(s => {
              const isSelected = selected.includes(s.key);
              return (
                <button
                  key={s.key}
                  onClick={() => toggle(s.key)}
                  className={`flex items-center gap-4 p-4 rounded-2xl border text-left transition-all ${
                    isSelected
                      ? 'bg-[#4A6741]/20 border-[#4A6741]/60 shadow-lg shadow-[#4A6741]/10'
                      : 'bg-white/3 border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="text-2xl">{s.emoji}</div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm flex items-center gap-2">
                      {s.name}
                      <Badge className={`text-[9px] px-2 py-0 ${s.type === 'UGC' ? 'bg-purple-500/20 text-purple-400 border-purple-500/30' : 'bg-blue-500/20 text-blue-400 border-blue-500/30'}`}>
                        {s.type}
                      </Badge>
                    </div>
                    <div className="text-white/40 text-xs mt-0.5">🎯 {s.audience}</div>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${isSelected ? 'bg-[#4A6741] border-[#4A6741]' : 'border-white/20'}`}>
                    {isSelected && <CheckCircle2 className="w-3 h-3 text-white" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Options */}
        <div className="flex items-center gap-4 mb-8 p-4 bg-white/5 rounded-2xl border border-white/10">
          <Instagram className="w-5 h-5 text-pink-400" />
          <div className="flex-1">
            <div className="text-sm font-semibold">Post to Instagram</div>
            <div className="text-xs text-white/40">Publish all ads directly to your connected Instagram business account</div>
          </div>
          <button
            onClick={() => setPostToIG(!postToIG)}
            className={`w-12 h-6 rounded-full transition-all relative ${postToIG ? 'bg-[#4A6741]' : 'bg-white/20'}`}
          >
            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${postToIG ? 'left-7' : 'left-1'}`} />
          </button>
        </div>

        {/* Email + Sheets God Mode */}
        <div className="mb-8 p-5 bg-gradient-to-r from-green-900/30 to-blue-900/20 border border-green-500/30 rounded-2xl">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Mail className="w-4 h-4 text-green-400" />
                <FileSpreadsheet className="w-4 h-4 text-blue-400" />
                <span className="text-white font-bold text-sm">Gmail Drafts + Google Sheets</span>
              </div>
              <p className="text-white/50 text-xs max-w-sm">
                Creates a Google Sheet with all campaign links + UTMs, then generates 9 Gmail draft emails (one per segment) — each with the sheet link embedded. Review & send from Gmail.
              </p>
            </div>
            <button
              onClick={launchEmailSheets}
              disabled={emailLoading}
              className="flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all disabled:opacity-40"
              style={{ background: emailLoading ? '#1a1a1a' : 'linear-gradient(135deg, #0f9d58, #1a73e8)' }}
            >
              {emailLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4 text-yellow-300" />}
              {emailLoading ? 'Creating Sheet & Drafts...' : '⚡ Launch Email God Mode'}
            </button>
          </div>

          {emailError && (
            <div className="mt-3 p-3 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-2">
              <XCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <p className="text-red-400 text-xs">{emailError}</p>
            </div>
          )}

          {emailResult && (
            <div className="mt-4 p-4 bg-black/30 rounded-xl space-y-3">
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Campaigns in Sheet', value: emailResult.campaigns_in_sheet, color: 'text-blue-400' },
                  { label: 'Gmail Drafts Created', value: emailResult.drafts_created, color: 'text-green-400' },
                  { label: 'Links Logged', value: emailResult.links_in_sheet, color: 'text-yellow-400' },
                ].map(({ label, value, color }) => (
                  <div key={label} className="text-center">
                    <div className={`text-2xl font-black ${color}`}>{value}</div>
                    <div className="text-white/40 text-xs">{label}</div>
                  </div>
                ))}
              </div>
              <a
                href={emailResult.spreadsheet_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-[#0f9d58]/20 border border-[#0f9d58]/40 text-green-400 text-sm font-bold hover:bg-[#0f9d58]/30 transition-all"
              >
                <FileSpreadsheet className="w-4 h-4" />
                Open Google Sheet →
              </a>
              <p className="text-white/40 text-xs text-center">Check your Gmail Drafts folder — {emailResult.drafts_created} emails ready to review & send</p>
            </div>
          )}
        </div>

        {/* UTM info */}
        <div className="mb-8 p-4 bg-blue-500/5 border border-blue-500/20 rounded-2xl">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-blue-400" />
            <span className="text-blue-400 text-sm font-semibold">Every Ad Links Back to medrevolve.com with UTM Tracking</span>
          </div>
          <div className="text-xs text-white/40 font-mono">
            medrevolve.com?utm_source=instagram&utm_medium=paid_social&utm_campaign=[service]
          </div>
        </div>

        {/* Launch Button */}
        <button
          onClick={launch}
          disabled={loading || selected.length === 0}
          className="w-full py-5 rounded-2xl font-black text-lg tracking-wide transition-all disabled:opacity-40 flex items-center justify-center gap-3"
          style={{ background: loading ? '#1a1a1a' : 'linear-gradient(135deg, #4A6741, #6B8F5E)' }}
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Generating & Posting {selected.length} Ads — This takes ~{Math.ceil(selected.length * 15)}s...
            </>
          ) : (
            <>
              <Zap className="w-5 h-5 text-yellow-300" />
              LAUNCH {selected.length} AD{selected.length !== 1 ? 'S' : ''} — GOD MODE
            </>
          )}
        </button>

        {/* Error */}
        {error && (
          <div className="mt-6 p-4 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-center gap-3">
            <XCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Results */}
        {results && (
          <div className="mt-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              {[
                { label: 'Total Created', value: results.summary.total_ads_created, color: 'text-white' },
                { label: 'Published to IG', value: results.summary.published_to_instagram, color: 'text-green-400' },
                { label: 'Static Ads', value: results.summary.static_ads, color: 'text-blue-400' },
                { label: 'UGC Ads', value: results.summary.ugc_ads, color: 'text-purple-400' },
              ].map(({ label, value, color }) => (
                <div key={label} className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
                  <div className={`text-2xl font-black ${color}`}>{value}</div>
                  <div className="text-white/40 text-xs">{label}</div>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              {results.results.map((r, i) => (
                <div key={i} className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-2xl">
                  {r.image_url && (
                    <img src={r.image_url} alt={r.service} className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-sm">{r.service}</span>
                      <Badge className="text-[9px]">{r.type}</Badge>
                      {r.instagram?.success && <Badge className="text-[9px] bg-green-500/20 text-green-400 border-green-500/30">✓ Posted to IG</Badge>}
                      {r.instagram?.success === false && <Badge className="text-[9px] bg-red-500/20 text-red-400 border-red-500/30">IG Failed</Badge>}
                    </div>
                    <div className="text-white/40 text-xs mt-1 truncate">🎯 {r.target_audience}</div>
                    <a href={r.utm_link} target="_blank" rel="noopener noreferrer" className="text-[#4A6741] text-xs hover:underline truncate block mt-1">{r.utm_link}</a>
                  </div>
                  {r.instagram?.post_id && (
                    <a href={`https://instagram.com/p/${r.instagram.post_id}`} target="_blank" rel="noopener noreferrer" className="flex-shrink-0">
                      <Instagram className="w-5 h-5 text-pink-400 hover:text-pink-300" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}