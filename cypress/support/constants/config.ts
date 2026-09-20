// Values cypress.config.ts and the commands need before any test runs.
// Separate from routes and test ids so that path loads nothing it does not use.

export const PREVIEW_PORT = 4173;

// One attribute, named once. cy.getByTestId in commands.ts is the only place
// that reads it, so no page object writes the attribute again.
export const TEST_ID_ATTRIBUTE = 'data-testid';
