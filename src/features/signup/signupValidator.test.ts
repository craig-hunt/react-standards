import { describe, expect, it } from 'vitest';

import { EMPTY_SIGNUP } from './constants';
import { isValid, validateSignup } from './signupValidator';
import { SeatLimit, ValidationMessage, seatsRangeMessage } from '../../shared/constants';
import { Plan } from '../../shared/types';
import type { SignupDetails } from '../../shared/types';

const VALID_NAME = 'Dana Whitfield';
const VALID_EMAIL = 'dana.whitfield@example.com';
const INVALID_EMAIL = 'dana.whitfield.example.com';
const WHITESPACE = '   ';
const PADDED_EMAIL = '  dana.whitfield@example.com  ';
const SEATS = 12;
const TOO_FEW_SEATS = 0;
const TOO_MANY_SEATS = 501;
const FRACTIONAL_SEATS = 2.5;

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

describe('validateSignup, seats', () => {
  // The form sets noValidate, so the browser enforces neither the input's type
  // nor its min and max. These checks are the only gate.

  it('rejects a cleared field, which arrives as NaN', () => {
    // The defect this rule exists for. NaN passed every other check, reached
    // the confirmation, and rendered NaN seat(s) to the reader.
    const errors = validateSignup({ ...validDetails(), seats: Number.NaN });

    expect(errors.seats).toBe(seatsRangeMessage(SeatLimit.Minimum, SeatLimit.Maximum));
  });

  it('rejects fewer seats than the minimum', () => {
    const errors = validateSignup({ ...validDetails(), seats: TOO_FEW_SEATS });

    expect(errors.seats).toBe(seatsRangeMessage(SeatLimit.Minimum, SeatLimit.Maximum));
  });

  it('rejects more seats than the maximum', () => {
    const errors = validateSignup({ ...validDetails(), seats: TOO_MANY_SEATS });

    expect(errors.seats).toBe(seatsRangeMessage(SeatLimit.Minimum, SeatLimit.Maximum));
  });

  it('rejects a fractional seat', () => {
    const errors = validateSignup({ ...validDetails(), seats: FRACTIONAL_SEATS });

    expect(errors.seats).toBeDefined();
  });

  it('accepts the minimum', () => {
    const errors = validateSignup({ ...validDetails(), seats: SeatLimit.Minimum });

    expect(errors.seats).toBeUndefined();
  });

  it('accepts the maximum', () => {
    // Both boundaries, because an off-by-one here refuses a legitimate order
    // and says nothing about why.
    const errors = validateSignup({ ...validDetails(), seats: SeatLimit.Maximum });

    expect(errors.seats).toBeUndefined();
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
