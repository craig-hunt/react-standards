// Every data-testid this application renders, and the one place the attribute
// name is written.
//
// These ids are a contract, not a detail. `cypress-standards` and
// `playwright-standards` drive the same three pages against their own copies of
// this list, so a rename here breaks a suite in another repository. That is the
// point: the id is a promise the application makes, and a suite that invents
// one has invented a promise nobody made.
//
// The grouping mirrors the siblings' `cypress/support/constants/testIds.ts`
// exactly, so the two files can be compared line for line.

export const TEST_ID_ATTRIBUTE = 'data-testid';

export const NavTestId = {
  Container: 'primary-nav',
  Tasks: 'nav-tasks',
  Signup: 'nav-signup',
  Inventory: 'nav-inventory',
} as const;

export const TaskTestId = {
  Heading: 'page-heading',
  Form: 'new-task-form',
  Input: 'new-task-input',
  AddButton: 'add-task-button',
  Count: 'task-count',
  List: 'task-list',
  Item: 'task-item',
  ItemTitle: 'task-title',
  ItemCheckbox: 'task-checkbox',
  DeleteButton: 'delete-task-button',
  Filters: 'filters',
  FilterAll: 'filter-all',
  FilterActive: 'filter-active',
  FilterCompleted: 'filter-completed',
  ClearCompletedButton: 'clear-completed-button',
  EmptyState: 'empty-state',
} as const;

export const SignupTestId = {
  Heading: 'page-heading',
  Form: 'signup-form',
  FullNameInput: 'full-name-input',
  FullNameError: 'full-name-error',
  EmailInput: 'email-input',
  EmailError: 'email-error',
  PlanSelect: 'plan-select',
  PlanError: 'plan-error',
  SeatsInput: 'seats-input',
  NotesTextarea: 'notes-textarea',
  TermsCheckbox: 'terms-checkbox',
  TermsError: 'terms-error',
  SubmitButton: 'submit-button',
  Confirmation: 'signup-confirmation',
  ConfirmationHeading: 'confirmation-heading',
  ConfirmationSummary: 'confirmation-summary',
} as const;

export const InventoryTestId = {
  Heading: 'page-heading',
  Search: 'inventory-search',
  ResetButton: 'reset-filter-button',
  ResultCount: 'result-count',
  Table: 'inventory-table',
  Body: 'inventory-body',
  Row: 'inventory-row',
  ItemName: 'item-name',
  ItemQuantity: 'item-quantity',
  ItemStatus: 'item-status',
  SortByName: 'sort-by-name',
  SortByQuantity: 'sort-by-quantity',
  SortByStatus: 'sort-by-status',
  NoResults: 'no-results',

  /**
   * The header cells, which the sibling demo applications do not expose.
   *
   * Those applications write `aria-sort` onto the sort button, where ARIA
   * forbids it: the attribute belongs on the element with the `columnheader`
   * role. Their suites then assert that defect into place, and neither runs an
   * accessibility check that would have caught it. `blazor-standards` reached
   * the same conclusion and resolved it the same way.
   *
   * Moving the attribute needs somewhere to assert it, so the header cells gain
   * ids of their own. The button ids are untouched, so the shared contract gains
   * three entries and renames none.
   */
  HeaderName: 'header-name',
  HeaderQuantity: 'header-quantity',
  HeaderStatus: 'header-status',
} as const;
