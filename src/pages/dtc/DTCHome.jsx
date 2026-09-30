import React from 'react';
import HeroV2 from '@/components/dtc/v2/HeroV2';
import GoalTiles from '@/components/dtc/v2/GoalTiles';
import StepsStrip from '@/components/dtc/v2/StepsStrip';
import UGCReel from '@/components/dtc/v2/UGCReel';
import ProductSpotlight from '@/components/dtc/v2/ProductSpotlight';
import ClosingCTA from '@/components/dtc/v2/ClosingCTA';

export default function DTCHome() {
  return (
    <div className="font-body">
      <HeroV2 />
      <GoalTiles />
      <StepsStrip />
      <UGCReel />
      <ProductSpotlight />
      <ClosingCTA />
    </div>
  );
}