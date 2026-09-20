import { SignupTestId } from '../constants/testIds';

/**
 * Element retrieval only, including the error elements.
 *
 * The errors get methods of their own rather than being reached through the
 * field they sit beside, so a spec asserting a message names the element that
 * carries it rather than walking the DOM to find it.
 */
export const signupRepository = {
  heading: () => cy.getByTestId(SignupTestId.Heading),
  form: () => cy.getByTestId(SignupTestId.Form),
  fullNameInput: () => cy.getByTestId(SignupTestId.FullNameInput),
  fullNameError: () => cy.getByTestId(SignupTestId.FullNameError),
  emailInput: () => cy.getByTestId(SignupTestId.EmailInput),
  emailError: () => cy.getByTestId(SignupTestId.EmailError),
  planSelect: () => cy.getByTestId(SignupTestId.PlanSelect),
  planError: () => cy.getByTestId(SignupTestId.PlanError),
  seatsInput: () => cy.getByTestId(SignupTestId.SeatsInput),
  notesTextarea: () => cy.getByTestId(SignupTestId.NotesTextarea),
  termsCheckbox: () => cy.getByTestId(SignupTestId.TermsCheckbox),
  termsError: () => cy.getByTestId(SignupTestId.TermsError),
  submitButton: () => cy.getByTestId(SignupTestId.SubmitButton),
  confirmation: () => cy.getByTestId(SignupTestId.Confirmation),
  confirmationHeading: () => cy.getByTestId(SignupTestId.ConfirmationHeading),
  confirmationSummary: () => cy.getByTestId(SignupTestId.ConfirmationSummary),
} as const;
