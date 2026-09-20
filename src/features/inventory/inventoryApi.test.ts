import { describe, expect, it } from 'vitest';

import { INVENTORY_ITEMS } from './constants';
import { fetchInventory } from './inventoryApi';

/**
 * The typed client, tested where the mutation gate can see it.
 *
 * The component test drives this through the hook, but that is a .test.tsx
 * file and the mutation runner includes only .test.ts, so the gate reported
 * this module at zero. The function is small enough that the cost of covering
 * it directly is a few lines, and leaving a module at zero in a repository that
 * ships a mutation gate teaches the wrong lesson.
 */

describe('fetchInventory', () => {
  it('resolves the rows the application reports', async () => {
    await expect(fetchInventory()).resolves.toEqual(INVENTORY_ITEMS);
  });

  it('resolves every row rather than a subset', async () => {
    // An empty or truncated result would still be a resolved promise, and the
    // screen would render a plausible-looking warehouse with stock missing.
    await expect(fetchInventory()).resolves.toHaveLength(INVENTORY_ITEMS.length);
  });
});
