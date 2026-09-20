import { InventoryTestId } from '../constants/testIds';

/**
 * Element retrieval only.
 *
 * The header cells and the sort buttons are separate methods because they are
 * separate elements with separate jobs: the button takes the click, and the
 * header cell carries aria-sort. A single method returning one of them would
 * force a spec to walk to the other.
 */
export const inventoryRepository = {
  heading: () => cy.getByTestId(InventoryTestId.Heading),
  search: () => cy.getByTestId(InventoryTestId.Search),
  resetButton: () => cy.getByTestId(InventoryTestId.ResetButton),
  resultCount: () => cy.getByTestId(InventoryTestId.ResultCount),
  table: () => cy.getByTestId(InventoryTestId.Table),
  body: () => cy.getByTestId(InventoryTestId.Body),
  rows: () => cy.getByTestId(InventoryTestId.Row),
  itemNames: () => cy.getByTestId(InventoryTestId.ItemName),
  itemQuantities: () => cy.getByTestId(InventoryTestId.ItemQuantity),
  noResults: () => cy.getByTestId(InventoryTestId.NoResults),

  sortByNameButton: () => cy.getByTestId(InventoryTestId.SortByName),
  sortByQuantityButton: () => cy.getByTestId(InventoryTestId.SortByQuantity),
  sortByStatusButton: () => cy.getByTestId(InventoryTestId.SortByStatus),

  nameHeader: () => cy.getByTestId(InventoryTestId.HeaderName),
  quantityHeader: () => cy.getByTestId(InventoryTestId.HeaderQuantity),
  statusHeader: () => cy.getByTestId(InventoryTestId.HeaderStatus),
} as const;
