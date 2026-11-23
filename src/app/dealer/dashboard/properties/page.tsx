"use client";

import DealerSpaceView from '@/components/dealer/DealerSpaceTabs';
import SalesProperties from '@/components/dealer/views/SalesProperties';
import SpaceProperties from '@/components/dealer/views/SpaceProperties';

export default function DealerPropertiesPage() {
  return <DealerSpaceView sales={<SalesProperties />} space={<SpaceProperties />} />;
}
