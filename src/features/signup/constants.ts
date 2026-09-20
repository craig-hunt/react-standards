import { PlanLabel, SeatLimit } from '../../shared/constants';
import { Plan } from '../../shared/types';
import type { SignupDetails } from '../../shared/types';

// The plan options, in the order the select renders them.
//
// A label and its value travel together. Declaring them apart lets one change
// without the other, and the confirmation summary reads the label, so a drift
// shows up as a sentence naming the wrong plan rather than as a type error.

export const PLAN_OPTIONS = [
  { value: Plan.Starter, label: PlanLabel.Starter },
  { value: Plan.Growth, label: PlanLabel.Growth },
  { value: Plan.Enterprise, label: PlanLabel.Enterprise },
] as const;

export const EMPTY_SIGNUP: SignupDetails = {
  fullName: '',
  email: '',
  plan: '',
  seats: SeatLimit.Default,
  notes: '',
  acceptTerms: false,
};
