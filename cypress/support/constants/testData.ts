import { Plan } from '../types/index';
import type { SignupDetails } from '../types/index';

// Data the application seeds on load, and the wording it renders.
//
// A spec asserting these strings inline would break silently when the fixture
// changes, and nothing would say why. Naming them means a failure quotes the
// text a user would read rather than a literal the spec happened to repeat.

export const SEEDED_TASKS = [
  'Review the architecture decision record',
  'Reply to the vendor questionnaire',
] as const;

export const TASK = {
  New: 'Draft the incident postmortem',
  Second: 'Schedule the security review',
} as const;

export const VALID_SIGNUP: SignupDetails = {
  fullName: 'Dana Whitfield',
  email: 'dana.whitfield@example.com',
  plan: Plan.Growth,
  seats: 12,
  notes: 'Migrating from a competitor next quarter.',
  acceptTerms: true,
};

export const PLAN_LABEL = {
  Starter: 'Starter',
  Growth: 'Growth',
  Enterprise: 'Enterprise',
} as const;

export const INVALID_EMAIL = 'dana.whitfield.example.com';

/**
 * The counter's shape, named once.
 *
 * A spec asserting `'2 remaining of 2'` inline hides the format from every
 * other spec, so a copy change breaks several files and none of them says what
 * the expected wording was.
 */
export const remainingLabel = (remaining: number, total: number): string =>
  `${remaining} remaining of ${total}`;

export const resultCountLabel = (shown: number, total: number): string =>
  `Showing ${shown} of ${total} items`;

export const confirmationSummary = (fullName: string, planLabel: string, seats: number): string =>
  `${fullName} on the ${planLabel} plan, ${seats} seat(s).`;

// The application renders these verbatim. Naming them here means a copy change
// updates one file, and a failure quotes the message the user would read.
export const ValidationMessage = {
  NameRequired: 'Enter your full name.',
  EmailRequired: 'Enter your work email.',
  EmailInvalid: 'Enter a valid email address.',
  PlanRequired: 'Choose a plan.',
  TermsRequired: 'Accept the terms to continue.',
} as const;

export const INVENTORY = {
  TotalItems: 6,
  FilterTerm: 'wear',
  FilterMatchCount: 0,
  SearchTerm: 'webcam',
  SearchMatchCount: 1,
  FirstNameAscending: 'Access badge',
  FirstNameDescending: 'Webcam',
  LowestQuantityItem: 'Laptop sleeve',
} as const;

export const TASK_COUNTS = {
  Seeded: 2,
  AfterOneRemoved: 1,
  AfterOneCompleted: 1,
  None: 0,
} as const;
