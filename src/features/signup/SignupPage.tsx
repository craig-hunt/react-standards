import { useState } from 'react';

import { EMPTY_SIGNUP, PLAN_OPTIONS } from './constants';
import { isValid, validateSignup } from './signupValidator';
import {
  AriaValue,
  ElementId,
  EmptyText,
  NotesRows,
  SeatLimit,
  SignupCopy,
  SignupFieldName,
  Surface,
  confirmationSummary,
} from '../../shared/constants';
import { testId } from '../../shared/testId';
import { SignupTestId } from '../../shared/testIds';
import { SignupStateKind } from '../../shared/types';
import type { Plan, SignupDetails, SignupState } from '../../shared/types';

/**
 * The signup form.
 *
 * The rules live in signupValidator; this collects input and reports what the
 * validator returned. The screen's own state is a discriminated union rather
 * than a submitted boolean beside an errors object, so "submitted with errors"
 * cannot be represented at all.
 *
 * aria-invalid appears only while a field is invalid, and each error is tied to
 * its input through aria-describedby. Marking a field invalid without naming
 * why tells a screen-reader user that something is wrong and not what.
 */
export function SignupPage() {
  const [details, setDetails] = useState<SignupDetails>(EMPTY_SIGNUP);
  const [state, setState] = useState<SignupState>({
    kind: SignupStateKind.Editing,
    errors: {},
  });

  function update<K extends keyof SignupDetails>(key: K, value: SignupDetails[K]) {
    setDetails((current) => ({ ...current, [key]: value }));
  }

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const errors = validateSignup(details);
    if (!isValid(errors)) {
      setState({ kind: SignupStateKind.Editing, errors });
      return;
    }

    const chosen = PLAN_OPTIONS.find((option) => option.value === details.plan);
    setState({
      kind: SignupStateKind.Submitted,
      summary: confirmationSummary(
        details.fullName.trim(),
        chosen?.label ?? EmptyText,
        details.seats
      ),
    });
  }

  const errors = state.kind === SignupStateKind.Editing ? state.errors : {};
  const submitted = state.kind === SignupStateKind.Submitted;

  return (
    <>
      <h1 {...testId(SignupTestId.Heading)} className={Surface.PageHeading}>
        {SignupCopy.Heading}
      </h1>

      <form
        {...testId(SignupTestId.Form)}
        onSubmit={submit}
        noValidate
        autoComplete="off"
        hidden={submitted}
        className={Surface.Section}
      >
        <div className={Surface.Field}>
          <label htmlFor={ElementId.FullName} className={Surface.Label}>
            {SignupCopy.FullNameLabel}
          </label>
          <input
            id={ElementId.FullName}
            {...testId(SignupTestId.FullNameInput)}
            type="text"
            value={details.fullName}
            aria-invalid={errors.fullName !== undefined}
            aria-describedby={errors.fullName === undefined ? undefined : ElementId.FullNameError}
            onChange={(event) => update(SignupFieldName.FullName, event.target.value)}
            className={Surface.Input}
          />
          <p
            id={ElementId.FullNameError}
            {...testId(SignupTestId.FullNameError)}
            hidden={errors.fullName === undefined}
            className={Surface.Error}
          >
            {errors.fullName ?? EmptyText}
          </p>
        </div>

        <div className={Surface.Field}>
          <label htmlFor={ElementId.Email} className={Surface.Label}>
            {SignupCopy.EmailLabel}
          </label>
          <input
            id={ElementId.Email}
            {...testId(SignupTestId.EmailInput)}
            type="email"
            value={details.email}
            aria-invalid={errors.email !== undefined}
            aria-describedby={errors.email === undefined ? undefined : ElementId.EmailError}
            onChange={(event) => update(SignupFieldName.Email, event.target.value)}
            className={Surface.Input}
          />
          <p
            id={ElementId.EmailError}
            {...testId(SignupTestId.EmailError)}
            hidden={errors.email === undefined}
            className={Surface.Error}
          >
            {errors.email ?? EmptyText}
          </p>
        </div>

        <div className={Surface.Field}>
          <label htmlFor={ElementId.Plan} className={Surface.Label}>
            {SignupCopy.PlanLabel}
          </label>
          <select
            id={ElementId.Plan}
            {...testId(SignupTestId.PlanSelect)}
            value={details.plan}
            aria-invalid={errors.plan !== undefined}
            aria-describedby={errors.plan === undefined ? undefined : ElementId.PlanError}
            onChange={(event) => update(SignupFieldName.Plan, event.target.value as Plan | '')}
            className={Surface.Input}
          >
            <option value={EmptyText}>{SignupCopy.PlanPlaceholder}</option>
            {PLAN_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <p
            id={ElementId.PlanError}
            {...testId(SignupTestId.PlanError)}
            hidden={errors.plan === undefined}
            className={Surface.Error}
          >
            {errors.plan ?? EmptyText}
          </p>
        </div>

        <div className={Surface.Field}>
          <label htmlFor={ElementId.Seats} className={Surface.Label}>
            {SignupCopy.SeatsLabel}
          </label>
          {/* min and max are advisory here: noValidate turns the browser's own
              enforcement off, so signupValidator is the only gate. They stay
              because they tell a screen reader the permitted range. */}
          <input
            id={ElementId.Seats}
            {...testId(SignupTestId.SeatsInput)}
            type="number"
            inputMode="numeric"
            min={SeatLimit.Minimum}
            max={SeatLimit.Maximum}
            value={details.seats}
            aria-invalid={errors.seats !== undefined}
            aria-describedby={errors.seats === undefined ? undefined : ElementId.SeatsError}
            onChange={(event) => update(SignupFieldName.Seats, event.target.valueAsNumber)}
            className={Surface.Input}
          />
          <p
            id={ElementId.SeatsError}
            {...testId(SignupTestId.SeatsError)}
            hidden={errors.seats === undefined}
            className={Surface.Error}
          >
            {errors.seats ?? EmptyText}
          </p>
        </div>

        <div className={Surface.Field}>
          <label htmlFor={ElementId.Notes} className={Surface.Label}>
            {SignupCopy.NotesLabel}
          </label>
          <textarea
            id={ElementId.Notes}
            {...testId(SignupTestId.NotesTextarea)}
            rows={NotesRows}
            value={details.notes}
            onChange={(event) => update(SignupFieldName.Notes, event.target.value)}
            className={Surface.Textarea}
          />
        </div>

        <div className={Surface.Field}>
          <div className={Surface.Row}>
            <input
              id={ElementId.Terms}
              {...testId(SignupTestId.TermsCheckbox)}
              type="checkbox"
              checked={details.acceptTerms}
              aria-invalid={errors.terms !== undefined}
              aria-describedby={errors.terms === undefined ? undefined : ElementId.TermsError}
              onChange={(event) => update(SignupFieldName.AcceptTerms, event.target.checked)}
            />
            <label htmlFor={ElementId.Terms} className={Surface.Label}>
              {SignupCopy.TermsLabel}
            </label>
          </div>
          <p
            id={ElementId.TermsError}
            {...testId(SignupTestId.TermsError)}
            hidden={errors.terms === undefined}
            className={Surface.Error}
          >
            {errors.terms ?? EmptyText}
          </p>
        </div>

        <div className={Surface.Row}>
          <button type="submit" {...testId(SignupTestId.SubmitButton)} className={Surface.Action}>
            {SignupCopy.Submit}
          </button>
        </div>
      </form>

      {/* role=status announces the confirmation without moving focus, which
          keeps a keyboard user where they were while still telling a screen
          reader the submission succeeded. */}
      <div
        {...testId(SignupTestId.Confirmation)}
        role="status"
        aria-live={AriaValue.Polite}
        hidden={!submitted}
        className={Surface.Confirmation}
      >
        <h2 {...testId(SignupTestId.ConfirmationHeading)} className={Surface.PageHeading}>
          {SignupCopy.ConfirmationHeading}
        </h2>
        <p {...testId(SignupTestId.ConfirmationSummary)} className={Surface.Muted}>
          {state.kind === SignupStateKind.Submitted ? state.summary : EmptyText}
        </p>
      </div>
    </>
  );
}
