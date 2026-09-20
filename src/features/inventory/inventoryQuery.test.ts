import { describe, expect, it } from 'vitest';

import { INVENTORY_ITEMS } from './constants';
import { compareItems, filterItems, nextSort, sortItems, visibleItems } from './inventoryQuery';
import { SortColumn, SortDirection } from '../../shared/types';

const TOTAL_ITEMS = 6;
const NO_MATCHES = 0;
const SEARCH_TERM = 'do';
const SEARCH_MATCHES = 1;
const UPPERCASE_TERM = 'WEBCAM';
const PADDED_TERM = '  webcam  ';
const MISSING_TERM = 'wear';
const FIRST_ASCENDING = 'Access badge';
const FIRST_DESCENDING = 'Webcam';
const LOWEST_QUANTITY = 'Laptop sleeve';
const HIGHEST_QUANTITY = 'Access badge';

describe('filterItems', () => {
  it('returns every row for an empty term', () => {
    expect(filterItems(INVENTORY_ITEMS, '')).toHaveLength(TOTAL_ITEMS);
  });

  it('matches part of a name', () => {
    expect(filterItems(INVENTORY_ITEMS, SEARCH_TERM)).toHaveLength(SEARCH_MATCHES);
  });

  it('ignores case', () => {
    expect(filterItems(INVENTORY_ITEMS, UPPERCASE_TERM)).toHaveLength(SEARCH_MATCHES);
  });

  it('ignores surrounding whitespace', () => {
    expect(filterItems(INVENTORY_ITEMS, PADDED_TERM)).toHaveLength(SEARCH_MATCHES);
  });

  it('returns nothing when no name matches', () => {
    expect(filterItems(INVENTORY_ITEMS, MISSING_TERM)).toHaveLength(NO_MATCHES);
  });
});

describe('sortItems', () => {
  it('orders names ascending', () => {
    const sorted = sortItems(INVENTORY_ITEMS, SortColumn.Name, SortDirection.Ascending);

    expect(sorted[0]?.name).toBe(FIRST_ASCENDING);
  });

  it('reverses names when descending', () => {
    const sorted = sortItems(INVENTORY_ITEMS, SortColumn.Name, SortDirection.Descending);

    expect(sorted[0]?.name).toBe(FIRST_DESCENDING);
  });

  it('orders quantity as a number rather than as text', () => {
    // Compared as text, 12 sorts before 4 and the column reads as sorted while
    // it is not. This is the assertion that catches that.
    const sorted = sortItems(INVENTORY_ITEMS, SortColumn.Quantity, SortDirection.Ascending);

    expect(sorted[0]?.name).toBe(LOWEST_QUANTITY);
  });

  it('reverses quantity when descending', () => {
    const sorted = sortItems(INVENTORY_ITEMS, SortColumn.Quantity, SortDirection.Descending);

    expect(sorted[0]?.name).toBe(HIGHEST_QUANTITY);
  });

  it('leaves the source rows untouched', () => {
    // sort mutates in place, so a query that forgets to copy reorders the
    // seed for every later caller.
    sortItems(INVENTORY_ITEMS, SortColumn.Name, SortDirection.Descending);

    expect(INVENTORY_ITEMS[0]?.name).toBe(FIRST_ASCENDING);
  });
});

describe('compareItems', () => {
  it('reports equality for a row against itself', () => {
    const first = INVENTORY_ITEMS[0];
    if (first === undefined) {
      throw new Error(MISSING_TERM);
    }

    expect(compareItems(first, first, SortColumn.Name, SortDirection.Ascending)).toBe(0);
  });
});

describe('nextSort', () => {
  it('reverses direction when the active column is clicked again', () => {
    const next = nextSort(SortColumn.Name, SortDirection.Ascending, SortColumn.Name);

    expect(next.direction).toBe(SortDirection.Descending);
  });

  it('returns to ascending on a third click', () => {
    const next = nextSort(SortColumn.Name, SortDirection.Descending, SortColumn.Name);

    expect(next.direction).toBe(SortDirection.Ascending);
  });

  it('starts a newly chosen column ascending', () => {
    // Inheriting the previous direction would present a descending list to
    // someone who just asked for a different sort.
    const next = nextSort(SortColumn.Name, SortDirection.Descending, SortColumn.Quantity);

    expect(next.column).toBe(SortColumn.Quantity);
    expect(next.direction).toBe(SortDirection.Ascending);
  });
});

describe('visibleItems', () => {
  it('filters before ordering', () => {
    const shown = visibleItems(
      INVENTORY_ITEMS,
      SEARCH_TERM,
      SortColumn.Name,
      SortDirection.Ascending
    );

    expect(shown).toHaveLength(SEARCH_MATCHES);
  });
});
