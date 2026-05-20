import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Droplets, ShieldCheck, FlaskConical, Building2, ChevronRight, ExternalLink } from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// medrevolve.com PRODUCTS PAGE — COMPLIANCE NOTICE
//
// Per FDA / LegitScript / Mastercard compliance requirements:
//   • This page ONLY displays Bacteriostatic Water (ancillary supply)
//   • NO GLP-1 compounds (Semaglutide, Tirzepatide, etc.) on this page
//   • NO RUO peptides (BPC-157, CJC-1295, TB-500, etc.) on this page
//   • GLP-1 Rx products are available to merchants on their white-label sites
//   • RUO products are on a SEPARATE domain with appropriate disclaimers
//   • Cross-contamination between RUO and consumer/GLP sites = compliance failure
// ─────────────────────────────────────────────────────────────────────────────

export default function Products() {
  const [waterQty, setWaterQty] = useState(1);

  return (
    <div className="min-h-screen bg-[#FDFBF7]">

      {/* ── Compliance Banner ───────────────────────────────────────────── */}
      <div className="bg-[#1a1a1a] text-white/60 text-xs text-center py-2.5 px-4 leading-relaxed">
        <span className="font-semibold text-white/80">Notice:</span> MedRevolve.com supplies ancillary pharmaceutical-grade products.
        Prescription treatments are available exclusively through licensed merchant partner sites.
        All Rx compounds require physician consultation and valid prescription from a licensed provider.
      </div>

      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <section className="pt-14 pb-10 px-6 lg:px-8 bg-[#FDFBF7]">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-[#4A6741] mb-3">Pharmaceutical Supply</p>
            <h1 className="text-3xl md:text-5xl font-light text-[#1a1a1a] mb-4 tracking-tight">
              Pharmaceutical-Grade.<br/>
              <span className="font-semibold">Hospital-Standard Supply.</span>
            </h1>
            <p className="text-sm md:text-base text-[#666666] max-w-2xl mx-auto">
              MedRevolve supplies USP-grade bacteriostatic water to licensed healthcare facilities, 
              compounding pharmacies, research institutions, and B2B partners. 
              All product sourced from FDA-registered manufacturers.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Bacteriostatic Water — Main Product ─────────────────────────── */}
      <section className="py-12 px-6 lg:px-8 bg-white border-t border-gray-100">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-start">

            {/* Visual */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center justify-center bg-[#EEF5F0] rounded-3xl p-12 aspect-square"
            >
              <div className="text-center">
                <div className="w-24 h-24 rounded-full bg-[#4A6741]/10 flex items-center justify-center mx-auto mb-4">
                  <Droplets className="w-12 h-12 text-[#4A6741]" />
                </div>
                <div className="text-sm font-bold text-[#4A6741] uppercase tracking-widest">USP Grade</div>
                <div className="text-xs text-[#666666] mt-1">0.9% Benzyl Alcohol · Sterile Water for Injection</div>
                <div className="mt-4 inline-flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-[#4A6741]/20 text-xs text-[#4A6741] font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" /> FDA-Registered Manufacturer
                </div>
              </div>
            </motion.div>

            {/* Info */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#4A6741] mb-2">B2B / Wholesale Supply</p>
              <h2 className="text-2xl md:text-3xl font-semibold text-[#1a1a1a] mb-3">Bacteriostatic Water for Injection</h2>
              <p className="text-sm text-[#888888] mb-1 font-medium">Sterile Water with 0.9% Benzyl Alcohol (Bacteriostatic)</p>
              <p className="text-sm text-[#666666] leading-relaxed mb-6">
                USP-grade bacteriostatic water used for dilution and reconstitution of parenteral medications.
                Supplied to licensed pharmacies, compounding facilities, and healthcare institutions. 
                Sourced from FDA-registered manufacturers (equivalent to Hospira/Pfizer-grade specifications).
              </p>

              <div className="space-y-2.5 mb-6">
                {[
                  'USP-grade sterile water with 0.9% benzyl alcohol',
                  'Supplied in multi-dose vials (30mL)',
                  'COA (Certificate of Analysis) included with every batch',
                  'FDA-registered manufacturer, GMP certified',
                  'National shipping — licensed facilities only',
                  'Available in case quantities for B2B partners',
                ].map((b, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-sm text-[#2D3A2D]">
                    <div className="w-4 h-4 rounded-full bg-[#D4E5D7] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-[#4A6741] text-[9px] font-bold">✓</span>
                    </div>
                    {b}
                  </div>
                ))}
              </div>

              <div className="bg-[#F9F7F4] border border-gray-200 rounded-xl p-4 mb-6 text-xs text-[#666666] leading-relaxed">
                <span className="font-semibold text-[#1a1a1a]">For Licensed Institutions:</span> Pricing available upon verification of facility license, 
                DEA registration (if applicable), and NPI number. Contact our B2B supply team for wholesale pricing and bulk orders.
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link to={createPageUrl('Contact')}>
                  <Button className="bg-[#1A2A1A] hover:bg-[#2D3A2D] text-white rounded-sm px-6 font-semibold w-full sm:w-auto">
                    Request B2B Pricing
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Link to={createPageUrl('ForBusiness')}>
                  <Button variant="outline" className="border-[#4A6741]/30 text-[#4A6741] hover:bg-[#4A6741] hover:text-white rounded-sm w-full sm:w-auto">
                    Merchant Partnership Info
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Specs / Compliance ──────────────────────────────────────────── */}
      <section className="py-12 px-6 lg:px-8 bg-[#F5F0E8]">
        <div className="max-w-5xl mx-auto">
          <h3 className="text-xs font-bold uppercase tracking-widest text-[#4A6741] mb-6 text-center">Product Specifications & Compliance</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { label: 'USP <797>', desc: 'Meets United States Pharmacopeia compounding standards for sterile preparations', icon: ShieldCheck },
              { label: 'GMP Certified', desc: 'Manufactured under Current Good Manufacturing Practice regulations (cGMP)', icon: Building2 },
              { label: 'COA Provided', desc: 'Full Certificate of Analysis with every shipment — identity, purity, and sterility testing', icon: FlaskConical },
            ].map((spec, i) => (
              <div key={i} className="bg-white rounded-xl p-5 border border-gray-100">
                <spec.icon className="w-6 h-6 text-[#4A6741] mb-3" />
                <div className="font-semibold text-[#1a1a1a] text-sm mb-1">{spec.label}</div>
                <div className="text-xs text-[#666666] leading-relaxed">{spec.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Merchant White-Label Products — B2B Service Pitch ───────────── */}
      <section className="py-16 px-6 lg:px-8 bg-[#0A0A0A] text-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-[#8FB88F] mb-3">For Licensed Merchants</p>
            <h2 className="text-2xl md:text-3xl font-light text-white mb-4">
              Full Rx Product Catalog — <span className="font-semibold">Under Your Brand</span>
            </h2>
            <p className="text-sm text-white/50 max-w-2xl mx-auto">
              MedRevolve provides compliant GLP-1 weight management, hormone optimization, and longevity 
              protocols to licensed B2B merchants through our white-label platform. Each merchant site 
              operates independently with its own LegitScript certification, payment processing, and 
              licensed pharmacy integrations.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-8">
            {[
              {
                title: 'GLP-1 Weight Management',
                description: 'Compounded Semaglutide and Tirzepatide protocols, prescribed by board-certified physicians, dispensed through licensed 503A/503B pharmacies.',
                tag: 'Rx Required',
                tagColor: 'text-green-400',
                note: 'Available on merchant white-label sites only. Requires LegitScript certification.',
              },
              {
                title: 'Hormone Optimization',
                description: 'TRT (Testosterone Replacement Therapy), bioidentical HRT (Estradiol/Progesterone), thyroid optimization — all physician-prescribed.',
                tag: 'Rx Required',
                tagColor: 'text-blue-400',
                note: 'Available on merchant white-label sites only. Requires physician consultation.',
              },
              {
                title: 'Men\'s Health Protocols',
                description: 'Compounded Sildenafil, Tadalafil, and combination protocols — prescribed by licensed providers and dispensed through partner pharmacies.',
                tag: 'Rx Required',
                tagColor: 'text-purple-400',
                note: 'Available on merchant white-label sites only.',
              },
              {
                title: 'Longevity & Wellness',
                description: 'Physician-prescribed compounded protocols including NAD+, Sermorelin, Glutathione, and B12/MIC — through licensed partner pharmacies.',
                tag: 'Rx Required',
                tagColor: 'text-yellow-400',
                note: 'Available on merchant white-label sites only.',
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-white/[0.04] border border-white/10 rounded-xl p-5"
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-white text-sm">{item.title}</h4>
                  <span className={`text-[10px] font-bold ${item.tagColor}`}>{item.tag}</span>
                </div>
                <p className="text-sm text-white/50 leading-relaxed mb-3">{item.description}</p>
                <p className="text-[10px] text-white/25 border-t border-white/8 pt-2">{item.note}</p>
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <p className="text-xs text-white/30 mb-4">
              All Rx products are exclusively available through licensed merchant partner sites — not directly on medrevolve.com.
              Each merchant undergoes compliance verification before accessing the product catalog.
            </p>
            <Link to={createPageUrl('MerchantOnboarding')}>
              <Button className="bg-white text-black hover:bg-white/90 rounded-sm px-8 font-bold">
                Become a Licensed Merchant Partner
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── RUO Separation Notice ────────────────────────────────────────── */}
      <section className="py-10 px-6 lg:px-8 bg-[#111] border-t border-white/8">
        <div className="max-w-5xl mx-auto">
          <div className="bg-amber-500/8 border border-amber-500/20 rounded-xl p-5 flex gap-4 items-start">
            <FlaskConical className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-sm font-semibold text-amber-300 mb-1">Research Use Only (RUO) Products</div>
              <p className="text-xs text-white/40 leading-relaxed">
                Research-use-only peptides and compounds (BPC-157, CJC-1295, TB-500, GHK-Cu, etc.) are 
                <strong className="text-white/60"> not listed on this site</strong> and are maintained on a 
                completely separate domain in full compliance with FDA guidelines. These products are labeled 
                "For Research Use Only — Not for Human or Veterinary Use" and are sold exclusively to 
                licensed research facilities. MedRevolve strictly enforces separation between RUO and 
                consumer/Rx product sites.
              </p>
              <p className="text-[10px] text-white/25 mt-2">
                Per FDA guidance and LegitScript requirements: RUO compounds must never appear on the same domain 
                as consumer-facing or prescription products.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}