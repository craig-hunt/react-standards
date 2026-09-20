import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { InventoryPage } from './InventoryPage';
import { INVENTORY_ITEMS } from './constants';
import { AriaAttribute, AriaValue, resultCountLabel } from '../../shared/constants';
import { InventoryTestId } from '../../shared/testIds';
import { renderWithProviders } from '../../test/render';

const TOTAL_ITEMS = 6;
const ONE_MATCH = 1;
const NO_MATCHES = 0;
const SEARCH_TERM = 'webcam';
const MISSING_TERM = 'wear';
const FIRST_ASCENDING = 'Access badge';
const FIRST_DESCENDING = 'Webcam';

describe('InventoryPage', () => {
  it('renders every row once the query settles', async () => {
    renderWithProviders(<InventoryPage />);

    expect(await screen.findAllByTestId(InventoryTestId.Row)).toHaveLength(TOTAL_ITEMS);
  });

  it('reports how many rows are shown out of the total', async () => {
    renderWithProviders(<InventoryPage />);
    await screen.findAllByTestId(InventoryTestId.Row);

    expect(screen.getByTestId(InventoryTestId.ResultCount)).toHaveTextContent(
      resultCountLabel(TOTAL_ITEMS, INVENTORY_ITEMS.length)
    );
  });

  it('filters rows by name as the reader types', async () => {
    const user = userEvent.setup();
    renderWithProviders(<InventoryPage />);
    await screen.findAllByTestId(InventoryTestId.Row);

    await user.type(screen.getByTestId(InventoryTestId.Search), SEARCH_TERM);

    expect(screen.getAllByTestId(InventoryTestId.Row)).toHaveLength(ONE_MATCH);
  });

  it('announces no results rather than showing an empty table', async () => {
    const user = userEvent.setup();
    renderWithProviders(<InventoryPage />);
    await screen.findAllByTestId(InventoryTestId.Row);

    await user.type(screen.getByTestId(InventoryTestId.Search), MISSING_TERM);

    expect(screen.queryAllByTestId(InventoryTestId.Row)).toHaveLength(NO_MATCHES);
    expect(screen.getByTestId(InventoryTestId.NoResults)).toBeVisible();
  });

  it('restores every row when the filter is reset', async () => {
    const user = userEvent.setup();
    renderWithProviders(<InventoryPage />);
    await screen.findAllByTestId(InventoryTestId.Row);

    await user.type(screen.getByTestId(InventoryTestId.Search), SEARCH_TERM);
    await user.click(screen.getByTestId(InventoryTestId.ResetButton));

    expect(screen.getAllByTestId(InventoryTestId.Row)).toHaveLength(TOTAL_ITEMS);
  });

  it('reverses the order when the active column is clicked again', async () => {
    const user = userEvent.setup();
    renderWithProviders(<InventoryPage />);
    await screen.findAllByTestId(InventoryTestId.Row);

    expect(screen.getAllByTestId(InventoryTestId.ItemName)[0]).toHaveTextContent(FIRST_ASCENDING);

    await user.click(screen.getByTestId(InventoryTestId.SortByName));

    expect(screen.getAllByTestId(InventoryTestId.ItemName)[0]).toHaveTextContent(FIRST_DESCENDING);
  });

  it('carries aria-sort on the header cell and never on the button', async () => {
    // The divergence from the sibling demo applications, asserted so it stays a
    // decision rather than drifting back. ARIA permits aria-sort on an element
    // with the columnheader role and forbids it on a button; the siblings put
    // it on the button and their suites assert that defect into place.
    renderWithProviders(<InventoryPage />);
    await screen.findAllByTestId(InventoryTestId.Row);

    expect(screen.getByTestId(InventoryTestId.HeaderName)).toHaveAttribute(
      AriaAttribute.Sort,
      AriaValue.Ascending
    );
    expect(screen.getByTestId(InventoryTestId.SortByName)).not.toHaveAttribute(AriaAttribute.Sort);
  });

  it('reports the inactive columns as unsorted rather than omitting the attribute', async () => {
    // A columnheader with no aria-sort reads as "not sortable". Reporting none
    // says sortable and not currently sorted, which is the true state.
    renderWithProviders(<InventoryPage />);
    await screen.findAllByTestId(InventoryTestId.Row);

    expect(screen.getByTestId(InventoryTestId.HeaderQuantity)).toHaveAttribute(
      AriaAttribute.Sort,
      AriaValue.None
    );
  });
});
