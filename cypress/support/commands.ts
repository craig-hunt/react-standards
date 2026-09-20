import { TEST_ID_ATTRIBUTE } from './constants/config';

// The only sanctioned way to reach a test id, so the attribute name lives in
// exactly one place on this side of the contract. Cypress has no getByTestId of
// its own, which is the difference from Playwright, where the runner supplies
// one.
//
// The lint rule refuses a raw string passed to either command, so a spec cannot
// quietly reintroduce the literal these exist to remove.

Cypress.Commands.add('getByTestId', (testId: string) =>
  cy.get(`[${TEST_ID_ATTRIBUTE}="${testId}"]`)
);

// Scopes inside an element already in hand. The task list renders identical
// test ids on every row, so reaching one row needs a second dimension.
Cypress.Commands.add(
  'findByTestId',
  { prevSubject: 'element' },
  (subject: JQuery<HTMLElement>, testId: string) =>
    cy.wrap(subject).find(`[${TEST_ID_ATTRIBUTE}="${testId}"]`)
);
