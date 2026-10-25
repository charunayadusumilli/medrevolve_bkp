import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Stethoscope, Sparkles, Pill, Rocket } from 'lucide-react';

// Four segments we build for. Each card routes to the section of this page that
// explains it, or to the existing landing page for that audience.

const SEGMENTS = [
  {
    icon: Stethoscope,
    title: 'Clinics',
    line: 'Add a new revenue line without new hires',
    href: '#storefront',
  },
  {
    icon: Sparkles,
    title: 'Med spas',
    line: 'Sell programs under your own brand, we run the back office',
    to: '/for-med-spas',
  },
  {
    icon: Pill,
    title: 'Pharmacies',
    line: 'Grow volume through white-label storefronts',
    href: '#pharmacy',
  },
  {
    icon: Rocket,
    title: 'Founders',
    line: 'Launch a telehealth brand in about 7 days, no build team needed',
    to: '/ForCreators',
  },
];

const CARD = 'group bg-white rounded-2xl border border-[#E3DCD0] p-6 flex flex-col hover:shadow-lg hover:border-[#A66B3C]/40 transition-all';

export default function WhoWeServe() {
  return (
    <section id="who-we-serve" className="py-20 px-6 lg:px-8 bg-[#F7F4ED]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-xs font-bold uppercase tracking-widest text-[#A66B3C] mb-3">Who we serve</p>
          <h2 className="text-4xl md:text-5xl font-light text-[#1F2D27] mb-4">
            One platform. <span className="font-semibold">Four ways to grow.</span>
          </h2>
          <p className="text-[#3A453E] text-lg max-w-2xl mx-auto">
            We run the infrastructure behind your brand, whichever part of the business you already own.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {SEGMENTS.map(({ icon: Icon, title, line, href, to }) => {
            const inner = (
              <>
                <div className="w-11 h-11 rounded-xl bg-[#1F2D27] flex items-center justify-center mb-5">
                  <Icon className="w-5 h-5 text-[#F7F4ED]" />
                </div>
                <h3 className="text-lg font-semibold text-[#1F2D27] mb-2">{title}</h3>
                <p className="text-[#3A453E] text-sm leading-relaxed flex-1">{line}</p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#A66B3C]">
                  See how <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </>
            );
            return to
              ? <Link key={title} to={to} className={CARD}>{inner}</Link>
              : <a key={title} href={href} className={CARD}>{inner}</a>;
          })}
        </div>
      </div>
    </section>
  );
}