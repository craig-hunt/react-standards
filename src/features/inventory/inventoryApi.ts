import { INVENTORY_ITEMS } from './constants';
import type { InventoryItem } from '../../shared/types';

/**
 * The typed client the inventory hook calls.
 *
 * This reference holds its rows in memory, so the function resolves immediately
 * rather than reaching a network. The seam is what matters: the hook above it
 * calls an async, typed function and would not change if this body became a
 * fetch. A component calling `fetch` directly has no such seam, which is why
 * the standard puts the call here and the caching in a hook.
 *
 * The return type is the domain type rather than a response shape, so a change
 * of transport cannot leak a wire format into the screens.
 */
export function fetchInventory(): Promise<readonly InventoryItem[]> {
  return Promise.resolve(INVENTORY_ITEMS);
}
