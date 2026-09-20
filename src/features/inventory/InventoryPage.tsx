import { useState } from 'react';
import type { AriaAttributes } from 'react';

import { nextSort, visibleItems } from './inventoryQuery';
import { useInventory } from './useInventory';
import {
  AriaValue,
  ElementId,
  EmptyText,
  InventoryCopy,
  Surface,
  resultCountLabel,
} from '../../shared/constants';
import { testId } from '../../shared/testId';
import { InventoryTestId } from '../../shared/testIds';
import { SortColumn, SortDirection } from '../../shared/types';
import type { InventoryItem } from '../../shared/types';

/**
 * The inventory table.
 *
 * Rows arrive from a hook; filtering and ordering come from inventoryQuery.
 * What is left here is markup and event wiring, which is the whole point of
 * separating them: none of the behavior worth testing needs a browser.
 *
 * aria-sort sits on the header cell rather than on the sort button. ARIA
 * permits the attribute on an element with the columnheader role and forbids it
 * on a button, and the sibling demo applications carry it on the button, where
 * their suites then assert the defect into place. Neither of those suites runs
 * an accessibility check, which is how it survived. blazor-standards reached the
 * same conclusion independently.
 */
const NO_ITEMS: readonly InventoryItem[] = [];

export function InventoryPage() {
  const inventory = useInventory();
  const [term, setTerm] = useState(EmptyText);
  const [column, setColumn] = useState<SortColumn>(SortColumn.Name);
  const [direction, setDirection] = useState<SortDirection>(SortDirection.Ascending);

  // Only a settled, successful read produces rows. Defaulting the query's data
  // to an empty array instead would make three different situations render
  // identically: rows still arriving, rows that failed to arrive, and a filter
  // that genuinely matched nothing. The screen would announce no results before
  // it had asked, and an outage would read as an empty warehouse.
  const items = inventory.isSuccess ? inventory.data : NO_ITEMS;
  const shown = visibleItems(items, term, column, direction);

  function sortBy(clicked: SortColumn) {
    const next = nextSort(column, direction, clicked);
    setColumn(next.column);
    setDirection(next.direction);
  }

  /**
   * The sorted column's direction, and undefined for every other column.
   *
   * React omits an attribute whose value is undefined, which is what ARIA's
   * authoring guidance asks for: aria-sort is set on the currently sorted
   * column, then removed and set on the new one as the sort moves. An earlier
   * version returned none for inactive columns and a test asserted it, which
   * put all three headers in a state the guidance does not describe.
   *
   * The return type comes from React's own attribute types rather than being
   * written as string, so a misspelled value cannot become an attribute a
   * screen reader silently ignores.
   */
  function sortValue(candidate: SortColumn): AriaAttributes['aria-sort'] {
    return column === candidate ? direction : undefined;
  }

  return (
    <>
      <h1 {...testId(InventoryTestId.Heading)} className={Surface.PageHeading}>
        {InventoryCopy.Heading}
      </h1>

      <div className={Surface.Section}>
        <div className={Surface.Field}>
          <label htmlFor={ElementId.Search} className={Surface.Label}>
            {InventoryCopy.SearchLabel}
          </label>
          <div className={Surface.Row}>
            <input
              id={ElementId.Search}
              {...testId(InventoryTestId.Search)}
              type="search"
              value={term}
              placeholder={InventoryCopy.SearchPlaceholder}
              onChange={(event) => setTerm(event.target.value)}
              className={Surface.Input}
            />
            <button
              type="button"
              {...testId(InventoryTestId.ResetButton)}
              onClick={() => setTerm(EmptyText)}
              className={Surface.Quiet}
            >
              {InventoryCopy.Reset}
            </button>
          </div>
        </div>

        {/* Three states, told apart. Rows still arriving, rows that failed to
            arrive, and rows that arrived. Only the last renders a table, so a
            reader is never told there are no matches before anything was
            asked, and an outage never reads as an empty warehouse. */}
        <p
          {...testId(InventoryTestId.Loading)}
          hidden={!inventory.isPending}
          className={Surface.Muted}
        >
          {InventoryCopy.Loading}
        </p>

        <p
          {...testId(InventoryTestId.Error)}
          role="alert"
          hidden={!inventory.isError}
          className={Surface.Error}
        >
          {InventoryCopy.Error}
        </p>

        <p
          {...testId(InventoryTestId.ResultCount)}
          aria-live={AriaValue.Polite}
          hidden={!inventory.isSuccess}
          className={Surface.Muted}
        >
          {resultCountLabel(shown.length, items.length)}
        </p>

        <table
          {...testId(InventoryTestId.Table)}
          hidden={!inventory.isSuccess}
          className={Surface.Table}
        >
          <thead className={Surface.TableHead}>
            <tr>
              <th
                scope="col"
                {...testId(InventoryTestId.HeaderName)}
                aria-sort={sortValue(SortColumn.Name)}
                className={Surface.HeaderCell}
              >
                <button
                  type="button"
                  {...testId(InventoryTestId.SortByName)}
                  onClick={() => sortBy(SortColumn.Name)}
                >
                  {InventoryCopy.ColumnName}
                </button>
              </th>
              <th
                scope="col"
                {...testId(InventoryTestId.HeaderQuantity)}
                aria-sort={sortValue(SortColumn.Quantity)}
                className={Surface.HeaderCell}
              >
                <button
                  type="button"
                  {...testId(InventoryTestId.SortByQuantity)}
                  onClick={() => sortBy(SortColumn.Quantity)}
                >
                  {InventoryCopy.ColumnQuantity}
                </button>
              </th>
              <th
                scope="col"
                {...testId(InventoryTestId.HeaderStatus)}
                aria-sort={sortValue(SortColumn.Status)}
                className={Surface.HeaderCell}
              >
                <button
                  type="button"
                  {...testId(InventoryTestId.SortByStatus)}
                  onClick={() => sortBy(SortColumn.Status)}
                >
                  {InventoryCopy.ColumnStatus}
                </button>
              </th>
            </tr>
          </thead>
          <tbody {...testId(InventoryTestId.Body)}>
            {shown.map((item) => (
              <tr key={item.name} {...testId(InventoryTestId.Row)}>
                <td {...testId(InventoryTestId.ItemName)} className={Surface.Cell}>
                  {item.name}
                </td>
                <td {...testId(InventoryTestId.ItemQuantity)} className={Surface.Cell}>
                  {item.quantity}
                </td>
                <td {...testId(InventoryTestId.ItemStatus)} className={Surface.Cell}>
                  {item.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Only after a successful read. Hidden on shown.length alone, this
            announced no matches while the first request was still in flight. */}
        <p
          {...testId(InventoryTestId.NoResults)}
          hidden={!inventory.isSuccess || shown.length > 0}
          className={Surface.Muted}
        >
          {InventoryCopy.NoResults}
        </p>
      </div>
    </>
  );
}
