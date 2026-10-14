import React from 'react';
import SEOHead from '@/components/SEOHead';
import PartnershipsHero from '@/components/partnerships/PartnershipsHero';
import PartnerOutcomes from '@/components/partnerships/PartnerOutcomes';
import MeasurableCommitments from '@/components/partnerships/MeasurableCommitments';
import PartnershipModels from '@/components/partnerships/PartnershipModels';
import EngagementPhases from '@/components/partnerships/EngagementPhases';
import ArchitectureDiagram from '@/components/partnerships/ArchitectureDiagram';
import PartnershipInquiryForm from '@/components/partnerships/PartnershipInquiryForm';
import PartnershipsFooterBand from '@/components/partnerships/PartnershipsFooterBand';

export default function Partnerships() {
  return (
    <div className="min-h-screen bg-[#F7F4ED]">
      <SEOHead
        title="Telehealth Partnership & White-Label Infrastructure | MedRevolve"
        description="Partner with MedRevolve for white-label telehealth and employer health infrastructure: EGWP and insurance channel pathways, 7-day implementation, AI intake and automation, real-time compliance monitoring, high-risk payment rails, and flexible partnership models."
      />

      <PartnershipsHero />
      <PartnerOutcomes />
      <MeasurableCommitments />
      <PartnershipModels />
      <EngagementPhases />
      <ArchitectureDiagram />
      <PartnershipInquiryForm />
      <PartnershipsFooterBand />

      {/* Compliance footnote */}
      <div className="bg-[#1F2D27] py-8 px-6 lg:px-12">
        <p className="max-w-5xl mx-auto text-white/40 text-xs leading-relaxed">
          MedRevolve Corporation is a Delaware C Corporation. This page is a business development overview and does not constitute an offer or medical advice.
        </p>
      </div>
    </div>
  );
}