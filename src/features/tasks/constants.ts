import { SeedTaskTitle } from '../../shared/constants';
import type { Task } from '../../shared/types';

// The rows a fresh session starts with.
//
// Named rather than written inline because the sibling suites assert on this
// exact text, and a reader looking for it should find it by name rather than by
// scrolling an array.

export const FIRST_ID = 1;

export const SEEDED_TITLES = [
  SeedTaskTitle.ArchitectureRecord,
  SeedTaskTitle.VendorQuestionnaire,
] as const;

export const seededTasks = (): readonly Task[] =>
  SEEDED_TITLES.map((title, index) => ({
    id: FIRST_ID + index,
    title,
    completed: false,
  }));
