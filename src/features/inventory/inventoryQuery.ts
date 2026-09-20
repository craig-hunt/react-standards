import { SortColumn, SortDirection } from '../../shared/types';
import type { InventoryItem } from '../../shared/types';

/**
 * Filtering and ordering, as functions rather than as effects inside a screen.
 *
 * These carry the behavior a reader would question: whether the search is case
 * sensitive, whether a number sorts as a number or as text, and what a second
 * click on the same column does. Each is a mutation target; none needs a DOM.
 */

export function filterItems(
  items: readonly InventoryItem[],
  term: string
): readonly InventoryItem[] {
  const needle = term.trim().toLowerCase();
  return items.filter((item) => item.name.toLowerCase().includes(needle));
}

/**
 * Orders two rows on the chosen column.
 *
 * Quantity compares numerically. Compared as text, 12 sorts before 4, which
 * reads as sorted and is not.
 *
 * The column decides the comparison rather than the runtime type of the value.
 * Interrogating the value with typeof would say the same thing less directly,
 * and it would say it in a form the compiler cannot follow: TypeScript narrows
 * on `typeof x === 'number'` written as a literal, and not on a comparison
 * against a named constant. Branching on the column keeps both the narrowing
 * and the constants discipline, instead of trading one for the other.
 */
export function compareItems(
  left: InventoryItem,
  right: InventoryItem,
  column: SortColumn,
  direction: SortDirection
): number {
  const result =
    column === SortColumn.Quantity
      ? left.quantity - right.quantity
      : String(left[column]).localeCompare(String(right[column]));

  return direction === SortDirection.Ascending ? result : -result;
}

export function sortItems(
  items: readonly InventoryItem[],
  column: SortColumn,
  direction: SortDirection
): readonly InventoryItem[] {
  return [...items].sort((left, right) => compareItems(left, right, column, direction));
}

/**
 * What clicking a column header does next.
 *
 * Clicking the active column reverses it; clicking a different one starts that
 * column ascending rather than inheriting the previous direction, which would
 * present a descending list to someone who just asked for a new sort.
 */
export function nextSort(
  current: SortColumn,
  direction: SortDirection,
  clicked: SortColumn
): { readonly column: SortColumn; readonly direction: SortDirection } {
  if (current !== clicked) {
    return { column: clicked, direction: SortDirection.Ascending };
  }

  return {
    column: current,
    direction:
      direction === SortDirection.Ascending ? SortDirection.Descending : SortDirection.Ascending,
  };
}

export function visibleItems(
  items: readonly InventoryItem[],
  term: string,
  column: SortColumn,
  direction: SortDirection
): readonly InventoryItem[] {
  return sortItems(filterItems(items, term), column, direction);
}
