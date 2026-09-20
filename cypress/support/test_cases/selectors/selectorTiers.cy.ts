import { TEST_ID_ATTRIBUTE } from '../../constants/config';
import { ATTRIBUTE_METHOD, FOR_ATTRIBUTE, ID_PREFIX, LABEL_ELEMENT } from '../../constants/dom';
import { EXTERNAL_TIER_THREE_URL, Route } from '../../constants/routes';
import { SignupLabel } from '../../constants/testData';
import { NavTestId, SignupTestId } from '../../constants/testIds';

describe('Selector hierarchy', () => {
  it('tier 1: reaches application markup by test id', () => {
    cy.visit(Route.Tasks);

    cy.getByTestId(NavTestId.Container).should('be.visible');
  });

  it('tier 2: reaches an element through its accessible label', () => {
    // The second tier exists for markup we own but have not tagged, and it
    // doubles as an accessibility assertion: reaching a control through its
    // label passes only if the label really names that control.
    //
    // Finding the label by CSS and then finding the input by test id would
    // prove neither, because the two queries never meet: the test would pass
    // with a for attribute pointing at nothing. This walks the association
    // instead, from the label's text to its for value to the element carrying
    // that id, and only then checks it is the input the contract names.
    cy.visit(Route.Signup);

    cy.contains(LABEL_ELEMENT, SignupLabel.Email)
      .invoke(ATTRIBUTE_METHOD, FOR_ATTRIBUTE)
      .then((controlId) => {
        cy.get(`${ID_PREFIX}${String(controlId)}`)
          .should('be.enabled')
          .and('have.attr', TEST_ID_ATTRIBUTE, SignupTestId.EmailInput);
      });
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
