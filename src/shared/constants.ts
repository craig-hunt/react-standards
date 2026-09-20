// Every literal the shared layer carries, named once.
//
// The lint rule in eslint-rules/no-magic-literals.js exempts a file named
// constants.ts, and stryker.config.json excludes the same name from mutation,
// so both tools agree on one convention rather than each inventing its own.
//
// Copy lives here rather than in JSX for three reasons a reviewer can check:
// someone looking for a phrase can find it, a phrase used twice cannot drift
// apart, and a test asserting on it quotes a name instead of repeating a
// string that the component is free to change underneath it.

export const AppRoute = {
  Tasks: '/',
  Signup: '/signup',
  Inventory: '/inventory',
} as const;

/**
 * The routes drop the file extension, which the siblings' routes carry.
 *
 * Those demo applications ship static files, so `/signup.html` is the path that
 * exists. This one routes in the browser, so `/signup` is. `blazor-standards`
 * made the same change for the same reason and documented it as a divergence.
 * A suite written against one uses its own route constants, which is why routes
 * live in a constants file on both sides.
 */
export const NavLabel = {
  Tasks: 'Tasks',
  Signup: 'Sign up',
  Inventory: 'Inventory',
} as const;

export const PageTitle = {
  Tasks: 'Task list',
  Signup: 'Create an account',
  Inventory: 'Inventory',
} as const;

export const TaskCopy = {
  Heading: 'Task list',
  AddLabel: 'Add a task',
  AddPlaceholder: 'What needs doing?',
  AddButton: 'Add',
  DeleteButton: 'Delete',
  FilterAll: 'All',
  FilterActive: 'Active',
  FilterCompleted: 'Completed',
  FilterGroupLabel: 'Filter tasks',
  ClearCompleted: 'Clear completed',
  EmptyState: 'Nothing here yet. Add a task above.',
} as const;

export const SignupCopy = {
  Heading: 'Create an account',
  FullNameLabel: 'Full name',
  EmailLabel: 'Work email',
  PlanLabel: 'Plan',
  PlanPlaceholder: 'Choose a plan',
  SeatsLabel: 'Seats',
  NotesLabel: 'Anything we should know?',
  TermsLabel: 'I accept the terms',
  Submit: 'Create account',
  ConfirmationHeading: 'Account created',
} as const;

export const InventoryCopy = {
  Heading: 'Inventory',
  SearchLabel: 'Filter by name',
  SearchPlaceholder: 'Type to filter',
  Reset: 'Reset',
  ColumnName: 'Name',
  ColumnQuantity: 'Quantity',
  ColumnStatus: 'Status',
  NoResults: 'No items match that filter.',
  Loading: 'Loading inventory.',
  Error: 'The inventory could not be loaded.',
} as const;

/**
 * The seat range, built from the limits rather than spelled beside them.
 *
 * A message reading "between 1 and 500" written as prose drifts the moment
 * SeatLimit changes, and the drift is silent: the form still refuses the right
 * values while telling the reader the wrong ones.
 */
export const seatsRangeMessage = (minimum: number, maximum: number): string =>
  `Enter a whole number of seats between ${minimum} and ${maximum}.`;

/**
 * Validation messages, rendered verbatim.
 *
 * The sibling suites assert on these exact strings. A reworded message is a
 * breaking change to another repository, which is why they sit in a constant
 * rather than inside the validator that produces them.
 */
export const ValidationMessage = {
  NameRequired: 'Enter your full name.',
  EmailRequired: 'Enter your work email.',
  EmailInvalid: 'Enter a valid email address.',
  PlanRequired: 'Choose a plan.',
  TermsRequired: 'Accept the terms to continue.',
} as const;

export const ElementId = {
  Root: 'root',
  NewTask: 'new-task',
  FullName: 'full-name',
  FullNameError: 'full-name-error-text',
  Email: 'email',
  EmailError: 'email-error-text',
  Plan: 'plan',
  PlanError: 'plan-error-text',
  Terms: 'terms',
  TermsError: 'terms-error-text',
  Seats: 'seats',
  SeatsError: 'seats-error-text',
  Notes: 'notes',
  Search: 'search',
  MainContent: 'main-content',
} as const;

export const LayoutCopy = {
  SkipToContent: 'Skip to content',
} as const;

export const RootError = {
  Missing: 'The application could not find its mount element.',
} as const;

/**
 * The class strings each surface wears, named once.
 *
 * Tailwind classes are presentation, and the lint rule exempts className for
 * that reason. They are gathered here anyway, because a table row styled in
 * three files drifts in three directions, and because a component then reads as
 * structure rather than as a wall of utilities.
 */
export const Surface = {
  Shell: 'min-h-screen bg-surface text-ink',
  SkipLink:
    'sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-10 focus:rounded-md focus:bg-accent focus:px-4 focus:py-2 focus:text-accent-ink',
  Nav: 'flex flex-wrap gap-1 border-b border-line bg-panel px-4 py-3',
  NavLink:
    'rounded-md px-3 py-2 text-sm font-medium text-muted hover:bg-raised hover:text-ink aria-[current=page]:bg-raised aria-[current=page]:text-ink',
  Main: 'mx-auto w-full max-w-3xl px-4 py-8',
  PageHeading: 'text-2xl font-semibold tracking-tight',
  Section: 'mt-6 flex flex-col gap-4',
  Row: 'flex flex-wrap items-center gap-2',
  Field: 'flex flex-col gap-1',
  Label: 'text-sm font-medium',
  Input:
    'w-full rounded-md border border-line bg-panel px-3 py-2 text-ink placeholder:text-muted aria-[invalid=true]:border-danger',
  Textarea: 'w-full rounded-md border border-line bg-panel px-3 py-2 text-ink',
  Action:
    'rounded-md bg-accent px-3 py-2 text-sm font-medium text-accent-ink hover:opacity-90 disabled:opacity-50',
  Quiet: 'rounded-md border border-line px-3 py-2 text-sm font-medium hover:bg-raised',
  Toggle: 'rounded-md border border-line px-3 py-2 text-sm font-medium aria-pressed:bg-raised',
  Error: 'text-sm text-danger',
  Muted: 'text-sm text-muted',
  List: 'flex flex-col gap-2',
  ListRow: 'flex items-center gap-3 rounded-md border border-line bg-panel px-3 py-2',
  Completed: 'text-muted line-through',
  Table: 'w-full border-collapse text-left',
  TableHead: 'border-b border-line',
  HeaderCell: 'px-3 py-2 text-sm font-semibold',
  Cell: 'border-b border-line px-3 py-2',
  Confirmation: 'mt-6 rounded-md border border-line bg-panel p-4',
} as const;

export const AriaAttribute = {
  Invalid: 'aria-invalid',
  Sort: 'aria-sort',
  Live: 'aria-live',
  Label: 'aria-label',
  DescribedBy: 'aria-describedby',
  Pressed: 'aria-pressed',
  Current: 'aria-current',
} as const;

/**
 * No None value, deliberately.
 *
 * ARIA's authoring guidance sets aria-sort on the sorted column only, removing
 * it and applying it to the new column as the sort moves. Emitting none on the
 * others tells a screen reader three columns are sortable-but-unsorted where it
 * expects one answer, so the attribute is omitted instead and no constant
 * exists to tempt anyone back.
 */
export const AriaValue = {
  True: 'true',
  False: 'false',
  Polite: 'polite',
  Page: 'page',
  Ascending: 'ascending',
  Descending: 'descending',
} as const;

/**
 * The roles tests query by.
 *
 * Querying by role is the second tier of the selector hierarchy and the one
 * that proves the markup is semantic: `getByRole('main')` passes only if a
 * main landmark actually exists. Naming the roles keeps a typo from producing
 * a query that finds nothing and a test that reports the wrong reason.
 */
export const AriaRole = {
  Navigation: 'navigation',
  Main: 'main',
  Link: 'link',
  Group: 'group',
  Status: 'status',
  Button: 'button',
  ColumnHeader: 'columnheader',
} as const;

/** Plain HTML attribute names the tests assert on. */
export const HtmlAttribute = {
  Href: 'href',
  Id: 'id',
} as const;

/**
 * Query keys, named because TanStack Query matches them structurally.
 *
 * A key written inline in two hooks looks identical and invalidates
 * independently, so one screen keeps showing what the data no longer says. The
 * failure is silent, which is what makes it worth a constant.
 */
export const QueryKey = {
  Tasks: ['tasks'],
  Inventory: ['inventory'],
  RuntimeConfig: ['runtime-config'],
} as const;

export const SeedTaskTitle = {
  ArchitectureRecord: 'Review the architecture decision record',
  VendorQuestionnaire: 'Reply to the vendor questionnaire',
} as const;

export const PlanLabel = {
  Starter: 'Starter',
  Growth: 'Growth',
  Enterprise: 'Enterprise',
} as const;

export const SeatLimit = {
  Minimum: 1,
  Maximum: 500,
  Default: 1,
} as const;

export const NotesRows = 3;

/**
 * The strings `typeof` returns, named.
 *
 * These look like the one case where a literal is harmless, which is exactly
 * why they earn a constant: `typeof value === 'sting'` compiles, always
 * evaluates false, and silently disables the guard it was written to perform.
 * A named constant turns that typo into a build failure.
 */
export const TypeName = {
  Object: 'object',
  String: 'string',
  Number: 'number',
} as const;

/** The fields the signup form updates, so a setter call names one rather than spelling it. */
export const SignupFieldName = {
  FullName: 'fullName',
  Email: 'email',
  Plan: 'plan',
  Seats: 'seats',
  Notes: 'notes',
  AcceptTerms: 'acceptTerms',
} as const;

/** What a same-document link prefixes an element id with. */
export const HashPrefix = '#';

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const EmptyText = '';

/**
 * The counter's wording, named once.
 *
 * A component building `${remaining} remaining of ${total}` inline hides the
 * format from everyone else, so a copy change breaks several files and none of
 * them records what the wording was meant to be. The sibling suites assert on
 * this exact output, which makes it a contract rather than presentation.
 *
 * These live in this file rather than beside the logic they serve because the
 * lint rule exempts a module constant only until an arrow function begins. A
 * builder is a function, so its template would be flagged anywhere else. Naming
 * the file constants.ts is the sanctioned way to say these strings are the
 * definition rather than a use of one.
 */
export const remainingLabel = (remaining: number, total: number): string =>
  `${remaining} remaining of ${total}`;

export const resultCountLabel = (shown: number, total: number): string =>
  `Showing ${shown} of ${total} items`;

export const confirmationSummary = (fullName: string, planLabel: string, seats: number): string =>
  `${fullName} on the ${planLabel} plan, ${seats} seat(s).`;

export const markCompleteLabel = (title: string): string => `Mark ${title} complete`;

export const deleteTaskLabel = (title: string): string => `Delete ${title}`;
