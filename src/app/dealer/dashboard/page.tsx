"use client";

import DealerSpaceView from '@/components/dealer/DealerSpaceTabs';
import SalesDashboard from '@/components/dealer/views/SalesDashboard';
import SpaceDashboard from '@/components/dealer/views/SpaceDashboard';

export default function DealerDashboardPage() {
  return <DealerSpaceView sales={<SalesDashboard />} space={<SpaceDashboard />} />;
}
