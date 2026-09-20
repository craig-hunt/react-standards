import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { SignupPage } from './SignupPage';
import {
  AriaAttribute,
  AriaValue,
  PlanLabel,
  ValidationMessage,
  confirmationSummary,
} from '../../shared/constants';
import { SignupTestId } from '../../shared/testIds';
import { Plan } from '../../shared/types';
import { renderWithProviders } from '../../test/render';

const VALID_NAME = 'Dana Whitfield';
const VALID_EMAIL = 'dana.whitfield@example.com';
const INVALID_EMAIL = 'dana.whitfield.example.com';
const SEATS_TYPED = '12';
const SEATS_VALUE = 12;

async function fillValidForm(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByTestId(SignupTestId.FullNameInput), VALID_NAME);
  await user.type(screen.getByTestId(SignupTestId.EmailInput), VALID_EMAIL);
  await user.selectOptions(screen.getByTestId(SignupTestId.PlanSelect), Plan.Growth);
  await user.clear(screen.getByTestId(SignupTestId.SeatsInput));
  await user.type(screen.getByTestId(SignupTestId.SeatsInput), SEATS_TYPED);
  await user.click(screen.getByTestId(SignupTestId.TermsCheckbox));
}

describe('SignupPage', () => {
  it('reports every missing field at once rather than one at a time', async () => {
    const user = userEvent.setup();
    renderWithProviders(<SignupPage />);

    await user.click(screen.getByTestId(SignupTestId.SubmitButton));

    expect(screen.getByTestId(SignupTestId.FullNameError)).toHaveTextContent(
      ValidationMessage.NameRequired
    );
    expect(screen.getByTestId(SignupTestId.EmailError)).toHaveTextContent(
      ValidationMessage.EmailRequired
    );
    expect(screen.getByTestId(SignupTestId.PlanError)).toHaveTextContent(
      ValidationMessage.PlanRequired
    );
    expect(screen.getByTestId(SignupTestId.TermsError)).toHaveTextContent(
      ValidationMessage.TermsRequired
    );
  });

  it('distinguishes a malformed email from a missing one', async () => {
    const user = userEvent.setup();
    renderWithProviders(<SignupPage />);

    await user.type(screen.getByTestId(SignupTestId.EmailInput), INVALID_EMAIL);
    await user.click(screen.getByTestId(SignupTestId.SubmitButton));

    expect(screen.getByTestId(SignupTestId.EmailError)).toHaveTextContent(
      ValidationMessage.EmailInvalid
    );
  });

  it('hides an error until the form is submitted', () => {
    renderWithProviders(<SignupPage />);

    expect(screen.getByTestId(SignupTestId.FullNameError)).not.toBeVisible();
  });

  it('marks an invalid field for assistive technology', async () => {
    const user = userEvent.setup();
    renderWithProviders(<SignupPage />);

    await user.click(screen.getByTestId(SignupTestId.SubmitButton));

    expect(screen.getByTestId(SignupTestId.EmailInput)).toHaveAttribute(
      AriaAttribute.Invalid,
      AriaValue.True
    );
  });

  it('ties each error to the input it describes', async () => {
    // aria-invalid alone tells a screen-reader user that something is wrong
    // and not what. The association is what makes the message reachable.
    const user = userEvent.setup();
    renderWithProviders(<SignupPage />);

    await user.click(screen.getByTestId(SignupTestId.SubmitButton));

    const input = screen.getByTestId(SignupTestId.EmailInput);
    const error = screen.getByTestId(SignupTestId.EmailError);
    expect(input).toHaveAttribute(AriaAttribute.DescribedBy, error.id);
  });

  it('carries no invalid marking before submission', async () => {
    const user = userEvent.setup();
    renderWithProviders(<SignupPage />);

    await user.type(screen.getByTestId(SignupTestId.EmailInput), VALID_EMAIL);

    expect(screen.getByTestId(SignupTestId.EmailInput)).toHaveAttribute(
      AriaAttribute.Invalid,
      AriaValue.False
    );
  });

  it('confirms a complete submission and names the plan chosen', async () => {
    const user = userEvent.setup();
    renderWithProviders(<SignupPage />);

    await fillValidForm(user);
    await user.click(screen.getByTestId(SignupTestId.SubmitButton));

    expect(screen.getByTestId(SignupTestId.ConfirmationSummary)).toHaveTextContent(
      confirmationSummary(VALID_NAME, PlanLabel.Growth, SEATS_VALUE)
    );
  });

  it('replaces the form with the confirmation', async () => {
    const user = userEvent.setup();
    renderWithProviders(<SignupPage />);

    await fillValidForm(user);
    await user.click(screen.getByTestId(SignupTestId.SubmitButton));

    expect(screen.getByTestId(SignupTestId.Form)).not.toBeVisible();
    expect(screen.getByTestId(SignupTestId.Confirmation)).toBeVisible();
  });

  // The wording of the seat message is pinned in signupValidator.test.ts.
  // These assert the screen surfaces it and wires it up, which is the part a
  // rule test cannot see.

  it('refuses a cleared seats field rather than confirming NaN seats', async () => {
    // The form sets noValidate, so nothing else stops this. Before the rule
    // existed, an emptied field reached the confirmation and rendered
    // NaN seat(s) to the reader.
    const user = userEvent.setup();
    renderWithProviders(<SignupPage />);

    await fillValidForm(user);
    await user.clear(screen.getByTestId(SignupTestId.SeatsInput));
    await user.click(screen.getByTestId(SignupTestId.SubmitButton));

    expect(screen.getByTestId(SignupTestId.SeatsError)).toBeVisible();
    expect(screen.getByTestId(SignupTestId.Confirmation)).not.toBeVisible();
  });

  it('marks the seats field invalid and names its message', async () => {
    const user = userEvent.setup();
    renderWithProviders(<SignupPage />);

    await fillValidForm(user);
    await user.clear(screen.getByTestId(SignupTestId.SeatsInput));
    await user.click(screen.getByTestId(SignupTestId.SubmitButton));

    const input = screen.getByTestId(SignupTestId.SeatsInput);
    const error = screen.getByTestId(SignupTestId.SeatsError);
    expect(input).toHaveAttribute(AriaAttribute.Invalid, AriaValue.True);
    expect(input).toHaveAttribute(AriaAttribute.DescribedBy, error.id);
  });

  it('hides the seats error until the form is submitted', () => {
    renderWithProviders(<SignupPage />);

    expect(screen.getByTestId(SignupTestId.SeatsError)).not.toBeVisible();
  });
});
