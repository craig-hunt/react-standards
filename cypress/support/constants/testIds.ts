// Every test id the suite reaches for.
//
// This mirrors src/shared/testIds.ts rather than importing it, deliberately.
// The suite stands in for the sibling repositories that drive this same
// contract from outside, and a consumer that imports the producer's constants
// cannot notice when the producer renames one: the rename would follow silently
// into the suite and the contract would break for everyone else while this
// repository stayed green.
//
// Two files that must agree is the point. When they disagree, this suite is
// what says so.

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
  SeatsError: 'seats-error',
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

  // The header cells, which the sibling demo applications do not expose. This
  // application carries aria-sort on the columnheader rather than on the sort
  // button, where ARIA forbids it, so the attribute needs somewhere to be
  // asserted. The button ids are untouched.
  HeaderName: 'header-name',
  HeaderQuantity: 'header-quantity',
  HeaderStatus: 'header-status',
} as const;
