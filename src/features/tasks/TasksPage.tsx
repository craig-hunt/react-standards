import { useReducer, useState } from 'react';

import { seededTasks } from './constants';
import {
  addTask,
  clearCompleted,
  hasCompleted,
  nextId,
  removeTask,
  remainingCount,
  toggleTask,
  visibleTasks,
} from './taskRules';
import {
  AriaValue,
  ElementId,
  EmptyText,
  Surface,
  TaskCopy,
  deleteTaskLabel,
  markCompleteLabel,
  remainingLabel,
} from '../../shared/constants';
import { testId } from '../../shared/testId';
import { TaskTestId } from '../../shared/testIds';
import { TaskActionKind, TaskFilter } from '../../shared/types';
import type { Task } from '../../shared/types';

/**
 * The task list.
 *
 * Every decision this screen appears to make lives in taskRules. What remains
 * here is the shape of the markup and which rule runs on which event, which is
 * what a component is for.
 *
 * useReducer rather than several useState calls: the list and the id counter
 * change together, and splitting them invites a render where one has advanced
 * and the other has not.
 */

type Action =
  | { readonly kind: typeof TaskActionKind.Add; readonly title: string }
  | { readonly kind: typeof TaskActionKind.Toggle; readonly id: number }
  | { readonly kind: typeof TaskActionKind.Remove; readonly id: number }
  | { readonly kind: typeof TaskActionKind.Clear };

function reducer(tasks: readonly Task[], action: Action): readonly Task[] {
  switch (action.kind) {
    case TaskActionKind.Add:
      return addTask(tasks, action.title, nextId(tasks));
    case TaskActionKind.Toggle:
      return toggleTask(tasks, action.id);
    case TaskActionKind.Remove:
      return removeTask(tasks, action.id);
    case TaskActionKind.Clear:
      return clearCompleted(tasks);
  }
}

export function TasksPage() {
  const [tasks, dispatch] = useReducer(reducer, undefined, seededTasks);
  const [title, setTitle] = useState(EmptyText);
  const [filter, setFilter] = useState<TaskFilter>(TaskFilter.All);

  const shown = visibleTasks(tasks, filter);

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    dispatch({ kind: TaskActionKind.Add, title });
    setTitle(EmptyText);
  }

  return (
    <>
      <h1 {...testId(TaskTestId.Heading)} className={Surface.PageHeading}>
        {TaskCopy.Heading}
      </h1>

      <form
        {...testId(TaskTestId.Form)}
        onSubmit={submit}
        autoComplete="off"
        className={Surface.Section}
      >
        <div className={Surface.Field}>
          <label htmlFor={ElementId.NewTask} className={Surface.Label}>
            {TaskCopy.AddLabel}
          </label>
          <div className={Surface.Row}>
            <input
              id={ElementId.NewTask}
              {...testId(TaskTestId.Input)}
              type="text"
              value={title}
              placeholder={TaskCopy.AddPlaceholder}
              onChange={(event) => setTitle(event.target.value)}
              className={Surface.Input}
            />
            <button type="submit" {...testId(TaskTestId.AddButton)} className={Surface.Action}>
              {TaskCopy.AddButton}
            </button>
          </div>
        </div>
      </form>

      {/* Polite rather than assertive: the count changes as a result of what
          the reader just did, so announcing it need not interrupt them. */}
      <p {...testId(TaskTestId.Count)} aria-live={AriaValue.Polite} className={Surface.Muted}>
        {remainingLabel(remainingCount(tasks), tasks.length)}
      </p>

      <ul {...testId(TaskTestId.List)} className={Surface.List}>
        {shown.map((task) => (
          <li key={task.id} {...testId(TaskTestId.Item)} className={Surface.ListRow}>
            <input
              type="checkbox"
              {...testId(TaskTestId.ItemCheckbox)}
              checked={task.completed}
              aria-label={markCompleteLabel(task.title)}
              onChange={() => dispatch({ kind: TaskActionKind.Toggle, id: task.id })}
            />
            {/* Completion reads through the checkbox state as well as the
                strike-through, so it does not depend on seeing a color. */}
            <span
              {...testId(TaskTestId.ItemTitle)}
              className={task.completed ? Surface.Completed : EmptyText}
            >
              {task.title}
            </span>
            <button
              type="button"
              {...testId(TaskTestId.DeleteButton)}
              aria-label={deleteTaskLabel(task.title)}
              onClick={() => dispatch({ kind: TaskActionKind.Remove, id: task.id })}
              className={Surface.Quiet}
            >
              {TaskCopy.DeleteButton}
            </button>
          </li>
        ))}
      </ul>

      <div
        {...testId(TaskTestId.Filters)}
        role="group"
        aria-label={TaskCopy.FilterGroupLabel}
        className={Surface.Row}
      >
        <button
          type="button"
          {...testId(TaskTestId.FilterAll)}
          aria-pressed={filter === TaskFilter.All}
          onClick={() => setFilter(TaskFilter.All)}
          className={Surface.Toggle}
        >
          {TaskCopy.FilterAll}
        </button>
        <button
          type="button"
          {...testId(TaskTestId.FilterActive)}
          aria-pressed={filter === TaskFilter.Active}
          onClick={() => setFilter(TaskFilter.Active)}
          className={Surface.Toggle}
        >
          {TaskCopy.FilterActive}
        </button>
        <button
          type="button"
          {...testId(TaskTestId.FilterCompleted)}
          aria-pressed={filter === TaskFilter.Completed}
          onClick={() => setFilter(TaskFilter.Completed)}
          className={Surface.Toggle}
        >
          {TaskCopy.FilterCompleted}
        </button>
      </div>

      <button
        type="button"
        {...testId(TaskTestId.ClearCompletedButton)}
        hidden={!hasCompleted(tasks)}
        onClick={() => dispatch({ kind: TaskActionKind.Clear })}
        className={Surface.Quiet}
      >
        {TaskCopy.ClearCompleted}
      </button>

      <p {...testId(TaskTestId.EmptyState)} hidden={shown.length > 0} className={Surface.Muted}>
        {TaskCopy.EmptyState}
      </p>
    </>
  );
}
