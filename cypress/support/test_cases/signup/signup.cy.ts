import { signupActions } from '../../actions/signupActions';
import { AriaAttribute, AriaValue } from '../../constants/aria';
import {
  INVALID_EMAIL,
  PLAN_LABEL,
  VALID_SIGNUP,
  ValidationMessage,
  confirmationSummary,
} from '../../constants/testData';
import { signupRepository } from '../../repositories/signupRepository';

describe('Signup', () => {
  beforeEach(() => {
    signupActions.visit();
  });

  it('hides every error until the form is submitted', () => {
    signupRepository.fullNameError().should('not.be.visible');
    signupRepository.emailError().should('not.be.visible');
    signupRepository.planError().should('not.be.visible');
    signupRepository.termsError().should('not.be.visible');
  });

  it('reports every missing field at once rather than one at a time', () => {
    signupActions.submit();

    signupRepository.fullNameError().should('have.text', ValidationMessage.NameRequired);
    signupRepository.emailError().should('have.text', ValidationMessage.EmailRequired);
    signupRepository.planError().should('have.text', ValidationMessage.PlanRequired);
    signupRepository.termsError().should('have.text', ValidationMessage.TermsRequired);
  });

  it('distinguishes a malformed email from a missing one', () => {
    signupActions.typeEmail(INVALID_EMAIL);
    signupActions.submit();

    signupRepository.emailError().should('have.text', ValidationMessage.EmailInvalid);
  });

  it('marks an invalid field for assistive technology', () => {
    signupActions.submit();

    signupRepository.emailInput().should('have.attr', AriaAttribute.Invalid, AriaValue.True);
  });

  it('ties the error to the input that carries it', () => {
    // aria-invalid alone says something is wrong without saying what. The
    // association is what makes the message reachable by a screen reader.
    signupActions.submit();

    signupRepository.emailError().then((error) => {
      signupRepository
        .emailInput()
        .should('have.attr', AriaAttribute.DescribedBy, error.attr('id'));
    });
  });

  it('reports a field valid again once it is corrected', () => {
    signupActions.submit();
    signupActions.fill(VALID_SIGNUP);
    signupActions.submit();

    signupRepository.confirmation().should('be.visible');
  });

  it('confirms a complete submission and names the plan chosen', () => {
    signupActions.fill(VALID_SIGNUP);
    signupActions.submit();

    signupRepository
      .confirmationSummary()
      .should(
        'have.text',
        confirmationSummary(VALID_SIGNUP.fullName, PLAN_LABEL.Growth, VALID_SIGNUP.seats)
      );
  });

  it('replaces the form with the confirmation', () => {
    signupActions.fill(VALID_SIGNUP);
    signupActions.submit();

    signupRepository.form().should('not.be.visible');
    signupRepository.confirmationHeading().should('be.visible');
  });
});
