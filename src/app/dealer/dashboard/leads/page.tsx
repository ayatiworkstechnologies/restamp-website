"use client";

import DealerSpaceView from '@/components/dealer/DealerSpaceTabs';
import SalesLeads from '@/components/dealer/views/SalesLeads';
import SpaceLeads from '@/components/dealer/views/SpaceLeads';

export default function DealerLeadsPage() {
  return <DealerSpaceView sales={<SalesLeads />} space={<SpaceLeads />} />;
}
