/**
 * Agent locations — the backend Agent Location Master, one option per PIN
 * code. The mobile app uses the same endpoint, so both show the same list;
 * admin additions appear on the next load (no redeploy).
 *
 *   GET /locations/agent-groups?q=&zone=
 *
 * Selection values are labels "<primary> - <pincode>" (the same text the
 * backend reports for covered groups in GET /broker/plan `localities`).
 * toPlanChoice() converts them to the stable group ids the server stores.
 */
'use client';

import { useCallback, useEffect, useState } from 'react';
import { apiGet } from '@/lib/api/client';

export const AGENT_ZONES = ['North Chennai', 'Central Chennai', 'South Chennai'] as const;
export type AgentZone = (typeof AGENT_ZONES)[number];

export type AgentLocationGroup = {
  /** null for legacy catalogue items (server without the location master). */
  id: number | null;
  legacy?: boolean;
  pincode: string;
  primary_name: string;
  zone: AgentZone | null;
  localities: string[];
  locality_count: number;
  display_name: string;
};

const CACHE_MS = 60_000;
let cache: { at: number; items: AgentLocationGroup[] | null } = { at: 0, items: null };

export const groupLabel = (g: Pick<AgentLocationGroup, 'primary_name' | 'pincode' | 'legacy'>) =>
  g.legacy ? g.primary_name : `${g.primary_name} - ${g.pincode}`;

// Servers without the Agent Location Master (not yet deployed) still serve
// the older locality catalogue: one option per locality, chosen by name.
async function fetchLegacyCatalogue(): Promise<AgentLocationGroup[]> {
  const data = await apiGet<{ items?: { name: string; pincodes?: string[] }[] }>('/broker/locality-catalog', undefined, false);
  return (data?.items || []).map((i) => ({
    id: null,
    legacy: true,
    pincode: (i.pincodes || []).join(', '),
    primary_name: i.name,
    zone: null,
    localities: [i.name],
    locality_count: 1,
    display_name: i.name,
  }));
}

export async function fetchAgentLocationGroups(force = false): Promise<AgentLocationGroup[]> {
  if (!force && cache.items && Date.now() - cache.at < CACHE_MS) return cache.items;
  let items: AgentLocationGroup[];
  try {
    const data = await apiGet<{ items?: AgentLocationGroup[] }>('/locations/agent-groups', undefined, false);
    items = Array.isArray(data?.items) ? data.items : [];
  } catch (e) {
    if (!(e instanceof Error) || (e as { status?: number }).status !== 404) throw e;
    items = await fetchLegacyCatalogue();
  }
  cache = { at: Date.now(), items };
  return items;
}

/** Search across PIN code, primary name and every associated locality. */
export function filterAgentGroups(items: AgentLocationGroup[], query: string, zone?: string | null) {
  const q = query.trim().toLowerCase();
  const key = q.replace(/[^a-z0-9]/g, '');
  return items.filter((g) => {
    if (zone && zone !== 'All' && g.zone !== zone) return false;
    if (!q) return true;
    if (g.pincode.includes(q) || g.primary_name.toLowerCase().includes(q)) return true;
    return g.localities.some((n) => {
      const low = n.toLowerCase();
      return low.includes(q) || (!!key && low.replace(/[^a-z0-9]/g, '').includes(key));
    });
  });
}

/** Labels -> { group_ids, localities } (unknown labels stay names). */
export async function toPlanChoice(labels: string[]) {
  let items: AgentLocationGroup[] = [];
  try {
    items = await fetchAgentLocationGroups();
  } catch {
    items = [];
  }
  const byLabel = new Map(items.filter((g) => g.id != null).map((g) => [groupLabel(g), g.id as number]));
  const group_ids: number[] = [];
  const localities: string[] = [];
  for (const l of labels) {
    const id = byLabel.get(l);
    if (id != null) group_ids.push(id);
    else localities.push(l);
  }
  return { group_ids, localities };
}

/** React hook: the groups, a load state and a retry. Refetches on mount. */
export function useAgentLocationGroups() {
  const [items, setItems] = useState<AgentLocationGroup[]>([]);
  const [state, setState] = useState<'loading' | 'ok' | 'error'>('loading');
  const load = useCallback(() => {
    setState('loading');
    fetchAgentLocationGroups(true)
      .then((list) => {
        setItems(list);
        setState('ok');
      })
      .catch(() => setState('error'));
  }, []);
  useEffect(() => {
    load();
  }, [load]);
  return { items, state, reload: load };
}
