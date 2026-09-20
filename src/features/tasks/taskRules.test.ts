import { describe, expect, it } from 'vitest';

import { SEEDED_TITLES, seededTasks } from './constants';
import {
  addTask,
  clearCompleted,
  hasCompleted,
  nextId,
  remainingCount,
  removeTask,
  toggleTask,
  visibleTasks,
} from './taskRules';
import { TaskFilter } from '../../shared/types';
import type { Task } from '../../shared/types';

// Expected values are named because the lint rule treats a bare 2 in an
// assertion as a magic number, and because a test reading `BOTH_TASKS` says
// what it checks while a `2` leaves the reader counting.
const BOTH_TASKS = 2;
const ONE_TASK = 1;
const FIRST_ID = 1;
const SECOND_ID = 2;
const THIRD_ID = 3;
const NEW_TITLE = 'Draft the incident postmortem';
const BLANK_TITLE = '   ';
const PADDED_TITLE = '  Schedule the security review  ';
const TRIMMED_TITLE = 'Schedule the security review';

function completedFirst(): readonly Task[] {
  return toggleTask(seededTasks(), FIRST_ID);
}

describe('visibleTasks', () => {
  it('returns every task under the All filter', () => {
    expect(visibleTasks(seededTasks(), TaskFilter.All)).toHaveLength(BOTH_TASKS);
  });

  it('excludes completed tasks under the Active filter', () => {
    const shown = visibleTasks(completedFirst(), TaskFilter.Active);

    expect(shown).toHaveLength(ONE_TASK);
    expect(shown[0]?.title).toBe(SEEDED_TITLES[1]);
  });

  it('returns only completed tasks under the Completed filter', () => {
    const shown = visibleTasks(completedFirst(), TaskFilter.Completed);

    expect(shown).toHaveLength(ONE_TASK);
    expect(shown[0]?.title).toBe(SEEDED_TITLES[0]);
  });
});

describe('remainingCount', () => {
  it('counts every task while none is complete', () => {
    expect(remainingCount(seededTasks())).toBe(BOTH_TASKS);
  });

  it('drops as tasks complete', () => {
    expect(remainingCount(completedFirst())).toBe(ONE_TASK);
  });
});

describe('hasCompleted', () => {
  it('reports nothing completed on a fresh list', () => {
    expect(hasCompleted(seededTasks())).toBe(false);
  });

  it('reports a completion once one exists', () => {
    expect(hasCompleted(completedFirst())).toBe(true);
  });
});

describe('addTask', () => {
  it('appends the new task to the end', () => {
    const tasks = addTask(seededTasks(), NEW_TITLE, THIRD_ID);

    expect(tasks).toHaveLength(THIRD_ID);
    expect(tasks[tasks.length - 1]?.title).toBe(NEW_TITLE);
  });

  it('refuses a title of only whitespace', () => {
    expect(addTask(seededTasks(), BLANK_TITLE, THIRD_ID)).toHaveLength(BOTH_TASKS);
  });

  it('trims the title it stores', () => {
    const tasks = addTask(seededTasks(), PADDED_TITLE, THIRD_ID);

    expect(tasks[tasks.length - 1]?.title).toBe(TRIMMED_TITLE);
  });

  it('opens a new task rather than completing it', () => {
    const tasks = addTask(seededTasks(), NEW_TITLE, THIRD_ID);

    expect(tasks[tasks.length - 1]?.completed).toBe(false);
  });
});

describe('toggleTask', () => {
  it('completes the task it names', () => {
    expect(completedFirst()[0]?.completed).toBe(true);
  });

  it('leaves every other task alone', () => {
    expect(completedFirst()[1]?.completed).toBe(false);
  });

  it('reopens a task toggled twice', () => {
    expect(toggleTask(completedFirst(), FIRST_ID)[0]?.completed).toBe(false);
  });
});

describe('removeTask', () => {
  it('drops the task it names and keeps the rest', () => {
    const tasks = removeTask(seededTasks(), FIRST_ID);

    expect(tasks).toHaveLength(ONE_TASK);
    expect(tasks[0]?.title).toBe(SEEDED_TITLES[1]);
  });
});

describe('clearCompleted', () => {
  it('removes completed tasks and keeps the open ones', () => {
    const tasks = clearCompleted(completedFirst());

    expect(tasks).toHaveLength(ONE_TASK);
    expect(tasks[0]?.title).toBe(SEEDED_TITLES[1]);
  });
});

describe('nextId', () => {
  it('follows the highest id in use', () => {
    expect(nextId(seededTasks())).toBe(THIRD_ID);
  });

  it('starts at one for an empty list', () => {
    expect(nextId([])).toBe(FIRST_ID);
  });

  it('does not reuse an id after the highest task is removed', () => {
    // A count-based next id would hand out 2 here, which the surviving task
    // already holds, and two rows would then share a React key and a checkbox.
    const tasks = removeTask(seededTasks(), FIRST_ID);

    expect(tasks[0]?.id).toBe(SECOND_ID);
    expect(nextId(tasks)).toBe(THIRD_ID);
  });
});
