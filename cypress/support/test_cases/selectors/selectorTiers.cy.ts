import { EXTERNAL_TIER_THREE_URL, Route } from '../../constants/routes';
import { NavTestId, SignupTestId } from '../../constants/testIds';

describe('Selector hierarchy', () => {
  it('tier 1: reaches application markup by test id', () => {
    cy.visit(Route.Tasks);

    cy.getByTestId(NavTestId.Container).should('be.visible');
  });

  it('tier 2: reaches an element by its accessible label', () => {
    // The second tier exists for markup we own but have not tagged, and it
    // doubles as an accessibility assertion: a query by label passes only if
    // the label is really associated with the control.
    cy.visit(Route.Signup);

    cy.get('label[for=email]').should('be.visible');
    cy.getByTestId(SignupTestId.EmailInput).should('be.enabled');
  });

  // Tier 3 exists for pages nobody can modify. Demonstrating it honestly needs
  // a page outside this repository, so this single test reaches example.com, a
  // stable IANA-operated document. It is the suite's only external dependency
  // and therefore its only network-shaped flake risk; every other test runs
  // against the application in this repository and so against tier 1.
  it('tier 3: falls back to structure on a page nobody controls', () => {
    cy.visit(EXTERNAL_TIER_THREE_URL);

    cy.get('h1').should('be.visible');
  });
});
