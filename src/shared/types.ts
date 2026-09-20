// Types over primitives wherever a domain exists.
//
// A plan is not a string and a sort direction is not a boolean. Modelling them
// as their own types turns a typo into a compile error rather than a branch
// that silently never runs, and it lets a switch be exhaustive: with
// noFallthroughCasesInSwitch and a union, adding a case to the union breaks
// every switch that has not handled it.

export const Plan = {
  Starter: 'starter',
  Growth: 'growth',
  Enterprise: 'enterprise',
} as const;

export type Plan = (typeof Plan)[keyof typeof Plan];

export const TaskFilter = {
  All: 'all',
  Active: 'active',
  Completed: 'completed',
} as const;

export type TaskFilter = (typeof TaskFilter)[keyof typeof TaskFilter];

export const SortColumn = {
  Name: 'name',
  Quantity: 'quantity',
  Status: 'status',
} as const;

export type SortColumn = (typeof SortColumn)[keyof typeof SortColumn];

export const SortDirection = {
  Ascending: 'ascending',
  Descending: 'descending',
} as const;

export type SortDirection = (typeof SortDirection)[keyof typeof SortDirection];

export const StockStatus = {
  InStock: 'In stock',
  Low: 'Low',
  OutOfStock: 'Out of stock',
} as const;

export type StockStatus = (typeof StockStatus)[keyof typeof StockStatus];

export interface Task {
  readonly id: number;
  readonly title: string;
  readonly completed: boolean;
}

export interface InventoryItem {
  readonly name: string;
  readonly quantity: number;
  readonly status: StockStatus;
}

export interface SignupDetails {
  readonly fullName: string;
  readonly email: string;
  readonly plan: Plan | '';
  readonly seats: number;
  readonly notes: string;
  readonly acceptTerms: boolean;
}

export type SignupField = 'fullName' | 'email' | 'plan' | 'seats' | 'terms';

export type SignupErrors = Partial<Record<SignupField, string>>;

export const SignupStateKind = {
  Editing: 'editing',
  Submitted: 'submitted',
} as const;

export type SignupStateKind = (typeof SignupStateKind)[keyof typeof SignupStateKind];

/**
 * The signup screen's state as a discriminated union rather than a pair of
 * booleans.
 *
 * Two booleans permit a fourth state nobody designed, where the form is both
 * submitted and not submitted. A union makes that state unrepresentable, and
 * the compiler then proves the screen handles every state that does exist.
 *
 * The discriminant reads from a const object for the same reason Plan and
 * TaskFilter do. Written as a bare string it would be a magic literal appearing
 * in a dozen comparisons, each free to be misspelled into a branch that never
 * runs and never errors.
 */
export type SignupState =
  | { readonly kind: typeof SignupStateKind.Editing; readonly errors: SignupErrors }
  | { readonly kind: typeof SignupStateKind.Submitted; readonly summary: string };

export const TaskActionKind = {
  Add: 'add',
  Toggle: 'toggle',
  Remove: 'remove',
  Clear: 'clear',
} as const;

export type TaskActionKind = (typeof TaskActionKind)[keyof typeof TaskActionKind];

export interface RuntimeConfig {
  readonly apiBaseUrl: string;
  readonly environmentName: string;
}
