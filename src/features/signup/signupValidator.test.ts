import { describe, expect, it } from 'vitest';

import { EMPTY_SIGNUP } from './constants';
import { isValid, validateSignup } from './signupValidator';
import { ValidationMessage } from '../../shared/constants';
import { Plan } from '../../shared/types';
import type { SignupDetails } from '../../shared/types';

const VALID_NAME = 'Dana Whitfield';
const VALID_EMAIL = 'dana.whitfield@example.com';
const INVALID_EMAIL = 'dana.whitfield.example.com';
const WHITESPACE = '   ';
const PADDED_EMAIL = '  dana.whitfield@example.com  ';
const SEATS = 12;

function validDetails(): SignupDetails {
  return {
    fullName: VALID_NAME,
    email: VALID_EMAIL,
    plan: Plan.Growth,
    seats: SEATS,
    notes: EMPTY_SIGNUP.notes,
    acceptTerms: true,
  };
}

describe('validateSignup', () => {
  it('accepts a complete form', () => {
    expect(validateSignup(validDetails())).toEqual({});
  });

  it('requires a full name', () => {
    const errors = validateSignup({ ...validDetails(), fullName: EMPTY_SIGNUP.fullName });

    expect(errors.fullName).toBe(ValidationMessage.NameRequired);
  });

  it('treats a name of only whitespace as missing', () => {
    const errors = validateSignup({ ...validDetails(), fullName: WHITESPACE });

    expect(errors.fullName).toBe(ValidationMessage.NameRequired);
  });

  it('requires an email', () => {
    const errors = validateSignup({ ...validDetails(), email: EMPTY_SIGNUP.email });

    expect(errors.email).toBe(ValidationMessage.EmailRequired);
  });

  it('distinguishes a malformed email from a missing one', () => {
    // Two different messages, because "enter an email" tells someone who just
    // entered one that the application did not notice.
    const errors = validateSignup({ ...validDetails(), email: INVALID_EMAIL });

    expect(errors.email).toBe(ValidationMessage.EmailInvalid);
  });

  it('accepts an email padded with spaces', () => {
    const errors = validateSignup({ ...validDetails(), email: PADDED_EMAIL });

    expect(errors.email).toBeUndefined();
  });

  it('requires a plan', () => {
    const errors = validateSignup({ ...validDetails(), plan: EMPTY_SIGNUP.plan });

    expect(errors.plan).toBe(ValidationMessage.PlanRequired);
  });

  it('requires the terms to be accepted', () => {
    const errors = validateSignup({ ...validDetails(), acceptTerms: false });

    expect(errors.terms).toBe(ValidationMessage.TermsRequired);
  });

  it('reports every problem at once rather than one at a time', () => {
    const errors = validateSignup(EMPTY_SIGNUP);

    expect(errors.fullName).toBe(ValidationMessage.NameRequired);
    expect(errors.email).toBe(ValidationMessage.EmailRequired);
    expect(errors.plan).toBe(ValidationMessage.PlanRequired);
    expect(errors.terms).toBe(ValidationMessage.TermsRequired);
  });
});

describe('isValid', () => {
  it('accepts an empty error set', () => {
    expect(isValid({})).toBe(true);
  });

  it('rejects any error at all', () => {
    expect(isValid({ terms: ValidationMessage.TermsRequired })).toBe(false);
  });
});
