import { inventoryActions } from '../../actions/inventoryActions';
import { AriaAttribute, AriaValue } from '../../constants/aria';
import { INVENTORY, resultCountLabel } from '../../constants/testData';
import { inventoryRepository } from '../../repositories/inventoryRepository';

describe('Inventory', () => {
  beforeEach(() => {
    inventoryActions.visit();
  });

  it('lists every item on load', () => {
    inventoryRepository.rows().should('have.length', INVENTORY.TotalItems);
  });

  it('reports how many rows are shown out of the total', () => {
    inventoryRepository
      .resultCount()
      .should('have.text', resultCountLabel(INVENTORY.TotalItems, INVENTORY.TotalItems));
  });

  it('filters rows by name', () => {
    inventoryActions.search(INVENTORY.SearchTerm);

    inventoryRepository.rows().should('have.length', INVENTORY.SearchMatchCount);
  });

  it('announces no results rather than showing an empty table', () => {
    inventoryActions.search(INVENTORY.FilterTerm);

    inventoryRepository.rows().should('not.exist');
    inventoryRepository.noResults().should('be.visible');
  });

  it('restores every row when the filter is reset', () => {
    inventoryActions.search(INVENTORY.SearchTerm);
    inventoryActions.resetFilter();

    inventoryRepository.rows().should('have.length', INVENTORY.TotalItems);
  });

  it('opens sorted by name ascending', () => {
    inventoryRepository.itemNames().first().should('have.text', INVENTORY.FirstNameAscending);
  });

  it('reverses the order when the active column is clicked again', () => {
    inventoryActions.sortByName();

    inventoryRepository.itemNames().first().should('have.text', INVENTORY.FirstNameDescending);
  });

  it('orders quantity numerically rather than as text', () => {
    // Compared as text, 12 sorts before 4 and the column reads as sorted while
    // it is not.
    inventoryActions.sortByQuantity();

    inventoryRepository.itemNames().first().should('have.text', INVENTORY.LowestQuantityItem);
  });

  it('starts a newly chosen column ascending rather than inheriting a direction', () => {
    inventoryActions.sortByName();
    inventoryActions.sortByQuantity();

    inventoryRepository
      .quantityHeader()
      .should('have.attr', AriaAttribute.Sort, AriaValue.Ascending);
  });

  it('carries aria-sort on the header cell and never on the button', () => {
    // The documented divergence from the sibling demo applications, asserted so
    // it stays a decision rather than drifting back. ARIA permits aria-sort on
    // an element with the columnheader role and forbids it on a button.
    inventoryRepository.nameHeader().should('have.attr', AriaAttribute.Sort, AriaValue.Ascending);
    inventoryRepository.sortByNameButton().should('not.have.attr', AriaAttribute.Sort);
  });

  it('reports an inactive column as unsorted rather than omitting the attribute', () => {
    // A columnheader with no aria-sort reads as "not sortable". Reporting none
    // says sortable and not currently sorted, which is the true state.
    inventoryRepository.statusHeader().should('have.attr', AriaAttribute.Sort, AriaValue.None);
  });
});
