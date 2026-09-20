import { Route } from '../constants/routes';
import { inventoryRepository } from '../repositories/inventoryRepository';

/**
 * Interactions, built from repository methods.
 *
 * Sorting is three named gestures rather than one taking a column string. A
 * spec then reads `sortByQuantity()` instead of `sort('quantity')`, and no
 * column name travels through the suite as an argument.
 */
export const inventoryActions = {
  visit: (): void => {
    cy.visit(Route.Inventory);
  },

  search: (term: string): void => {
    inventoryRepository.search().type(term);
  },

  resetFilter: (): void => {
    inventoryRepository.resetButton().click();
  },

  sortByName: (): void => {
    inventoryRepository.sortByNameButton().click();
  },

  sortByQuantity: (): void => {
    inventoryRepository.sortByQuantityButton().click();
  },

  sortByStatus: (): void => {
    inventoryRepository.sortByStatusButton().click();
  },
} as const;
