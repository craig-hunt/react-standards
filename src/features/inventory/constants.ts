import { StockStatus } from '../../shared/types';
import type { InventoryItem } from '../../shared/types';

// The stock this application reports.
//
// The sibling suites assert on these names, quantities, and the ordering they
// produce, so the rows are a fixture shared across repositories rather than
// sample data anyone may edit freely.

export const INVENTORY_ITEMS: readonly InventoryItem[] = [
  { name: 'Access badge', quantity: 240, status: StockStatus.InStock },
  { name: 'Docking station', quantity: 12, status: StockStatus.Low },
  { name: 'Laptop sleeve', quantity: 0, status: StockStatus.OutOfStock },
  { name: 'Monitor arm', quantity: 58, status: StockStatus.InStock },
  { name: 'Noise-cancelling headset', quantity: 4, status: StockStatus.Low },
  { name: 'Webcam', quantity: 31, status: StockStatus.InStock },
] as const;
