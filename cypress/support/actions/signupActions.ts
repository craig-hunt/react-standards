import { Route } from '../constants/routes';
import { signupRepository } from '../repositories/signupRepository';
import type { SignupDetails } from '../types/index';

/**
 * Interactions, built from repository methods.
 *
 * `fill` takes the whole set rather than a field at a time, because a spec
 * about validation cares which field was left out, not the order the others
 * were typed in. `submitEmpty` exists for the same reason: naming the gesture
 * keeps the spec reading as behavior.
 */
export const signupActions = {
  visit: (): void => {
    cy.visit(Route.Signup);
  },

  fill: (details: SignupDetails): void => {
    signupRepository.fullNameInput().type(details.fullName);
    signupRepository.emailInput().type(details.email);
    signupRepository.planSelect().select(details.plan);
    signupRepository.seatsInput().clear();
    signupRepository.seatsInput().type(String(details.seats));
    signupRepository.notesTextarea().type(details.notes);
    if (details.acceptTerms) {
      signupRepository.termsCheckbox().check();
    }
  },

  typeEmail: (email: string): void => {
    signupRepository.emailInput().type(email);
  },

  typeSeats: (seats: string): void => {
    signupRepository.seatsInput().clear();
    signupRepository.seatsInput().type(seats);
  },

  /** Leaves the field empty, which reaches the validator as NaN. */
  clearSeats: (): void => {
    signupRepository.seatsInput().clear();
  },

  submit: (): void => {
    signupRepository.submitButton().click();
  },
} as const;
