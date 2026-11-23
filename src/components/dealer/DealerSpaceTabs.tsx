"use client";

// Dealer segmented tabs, as in the Restamp app: Sales Hub (owner properties
// and buyer leads in the dealer's areas) and My Property (the dealer's own
// listings, run on the owner listing system).
import { Suspense, type ReactNode } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Briefcase, Building2, type LucideIcon } from 'lucide-react';

export type DealerSpace = 'sales' | 'space';

const TABS: { key: DealerSpace; label: string; Icon: LucideIcon }[] = [
  { key: 'sales', label: 'Sales Hub', Icon: Briefcase },
  { key: 'space', label: 'My Property', Icon: Building2 },
];

export function useDealerSpace(): DealerSpace {
  return useSearchParams().get('space') === 'space' ? 'space' : 'sales';
}

function Tabs() {
  const value = useDealerSpace();
  const router = useRouter();
  const pathname = usePathname();
  return (
    <div role="tablist" aria-label="Dealer workspace" className="flex w-full max-w-md rounded-full bg-slate-100 p-1">
      {TABS.map(({ key, label, Icon }) => {
        const on = value === key;
        return (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={on}
            onClick={() => router.replace(key === 'sales' ? pathname : `${pathname}?space=space`, { scroll: false })}
            className={`flex flex-1 items-center justify-center gap-2 rounded-full px-2 py-1.5 text-[13px] font-semibold transition cursor-pointer ${
              on ? 'bg-white text-[#087ed9] shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <span className={`flex h-[30px] w-[30px] items-center justify-center rounded-full ${on ? 'bg-[#E8EDFB]' : 'bg-slate-200'}`}>
              <Icon size={16} strokeWidth={1.8} />
            </span>
            {label}
          </button>
        );
      })}
    </div>
  );
}

function Switch({ sales, space }: { sales: ReactNode; space: ReactNode }) {
  const value = useDealerSpace();
  return (
    <div className="space-y-5">
      <Tabs />
      {value === 'space' ? space : sales}
    </div>
  );
}

/** Renders the Sales Hub / My Property tabs above whichever side is selected (?space=space). */
export default function DealerSpaceView(props: { sales: ReactNode; space: ReactNode }) {
  return (
    <Suspense fallback={null}>
      <Switch {...props} />
    </Suspense>
  );
}
