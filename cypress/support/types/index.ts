// The suite's own vocabulary, and the command signatures it adds to Cypress.
//
// These mirror the application's domain types rather than importing them, for
// the same reason the test ids are mirrored: the suite stands in for an
// external consumer, and a consumer that imports the producer's types cannot
// notice when the producer changes them.

export const TaskFilter = {
  All: 'all',
  Active: 'active',
  Completed: 'completed',
} as const;

export type TaskFilter = (typeof TaskFilter)[keyof typeof TaskFilter];

export const Plan = {
  Starter: 'starter',
  Growth: 'growth',
  Enterprise: 'enterprise',
} as const;

export type Plan = (typeof Plan)[keyof typeof Plan];

export interface SignupDetails {
  readonly fullName: string;
  readonly email: string;
  readonly plan: Plan;
  readonly seats: number;
  readonly notes: string;
  readonly acceptTerms: boolean;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      getByTestId(testId: string): Chainable<JQuery<HTMLElement>>;
      findByTestId(testId: string): Chainable<JQuery<HTMLElement>>;
    }
  }
}
