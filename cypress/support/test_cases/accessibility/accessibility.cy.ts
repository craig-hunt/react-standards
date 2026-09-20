import { signupActions } from '../../actions/signupActions';
import { Route } from '../../constants/routes';

// WCAG 2.2 AA, checked by axe rather than asserted by eye.
//
// These run against the same pages the behavior specs drive, and they run after
// an interaction as well as on load: an error message rendered on submit is
// markup the load-time check never saw. blazor-standards found three real
// defects this way, including aria-sort written onto a button.

// Not `as const`: cypress-axe types runOnly.values as a mutable string[], and
// a readonly tuple is not assignable to it. The annotation is erased at
// runtime either way, so this is a typing concession rather than a behavior
// change.
const AXE_OPTIONS: Parameters<typeof cy.checkA11y>[1] = {
  runOnly: {
    type: 'tag',
    values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'],
  },
};

describe('Accessibility', () => {
  it('reports no violations on the task list', () => {
    cy.visit(Route.Tasks);
    cy.injectAxe();

    cy.checkA11y(undefined, AXE_OPTIONS);
  });

  it('reports no violations on the signup form', () => {
    cy.visit(Route.Signup);
    cy.injectAxe();

    cy.checkA11y(undefined, AXE_OPTIONS);
  });

  it('reports no violations while the signup form shows its errors', () => {
    // The state a load-time scan never reaches. An invalid field carries
    // aria-invalid and an association to a message, and both are markup that
    // exists only after a failed submission.
    cy.visit(Route.Signup);
    cy.injectAxe();
    signupActions.submit();

    cy.checkA11y(undefined, AXE_OPTIONS);
  });

  it('reports no violations on the inventory table', () => {
    cy.visit(Route.Inventory);
    cy.injectAxe();

    cy.checkA11y(undefined, AXE_OPTIONS);
  });
});
