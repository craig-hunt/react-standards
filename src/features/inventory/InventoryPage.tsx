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
import { InventoryTestId } from '../../shared/testIds';
import { SortColumn, SortDirection } from '../../shared/types';

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
export function InventoryPage() {
  const inventory = useInventory();
  const [term, setTerm] = useState(EmptyText);
  const [column, setColumn] = useState<SortColumn>(SortColumn.Name);
  const [direction, setDirection] = useState<SortDirection>(SortDirection.Ascending);

  const items = inventory.data ?? [];
  const shown = visibleItems(items, term, column, direction);

  function sortBy(clicked: SortColumn) {
    const next = nextSort(column, direction, clicked);
    setColumn(next.column);
    setDirection(next.direction);
  }

  /**
   * The return type comes from React's own attribute types rather than being
   * written as string. ARIA defines four permitted values, and a helper typed
   * as string would let any of them be misspelled into an attribute a screen
   * reader silently ignores.
   */
  function sortValue(candidate: SortColumn): AriaAttributes['aria-sort'] {
    return column === candidate ? direction : AriaValue.None;
  }

  return (
    <>
      <h1 data-testid={InventoryTestId.Heading} className={Surface.PageHeading}>
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
              data-testid={InventoryTestId.Search}
              type="search"
              value={term}
              placeholder={InventoryCopy.SearchPlaceholder}
              onChange={(event) => setTerm(event.target.value)}
              className={Surface.Input}
            />
            <button
              type="button"
              data-testid={InventoryTestId.ResetButton}
              onClick={() => setTerm(EmptyText)}
              className={Surface.Quiet}
            >
              {InventoryCopy.Reset}
            </button>
          </div>
        </div>

        <p
          data-testid={InventoryTestId.ResultCount}
          aria-live={AriaValue.Polite}
          className={Surface.Muted}
        >
          {resultCountLabel(shown.length, items.length)}
        </p>

        <table data-testid={InventoryTestId.Table} className={Surface.Table}>
          <thead className={Surface.TableHead}>
            <tr>
              <th
                scope="col"
                data-testid={InventoryTestId.HeaderName}
                aria-sort={sortValue(SortColumn.Name)}
                className={Surface.HeaderCell}
              >
                <button
                  type="button"
                  data-testid={InventoryTestId.SortByName}
                  onClick={() => sortBy(SortColumn.Name)}
                >
                  {InventoryCopy.ColumnName}
                </button>
              </th>
              <th
                scope="col"
                data-testid={InventoryTestId.HeaderQuantity}
                aria-sort={sortValue(SortColumn.Quantity)}
                className={Surface.HeaderCell}
              >
                <button
                  type="button"
                  data-testid={InventoryTestId.SortByQuantity}
                  onClick={() => sortBy(SortColumn.Quantity)}
                >
                  {InventoryCopy.ColumnQuantity}
                </button>
              </th>
              <th
                scope="col"
                data-testid={InventoryTestId.HeaderStatus}
                aria-sort={sortValue(SortColumn.Status)}
                className={Surface.HeaderCell}
              >
                <button
                  type="button"
                  data-testid={InventoryTestId.SortByStatus}
                  onClick={() => sortBy(SortColumn.Status)}
                >
                  {InventoryCopy.ColumnStatus}
                </button>
              </th>
            </tr>
          </thead>
          <tbody data-testid={InventoryTestId.Body}>
            {shown.map((item) => (
              <tr key={item.name} data-testid={InventoryTestId.Row}>
                <td data-testid={InventoryTestId.ItemName} className={Surface.Cell}>
                  {item.name}
                </td>
                <td data-testid={InventoryTestId.ItemQuantity} className={Surface.Cell}>
                  {item.quantity}
                </td>
                <td data-testid={InventoryTestId.ItemStatus} className={Surface.Cell}>
                  {item.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <p
          data-testid={InventoryTestId.NoResults}
          hidden={shown.length > 0}
          className={Surface.Muted}
        >
          {InventoryCopy.NoResults}
        </p>
      </div>
    </>
  );
}
