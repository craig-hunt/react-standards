import { taskActions } from '../../actions/taskActions';
import { SEEDED_TASKS, TASK, TASK_COUNTS, remainingLabel } from '../../constants/testData';
import { TaskTestId } from '../../constants/testIds';
import { taskRepository } from '../../repositories/taskRepository';
import { TaskFilter } from '../../types/index';

describe('Task list', () => {
  beforeEach(() => {
    taskActions.visit();
  });

  it('displays the seeded tasks on load', () => {
    taskRepository.taskTitles().should('have.length', SEEDED_TASKS.length);
    taskRepository.taskTitles().first().should('have.text', SEEDED_TASKS[0]);
  });

  it('appends a new task to the end of the list', () => {
    taskActions.add(TASK.New);

    taskRepository.taskTitles().last().should('have.text', TASK.New);
  });

  it('clears the input once a task is added', () => {
    taskActions.add(TASK.New);

    taskRepository.newTaskInput().should('have.value', '');
  });

  it('refuses an empty task and leaves the list unchanged', () => {
    taskActions.submitEmpty();

    taskRepository.taskItems().should('have.length', TASK_COUNTS.Seeded);
  });

  it('marks a task completed when its checkbox is toggled', () => {
    taskActions.toggle(SEEDED_TASKS[0]);

    taskRepository.checkboxFor(SEEDED_TASKS[0]).should('be.checked');
  });

  it('counts remaining tasks as they complete', () => {
    taskRepository
      .taskCount()
      .should('have.text', remainingLabel(TASK_COUNTS.Seeded, TASK_COUNTS.Seeded));

    taskActions.toggle(SEEDED_TASKS[0]);

    taskRepository
      .taskCount()
      .should('have.text', remainingLabel(TASK_COUNTS.AfterOneCompleted, TASK_COUNTS.Seeded));
  });

  it('excludes completed tasks from the Active filter', () => {
    taskActions.toggle(SEEDED_TASKS[0]);
    taskActions.filterBy(TaskFilter.Active);

    taskRepository.taskTitles().should('have.length', TASK_COUNTS.AfterOneRemoved);
    taskRepository.taskTitles().first().should('have.text', SEEDED_TASKS[1]);
  });

  it('shows only completed tasks under the Completed filter', () => {
    taskActions.toggle(SEEDED_TASKS[0]);
    taskActions.filterBy(TaskFilter.Completed);

    taskRepository.taskTitles().should('have.length', TASK_COUNTS.AfterOneCompleted);
    taskRepository.taskTitles().first().should('have.text', SEEDED_TASKS[0]);
  });

  it('reports an empty state when a filter matches nothing', () => {
    taskActions.filterBy(TaskFilter.Completed);

    taskRepository.emptyState().should('be.visible');
    taskRepository.taskItems().should('not.exist');
  });

  it('removes a task when its delete control is used', () => {
    taskActions.remove(SEEDED_TASKS[0]);

    taskRepository.taskTitles().should('have.length', TASK_COUNTS.AfterOneRemoved);
    taskRepository.taskTitles().first().should('have.text', SEEDED_TASKS[1]);
  });

  it('hides the clear control until something completes', () => {
    taskRepository.clearCompletedButton().should('not.be.visible');

    taskActions.toggle(SEEDED_TASKS[0]);

    taskRepository.clearCompletedButton().should('be.visible');
  });

  it('removes completed tasks and hides the clear control again', () => {
    taskActions.toggle(SEEDED_TASKS[0]);
    taskActions.clearCompleted();

    taskRepository.taskTitles().should('have.length', TASK_COUNTS.AfterOneRemoved);
    taskRepository.clearCompletedButton().should('not.be.visible');
  });

  it('scopes a repeated test id to the row that carries it', () => {
    taskRepository
      .taskByTitle(SEEDED_TASKS[1])
      .findByTestId(TaskTestId.ItemTitle)
      .should('have.text', SEEDED_TASKS[1]);
  });
});
