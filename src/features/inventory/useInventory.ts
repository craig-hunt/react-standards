import { useQuery } from '@tanstack/react-query';
import type { UseQueryResult } from '@tanstack/react-query';

import { fetchInventory } from './inventoryApi';
import { QueryKey } from '../../shared/constants';
import type { InventoryItem } from '../../shared/types';

/**
 * Reading is a hook's job, not a screen's.
 *
 * The screen receives rows and renders them. It does not know whether they were
 * cached, refetched, or read from memory, which is what lets the transport
 * change without touching a component.
 *
 * The key comes from a constant because TanStack Query matches keys
 * structurally. Two hooks writing the same key inline look identical and
 * invalidate independently, so one screen keeps showing what the data no longer
 * says. That failure is silent, which is exactly why it deserves a constant.
 */
export function useInventory(): UseQueryResult<readonly InventoryItem[]> {
  return useQuery({
    queryKey: QueryKey.Inventory,
    queryFn: fetchInventory,
  });
}
