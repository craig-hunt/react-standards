import { TaskFilter } from '../../shared/types';
import type { Task } from '../../shared/types';

/**
 * The task list's rules, with no React in sight.
 *
 * Every decision the screen makes lives here as a pure function, which is what
 * lets mutation testing reach them. A rule written inside a component can only
 * be reached by rendering, and a mutant that survives there tells you a screen
 * was not asserted rather than that a rule was not tested.
 */

export function visibleTasks(tasks: readonly Task[], filter: TaskFilter): readonly Task[] {
  switch (filter) {
    case TaskFilter.Active:
      return tasks.filter((task) => !task.completed);
    case TaskFilter.Completed:
      return tasks.filter((task) => task.completed);
    case TaskFilter.All:
      return tasks;
  }
}

export function remainingCount(tasks: readonly Task[]): number {
  return tasks.filter((task) => !task.completed).length;
}

export function hasCompleted(tasks: readonly Task[]): boolean {
  return tasks.some((task) => task.completed);
}

/**
 * Adds a task, or returns the list unchanged.
 *
 * A title of spaces is not a title. Rejecting it here rather than in the form
 * keeps the rule testable and keeps the form's job to collecting input.
 */
export function addTask(tasks: readonly Task[], title: string, nextId: number): readonly Task[] {
  const trimmed = title.trim();
  if (trimmed.length === 0) {
    return tasks;
  }

  return [...tasks, { id: nextId, title: trimmed, completed: false }];
}

export function toggleTask(tasks: readonly Task[], id: number): readonly Task[] {
  return tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task));
}

export function removeTask(tasks: readonly Task[], id: number): readonly Task[] {
  return tasks.filter((task) => task.id !== id);
}

export function clearCompleted(tasks: readonly Task[]): readonly Task[] {
  return tasks.filter((task) => !task.completed);
}

export function nextId(tasks: readonly Task[]): number {
  return tasks.reduce((highest, task) => Math.max(highest, task.id), 0) + 1;
}
