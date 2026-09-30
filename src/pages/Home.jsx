import React from 'react';
import ResumeSetupBanner from '@/components/home/ResumeSetupBanner';
import PositioningStrip from '@/components/home/PositioningStrip';
import EditorialHero from '@/components/home/editorial/EditorialHero';
import EditorialMetrics from '@/components/home/editorial/EditorialMetrics';
import EditorialWhoFor from '@/components/home/editorial/EditorialWhoFor';
import EditorialJourney from '@/components/home/editorial/EditorialJourney';
import EditorialDemo from '@/components/home/editorial/EditorialDemo';
import EditorialUniversity from '@/components/home/editorial/EditorialUniversity';
import EditorialFinalCTA from '@/components/home/editorial/EditorialFinalCTA';
import EntrepreneurWizard from '@/components/home/editorial/EntrepreneurWizard';
import { CheckCircle } from 'lucide-react';

const TRUST_POINTS = [
  'HIPAA Compliant Platform',
  'LegitScript Support',
  'Licensed Providers — All 50 States',
  'Licensed 503A Pharmacy Partners',
  'Stripe Payment Processing',
  'No Drug Names Advertised',
];

export default function Home() {
  return (
    <div className="bg-[#F9F7F2]">
      <ResumeSetupBanner />
      <PositioningStrip />
      <EditorialHero />
      <EditorialMetrics />
      <EditorialWhoFor />
      <EditorialJourney />
      <EditorialDemo />
      <EditorialUniversity />
      <EditorialFinalCTA />
      <EntrepreneurWizard />

      {/* Compliance strip */}
      <section className="py-8 px-6 bg-[#F9F7F2] border-t border-stone-200">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {TRUST_POINTS.map(b => (
            <span key={b} className="flex items-center gap-1.5 text-xs font-semibold text-stone-500">
              <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" /> {b}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}