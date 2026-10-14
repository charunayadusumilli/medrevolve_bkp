import React from 'react';
import { ArrowRight, ArrowDown } from 'lucide-react';

const NODES = [
  'Patient Front End',
  'AI Intake Layer',
  'Clinical Workflow',
  'CRM / Automation Core',
  'Payment Rails',
  'Pharmacy Fulfillment',
  'Compliance Engine',
];

function Arrow() {
  return (
    <div className="flex items-center justify-center flex-shrink-0 py-1 md:py-0">
      <ArrowDown className="w-4 h-4 text-[#A66B3C] md:hidden" />
      <ArrowRight className="w-4 h-4 text-[#A66B3C] hidden md:block" />
    </div>
  );
}

export default function ArchitectureDiagram() {
  return (
    <section className="bg-[#1F2D27] py-24 px-6 lg:px-12">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12 max-w-3xl">
          <span className="text-[11px] font-black uppercase tracking-[0.25em] text-[#A66B3C]">AI-integrated architecture</span>
          <h2 className="text-3xl md:text-5xl font-black text-white mt-4" style={{ letterSpacing: '-0.02em' }}>
            One connected stack.
          </h2>
        </div>

        <div className="flex flex-col md:flex-row md:items-stretch gap-1 md:gap-0">
          {NODES.map((n, i) => (
            <React.Fragment key={n}>
              <div className="flex-1 min-w-0 bg-white/5 border border-white/10 px-4 py-5 md:py-6 flex flex-col gap-2">
                <span className="text-[10px] font-black text-[#A66B3C]">{String(i + 1).padStart(2, '0')}</span>
                <span className="text-white text-sm font-bold leading-snug">{n}</span>
              </div>
              {i < NODES.length - 1 && <Arrow />}
            </React.Fragment>
          ))}
        </div>

        <p className="text-white/45 text-sm mt-8 max-w-2xl">
          Reference architecture and full technical overview available on request — request the Partnership Pack below.
        </p>
      </div>
    </section>
  );
}