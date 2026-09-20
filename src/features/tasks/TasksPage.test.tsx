import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { TasksPage } from './TasksPage';
import { SEEDED_TITLES } from './constants';
import {
  AriaAttribute,
  AriaRole,
  AriaValue,
  EmptyText,
  TaskCopy,
  remainingLabel,
} from '../../shared/constants';
import { TaskTestId } from '../../shared/testIds';
import { renderWithProviders } from '../../test/render';

// A component test asks what the screen shows. The rules themselves are covered
// in taskRules.test.ts, so these assert on rendering and wiring rather than
// re-testing arithmetic through a DOM.

const BOTH_TASKS = 2;
const ONE_TASK = 1;
const NO_TASKS = 0;
const NEW_TITLE = 'Draft the incident postmortem';
const BLANK_TITLE = '   ';

describe('TasksPage', () => {
  it('lists the seeded tasks on first render', () => {
    renderWithProviders(<TasksPage />);

    expect(screen.getAllByTestId(TaskTestId.ItemTitle)).toHaveLength(BOTH_TASKS);
    expect(screen.getAllByTestId(TaskTestId.ItemTitle)[0]).toHaveTextContent(SEEDED_TITLES[0]);
  });

  it('appends a typed task to the end of the list', async () => {
    const user = userEvent.setup();
    renderWithProviders(<TasksPage />);

    await user.type(screen.getByTestId(TaskTestId.Input), NEW_TITLE);
    await user.click(screen.getByTestId(TaskTestId.AddButton));

    const titles = screen.getAllByTestId(TaskTestId.ItemTitle);
    expect(titles[titles.length - 1]).toHaveTextContent(NEW_TITLE);
  });

  it('clears the input after a task is added', async () => {
    const user = userEvent.setup();
    renderWithProviders(<TasksPage />);

    await user.type(screen.getByTestId(TaskTestId.Input), NEW_TITLE);
    await user.click(screen.getByTestId(TaskTestId.AddButton));

    expect(screen.getByTestId(TaskTestId.Input)).toHaveValue(EmptyText);
  });

  it('refuses a title of only whitespace', async () => {
    const user = userEvent.setup();
    renderWithProviders(<TasksPage />);

    await user.type(screen.getByTestId(TaskTestId.Input), BLANK_TITLE);
    await user.click(screen.getByTestId(TaskTestId.AddButton));

    expect(screen.getAllByTestId(TaskTestId.Item)).toHaveLength(BOTH_TASKS);
  });

  it('counts remaining tasks as they complete', async () => {
    const user = userEvent.setup();
    renderWithProviders(<TasksPage />);

    expect(screen.getByTestId(TaskTestId.Count)).toHaveTextContent(
      remainingLabel(BOTH_TASKS, BOTH_TASKS)
    );

    await user.click(screen.getAllByTestId(TaskTestId.ItemCheckbox)[0] as HTMLElement);

    expect(screen.getByTestId(TaskTestId.Count)).toHaveTextContent(
      remainingLabel(ONE_TASK, BOTH_TASKS)
    );
  });

  it('hides the clear control until a task completes', async () => {
    const user = userEvent.setup();
    renderWithProviders(<TasksPage />);

    expect(screen.getByTestId(TaskTestId.ClearCompletedButton)).not.toBeVisible();

    await user.click(screen.getAllByTestId(TaskTestId.ItemCheckbox)[0] as HTMLElement);

    expect(screen.getByTestId(TaskTestId.ClearCompletedButton)).toBeVisible();
  });

  it('shows the empty state when a filter matches nothing', async () => {
    const user = userEvent.setup();
    renderWithProviders(<TasksPage />);

    await user.click(screen.getByTestId(TaskTestId.FilterCompleted));

    expect(screen.getByTestId(TaskTestId.EmptyState)).toBeVisible();
    expect(screen.queryAllByTestId(TaskTestId.Item)).toHaveLength(NO_TASKS);
  });

  it('removes a task through its delete control', async () => {
    const user = userEvent.setup();
    renderWithProviders(<TasksPage />);

    await user.click(screen.getAllByTestId(TaskTestId.DeleteButton)[0] as HTMLElement);

    const titles = screen.getAllByTestId(TaskTestId.ItemTitle);
    expect(titles).toHaveLength(ONE_TASK);
    expect(titles[0]).toHaveTextContent(SEEDED_TITLES[1]);
  });

  it('names the filter group for assistive technology', () => {
    // A group of unlabelled toggle buttons reads as three loose controls, so
    // the label is what makes them a filter rather than a row of buttons.
    renderWithProviders(<TasksPage />);

    expect(
      screen.getByRole(AriaRole.Group, { name: TaskCopy.FilterGroupLabel })
    ).toBeInTheDocument();
  });

  it('marks the active filter as pressed rather than only styling it', async () => {
    const user = userEvent.setup();
    renderWithProviders(<TasksPage />);

    await user.click(screen.getByTestId(TaskTestId.FilterActive));

    expect(screen.getByTestId(TaskTestId.FilterActive)).toHaveAttribute(
      AriaAttribute.Pressed,
      AriaValue.True
    );
    expect(screen.getByTestId(TaskTestId.FilterAll)).toHaveAttribute(
      AriaAttribute.Pressed,
      AriaValue.False
    );
  });
});
