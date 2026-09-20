import { EMAIL_PATTERN, ValidationMessage } from '../../shared/constants';
import type { SignupDetails, SignupErrors } from '../../shared/types';

/**
 * The signup rules, separate from the form that collects them.
 *
 * The form's job is gathering input and reporting what this returns. Validation
 * written inside the component would need a rendered screen to exercise, which
 * turns a rule test into a DOM test and leaves the rules themselves covered
 * only incidentally.
 *
 * Every message is a constant because the sibling suites assert on the exact
 * wording a user reads.
 */
export function validateSignup(details: SignupDetails): SignupErrors {
  const errors: {
    fullName?: string;
    email?: string;
    plan?: string;
    terms?: string;
  } = {};

  if (details.fullName.trim().length === 0) {
    errors.fullName = ValidationMessage.NameRequired;
  }

  const email = details.email.trim();
  if (email.length === 0) {
    errors.email = ValidationMessage.EmailRequired;
  } else if (!EMAIL_PATTERN.test(email)) {
    errors.email = ValidationMessage.EmailInvalid;
  }

  if (details.plan === '') {
    errors.plan = ValidationMessage.PlanRequired;
  }

  if (!details.acceptTerms) {
    errors.terms = ValidationMessage.TermsRequired;
  }

  return errors;
}

export function isValid(errors: SignupErrors): boolean {
  return Object.keys(errors).length === 0;
}
