import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { ExternalLink, Search, CheckCircle2, XCircle, AlertCircle, ChevronDown, ChevronUp, Trophy, Filter } from 'lucide-react';

// ── ALL COMPANIES FROM NOEL'S EMAIL LIST ─────────────────────────────────────
const ALL_COMPANIES = [
  // ── PLATFORMS / WHITE-LABEL INFRASTRUCTURE ──────────────────────────────
  { name: 'MedRevolve',            url: 'https://medrevolve.com',                      category: 'Platform / B2B SaaS',          ls: true,  notes: 'OUR PLATFORM — all-in-one B2B SaaS for GLP-1, peptide & telehealth merchants. Website builder, compliance, payments, inventory, university, pharmacy, telehealth under one roof.', highlight: true },
  { name: 'Beluga Health',         url: 'https://belugahealth.com',                    category: 'Platform / White-Label',        ls: true,  notes: 'White-label telehealth API. Physician network, pharmacy fulfillment. LegitScript certified. No merchant tools, no inventory, no education.' },
  { name: 'OpenLoop Health',       url: 'https://openloophealth.com',                  category: 'Platform / White-Label',        ls: false, notes: 'Enterprise white-label telehealth. 20k clinicians, 30+ specialties. Built for hospitals & health systems, NOT small wellness operators.' },
  { name: 'WellSync',              url: 'https://wellsync.com',                        category: 'Platform / White-Label',        ls: true,  notes: 'White-label virtual care for pharmacies, DTC companies, labs. Powered Vitamin Shoppe\'s telehealth. LEGIT SCRIPT CERTIFIED.' },
  { name: 'Qualiphy',              url: 'https://qualiphy.me',                         category: 'Platform / White-Label',        ls: true,  notes: 'On-demand good faith exams & telemedicine for med spas/clinics. $27.99/consult. GLP-1, IV therapy, fillers. LEGIT SCRIPT CERTIFIED.' },
  { name: 'DrCare247',             url: 'https://www.drcare247.com',                   category: 'Platform / White-Label',        ls: false, notes: 'WHITE LABEL TELEMED PLATFORM. Turnkey GLP-1 telehealth for businesses.' },
  { name: 'OlaDigital Health',     url: 'https://oladigital.health',                   category: 'Platform / White-Label',        ls: false, notes: 'WILL WHITE-LABEL PEPTIDES AND THE WHOLE INFRASTRUCTURE TO GET STARTED. Per Noel.' },
  { name: 'JoinClinicX',           url: 'https://www.joinclinicx.com',                 category: 'Platform / White-Label',        ls: false, notes: 'THEY SET UP CLINICS — GLP-1. Per Noel.' },
  { name: 'UpScriptHealth',        url: 'https://upscripthealth.com',                  category: 'Platform / White-Label',        ls: true,  notes: '20-year veteran telemedicine. Partners with AbbVie, Pfizer, Merck. Built for big pharma, not independent operators.' },

  // ── DTC TELEHEALTH / GLP-1 PROVIDERS ────────────────────────────────────
  { name: 'Ro.co',                 url: 'https://ro.co',                               category: 'DTC Telehealth',                ls: true,  notes: 'Major DTC telehealth platform. GLP-1, men\'s & women\'s health. LS CERTIFIED.' },
  { name: 'SkinnyRx',              url: 'https://skinnyrx.com',                        category: 'DTC Telehealth',                ls: true,  notes: 'Weight loss / GLP-1 telehealth. LS CERTIFIED.' },
  { name: 'TrimRx',                url: 'https://trimrx.com',                          category: 'DTC Telehealth',                ls: true,  notes: 'GLP-1 weight loss. LS CERTIFIED.' },
  { name: 'VitaBella',             url: 'https://vitabella.com',                       category: 'DTC Telehealth',                ls: true,  notes: 'LS CERTIFIED — SELLS TRT — GLP1 — VIAGRA & PEPTIDES. Per Noel.' },
  { name: 'Valhalla Vitality',     url: 'https://valhallavitality.com',                category: 'DTC Telehealth',                ls: false, notes: 'Telehealth, GLP-1, TRT, peptides. No LS listed.' },
  { name: 'iVIM Health',           url: 'https://www.ivimhealth.com',                  category: 'DTC Telehealth',                ls: true,  notes: 'LS CERTIFIED. DTC telehealth platform.' },
  { name: 'JoinAmble',             url: 'https://www.joinamble.com',                   category: 'DTC Telehealth',                ls: true,  notes: 'LS CERTIFIED.' },
  { name: 'JoinFridays',           url: 'https://www.joinfridays.com',                 category: 'DTC Telehealth',                ls: true,  notes: 'LS CERTIFIED.' },
  { name: 'TryEden',               url: 'https://www.tryeden.com',                     category: 'DTC Telehealth',                ls: true,  notes: 'LS CERTIFIED.' },
  { name: 'TryShed',               url: 'https://www.tryshed.com',                     category: 'DTC Telehealth',                ls: true,  notes: 'LS CERTIFIED.' },
  { name: 'NewSelf',               url: 'https://www.newself.com',                     category: 'DTC Telehealth',                ls: true,  notes: 'LS CERTIFIED.' },
  { name: 'EveryMeds',             url: 'https://www.everymeds.com',                   category: 'DTC Telehealth',                ls: true,  notes: 'LS CERTIFIED.' },
  { name: 'DollarDadClub',         url: 'https://dollardadclub.com',                   category: 'DTC Telehealth',                ls: true,  notes: 'LS CERTIFIED.' },
  { name: 'GoodLifeMeds',          url: 'https://www.goodlifemeds.com',                category: 'DTC Telehealth',                ls: true,  notes: 'LS CERTIFIED.' },
  { name: 'BrellöHealth',          url: 'https://www.brellohealth.com',                category: 'DTC Telehealth',                ls: true,  notes: 'LS CERTIFIED.' },
  { name: 'JoinBliv',              url: 'https://joinbliv.com/get-a-glp-1-prescription', category: 'DTC Telehealth',             ls: false, notes: 'GLP-1 prescription service. NO LS SCRIPT LISTED. Per Noel.' },
  { name: 'DirectMeds',            url: 'https://directmeds.com',                      category: 'DTC Telehealth',                ls: true,  notes: 'LS CERTIFIED.' },
  { name: 'MedVI',                 url: 'https://medvi.org',                           category: 'DTC Telehealth',                ls: true,  notes: 'LS CERTIFIED.' },
  { name: 'FH.co',                 url: 'https://landing.fh.co',                       category: 'DTC Telehealth',                ls: true,  notes: 'LS CERTIFIED.' },
  { name: 'MaleMD',                url: 'https://malemd.com',                          category: 'DTC Telehealth',                ls: false, notes: 'Men\'s health telehealth.' },
  { name: 'LowTCenter',            url: 'https://lowtcenter.com',                      category: 'DTC Telehealth',                ls: false, notes: 'TRT / testosterone telehealth.' },
  { name: 'Transcend Company',     url: 'https://transcendcompany.com',                category: 'DTC Telehealth',                ls: false, notes: 'THIS IS A "SUPPLEMENT" SOLD AS PROBIOTIC CAPSULES. Per Noel.' },
  { name: 'Treated.com',           url: 'https://www.treated.com',                     category: 'DTC Telehealth',                ls: false, notes: 'Online prescription service.' },
  { name: 'Defy Medical',          url: 'https://www.defymedical.com',                 category: 'DTC Telehealth',                ls: false, notes: 'GOT TRI-MIX FROM THEM — THEY OFFER KETAMINE TOO. Per Noel.' },
  { name: 'LifeMed Institute',     url: 'https://lifemedinstitute.com',                category: 'DTC Telehealth',                ls: false, notes: 'PROB OFFERS GLP-1. Per Noel.' },
  { name: 'Thrive Colorado',       url: 'https://thrivecolorado.com',                  category: 'DTC Telehealth',                ls: false, notes: 'Wellness / hormone / peptide clinic.' },
  { name: 'SynerGenX',             url: 'https://synergenxhealth.com',                 category: 'DTC Telehealth',                ls: false, notes: 'Hormone & TRT clinic chain.' },
  { name: 'Wittmer Rejuvenation',  url: 'https://wittmerrejuvenationclinic.com',        category: 'DTC Telehealth',                ls: false, notes: 'NO LS SCRIPT LISTED. Per Noel.' },
  { name: 'Skinny Formularies',    url: 'https://skinny-formularies.com',              category: 'DTC Telehealth',                ls: false, notes: 'GLP-1 / weight loss formularies.' },
  { name: 'Levo Health',           url: 'https://levohealth.com',                      category: 'DTC Telehealth',                ls: false, notes: 'THEY MARKET AND SEND CLIENTS TO CLINICS. Per Noel.' },
  { name: 'VitaStir',              url: 'https://www.vitastir.com',                    category: 'DTC Telehealth',                ls: false, notes: 'Wellness / IV / injection services.' },
  { name: 'Relive Hendersonville', url: 'https://relivehendersonville.com',            category: 'DTC Telehealth',                ls: false, notes: 'Wellness clinic.' },
  { name: 'PatientNearMe WLP',     url: 'https://wlp.patientnearme.com/step1',         category: 'DTC Telehealth',                ls: false, notes: 'Weight loss program / GLP-1 access.' },

  // ── RESEARCH PEPTIDE ONLY (RUO) ──────────────────────────────────────────
  { name: 'PuraPeptides',          url: 'https://purapeptides.com',                    category: 'Research Peptides (RUO)',       ls: false, notes: 'Research peptide vendor.' },
  { name: 'PrimeLab Peptides',     url: 'https://primelabpeptides.com',                category: 'Research Peptides (RUO)',       ls: false, notes: 'Research peptide vendor.' },
  { name: 'Umbrella Labs',         url: 'https://umbrellalabs.is',                     category: 'Research Peptides (RUO)',       ls: false, notes: 'Research peptide vendor.' },
  { name: 'Vertex Peptides',       url: 'https://vertexpeptides.com',                  category: 'Research Peptides (RUO)',       ls: false, notes: 'Research peptide vendor.' },
  { name: 'Oath Peptides',         url: 'https://oathpeptides.com/shop',               category: 'Research Peptides (RUO)',       ls: false, notes: 'RESEARCH ONLY — SELLS BPC-157. Per Noel.' },
  { name: 'Iron Peptides',         url: 'https://ironpeptides.com',                    category: 'Research Peptides (RUO)',       ls: false, notes: 'RESEARCH ONLY — SELLS BPC-157. Per Noel.' },
  { name: 'Dragon Peptides',       url: 'https://dragon-peptides.com',                 category: 'Research Peptides (RUO)',       ls: false, notes: 'RESEARCH ONLY — SELLS BPC-157. Per Noel.' },
  { name: 'PharmaGrade Peptides',  url: 'https://pharmagradepeptides.is',              category: 'Research Peptides (RUO)',       ls: false, notes: 'RESEARCH ONLY — SELLS BPC-157 — ACCEPTS CREDIT CARDS. Per Noel.' },
  { name: 'SimplePeptide',         url: 'https://simplepeptide.com',                   category: 'Research Peptides (RUO)',       ls: false, notes: 'RESEARCH ONLY — SELLS BPC-157. Per Noel.' },
  { name: 'Rebel Peptides',        url: 'https://www.rebelpeptides.com',               category: 'Research Peptides (RUO)',       ls: false, notes: 'DOES NOT MENTION RESEARCH OR LIST BPC-157. Per Noel.' },
  { name: 'Alpha Omega Peptide',   url: 'https://alphaomegapeptide.com',               category: 'Research Peptides (RUO)',       ls: false, notes: 'RESEARCH. Per Noel.' },
  { name: 'Core Peptides',         url: 'https://www.corepeptides.com',                category: 'Research Peptides (RUO)',       ls: false, notes: 'Research peptide vendor.' },

  // ── PHARMACIES / COMPOUNDING ─────────────────────────────────────────────
  { name: 'AmeriPharma Specialty', url: 'https://ameripharmaspecialty.com',            category: 'Pharmacy / Compounding',        ls: false, notes: 'Specialty/compounding pharmacy. Per Noel.' },
  { name: 'NuCare API',            url: 'https://nucareapi.com',                       category: 'Pharmacy / Compounding',        ls: false, notes: 'THIS LOOKS LIKE A WHOLESALER TO COMPOUNDING PHARMACIES. Per Noel.' },
  { name: 'Wedgewood Pharmacy',    url: 'https://www.wedgewood.com',                   category: 'Pharmacy / Compounding',        ls: false, notes: 'PHARMACY. Per Noel.' },
  { name: 'Promise Pharmacy',      url: 'https://promisepharmacy.com',                 category: 'Pharmacy / Compounding',        ls: false, notes: '600+ CLIENTS. Per Noel.' },
  { name: 'Lake Hills Rx',         url: 'https://www.lakehillsrx.com',                 category: 'Pharmacy / Compounding',        ls: true,  notes: 'LS CERTIFIED pharmacy.' },
  { name: 'Health Warehouse',      url: 'https://www.healthwarehouse.com',             category: 'Pharmacy / Compounding',        ls: false, notes: 'THIS IS A PHARMACY? Per Noel.' },
  { name: 'DRS Labs',              url: 'https://drslabs.shop',                        category: 'Pharmacy / Compounding',        ls: false, notes: 'Compounding lab.' },

  // ── PAYMENT PROCESSING ───────────────────────────────────────────────────
  { name: 'AllayPay',              url: 'https://allaypay.com/industries/peptides-merchant-services', category: 'Payment Processing', ls: false, notes: 'WEBSITE SAYS RESEARCH PEPTIDES OK / KRATOM / CANNABIS / ADULT / DELTA 8. Per Noel.' },
  { name: 'PaymentServers.com',    url: 'https://paymentservers.com/services/peptides-research-compound-services', category: 'Payment Processing', ls: false, notes: 'CLAIMS TO DO RESEARCH PEPTIDES. Per Noel.' },

  // ── LEGAL / COMPLIANCE ───────────────────────────────────────────────────
  { name: 'ByrdAdatto',            url: 'https://byrdadatto.com',                      category: 'Legal / Compliance',            ls: false, notes: 'Healthcare law firm for medical spa / telehealth compliance.' },
  { name: 'American Peptide Co.',  url: 'https://americanpeptide.co/pages/membership', category: 'Legal / Compliance',            ls: false, notes: 'PEPTIDE ASSOCIATION — MIGHT BENEFIT FROM MEMBERSHIP. Per Noel.' },

  // ── CLINICS / WELLNESS CENTERS ───────────────────────────────────────────
  { name: 'MedLaunch US',          url: 'https://medlaunchus.com',                     category: 'Clinic / Wellness',             ls: false, notes: 'Medical practice launch support.' },
  { name: 'Compass Total Wellness', url: 'https://www.compasstotalwellness.com',       category: 'Clinic / Wellness',             ls: false, notes: 'Wellness clinic.' },
  { name: 'Boss Gal Beauty Bar',   url: 'https://www.bossgalbeautybar.com',            category: 'Clinic / Wellness',             ls: false, notes: 'Med spa / beauty bar.' },
  { name: 'Allison Best Art',      url: 'https://www.allisonbestart.com',              category: 'Clinic / Wellness',             ls: false, notes: 'Wellness / aesthetic.' },
  { name: 'MedFit Health',         url: 'https://www.medfit.health',                   category: 'Clinic / Wellness',             ls: false, notes: 'PROB MORE OF A NUTRA COMPANY. Per Noel.' },
];

const CATEGORIES = ['All', 'Platform / B2B SaaS', 'Platform / White-Label', 'DTC Telehealth', 'Research Peptides (RUO)', 'Pharmacy / Compounding', 'Payment Processing', 'Legal / Compliance', 'Clinic / Wellness'];

const categoryColors = {
  'Platform / B2B SaaS':    'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  'Platform / White-Label': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  'DTC Telehealth':         'bg-purple-500/20 text-purple-300 border-purple-500/30',
  'Research Peptides (RUO)':'bg-orange-500/20 text-orange-300 border-orange-500/30',
  'Pharmacy / Compounding': 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
  'Payment Processing':     'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  'Legal / Compliance':     'bg-red-500/20 text-red-300 border-red-500/30',
  'Clinic / Wellness':      'bg-pink-500/20 text-pink-300 border-pink-500/30',
};

export default function CompetitorIntelligence() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [lsFilter, setLsFilter] = useState('all'); // 'all' | 'yes' | 'no'
  const [expandedCard, setExpandedCard] = useState(null);

  const filtered = ALL_COMPANIES.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.notes.toLowerCase().includes(search.toLowerCase()) ||
      c.url.toLowerCase().includes(search.toLowerCase());
    const matchCat = activeCategory === 'All' || c.category === activeCategory;
    const matchLS = lsFilter === 'all' || (lsFilter === 'yes' ? c.ls : !c.ls);
    return matchSearch && matchCat && matchLS;
  });

  const counts = CATEGORIES.reduce((acc, cat) => {
    acc[cat] = cat === 'All' ? ALL_COMPANIES.length : ALL_COMPANIES.filter(c => c.category === cat).length;
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-[#080808] text-white">
      {/* Header */}
      <div className="border-b border-white/8 bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <p className="text-xs font-bold uppercase tracking-widest text-[#6B8F5E] mb-2">Market Intelligence</p>
          <h1 className="text-3xl font-black text-white tracking-tight mb-1">Competitor Intelligence Map</h1>
          <p className="text-white/40 text-sm">GLP-1 / Peptide / Telehealth Landscape · {ALL_COMPANIES.length} companies · Source: Noel Ciambotti (Card Group Intl) · May 2026</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">

        {/* Win banner */}
        <div className="bg-[#4A6741]/20 border border-[#6B8F5E]/30 rounded-xl p-4 mb-6 flex items-start gap-3">
          <Trophy className="w-5 h-5 text-[#6B8F5E] mt-0.5 flex-shrink-0" />
          <p className="text-sm text-white/70">
            <span className="text-[#8FB88F] font-bold">MedRevolve is the only B2B SaaS platform in this entire list</span> that combines website builder + telehealth + pharmacy + compliance + payments + inventory + university certifications under one roof. Every other company does 1-2 things. We do everything.
          </p>
        </div>

        {/* Filters row */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="relative flex-shrink-0 w-full lg:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <Input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search companies or notes..."
              className="bg-white/5 border-white/10 text-white placeholder:text-white/25 pl-9"
            />
          </div>

          {/* LS filter */}
          <div className="flex rounded-lg overflow-hidden border border-white/10 flex-shrink-0">
            {[['all', 'All'], ['yes', '✓ LegitScript'], ['no', '✗ No LS']].map(([val, label]) => (
              <button
                key={val}
                onClick={() => setLsFilter(val)}
                className={`px-4 py-2 text-xs font-bold whitespace-nowrap transition-colors ${lsFilter === val ? 'bg-white text-black' : 'text-white/50 hover:text-white'}`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="text-xs text-white/30 self-center ml-auto">
            Showing {filtered.length} of {ALL_COMPANIES.length}
          </div>
        </div>

        {/* Category tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`text-xs px-3 py-1.5 rounded-full border font-semibold transition-all ${
                activeCategory === cat
                  ? 'bg-white text-black border-white'
                  : 'border-white/10 text-white/40 hover:text-white hover:border-white/30'
              }`}
            >
              {cat} <span className="opacity-60 ml-1">({counts[cat]})</span>
            </button>
          ))}
        </div>

        {/* Company list */}
        <div className="space-y-2">
          {filtered.map((company) => {
            const isExpanded = expandedCard === company.name;
            const isUs = company.highlight;

            return (
              <div
                key={company.name}
                className={`rounded-xl border transition-all ${
                  isUs
                    ? 'border-[#6B8F5E]/60 bg-[#4A6741]/10'
                    : 'border-white/8 bg-[#111] hover:border-white/15'
                }`}
              >
                <div
                  className="flex items-start gap-4 p-4 cursor-pointer"
                  onClick={() => setExpandedCard(isExpanded ? null : company.name)}
                >
                  {/* Left */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className={`text-sm font-black ${isUs ? 'text-[#8FB88F]' : 'text-white'}`}>
                        {company.name}
                      </span>
                      {isUs && <span className="text-[10px] font-bold bg-[#4A6741] text-white px-2 py-0.5 rounded-full">← US</span>}
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${categoryColors[company.category] || 'bg-white/5 text-white/40 border-white/10'}`}>
                        {company.category}
                      </span>
                      {company.ls
                        ? <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">✓ LegitScript</span>
                        : <span className="text-[10px] text-white/25 bg-white/5 border border-white/8 px-2 py-0.5 rounded-full">No LS</span>
                      }
                    </div>
                    <p className="text-xs text-white/40 truncate">{company.notes}</p>
                  </div>

                  {/* Right */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <a
                      href={company.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white/25 hover:text-white transition-colors"
                      onClick={e => e.stopPropagation()}
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-white/30" /> : <ChevronDown className="w-4 h-4 text-white/30" />}
                  </div>
                </div>

                {isExpanded && (
                  <div className="border-t border-white/8 px-4 pb-4 pt-3 grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-white/25 mb-1.5">Noel's Notes</p>
                      <p className="text-sm text-white/60 leading-relaxed">{company.notes}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-white/25 mb-1.5">URL</p>
                      <a href={company.url} target="_blank" rel="noopener noreferrer"
                        className="text-sm text-blue-400 hover:text-blue-300 break-all flex items-center gap-1.5">
                        {company.url} <ExternalLink className="w-3 h-3 flex-shrink-0" />
                      </a>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div className="text-center py-16 text-white/25">No companies match your filters.</div>
          )}
        </div>

        <div className="mt-6 text-xs text-white/20 text-right">
          Source: Noel Ciambotti (Card Group Intl) — forwarded Feb/Mar 2026 · {ALL_COMPANIES.length} total companies tracked
        </div>
      </div>
    </div>
  );
}