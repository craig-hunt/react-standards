import { Route } from '../constants/routes';
import { taskRepository } from '../repositories/taskRepository';
import { TaskFilter } from '../types/index';

/**
 * Interactions, built from repository methods.
 *
 * Actions never contain selectors and never contain assertions. A selector
 * appearing here means the repository is missing a method; an assertion here
 * means the test case is missing one.
 */
export const taskActions = {
  visit: (): void => {
    cy.visit(Route.Tasks);
  },

  add: (title: string): void => {
    taskRepository.newTaskInput().type(title);
    taskRepository.addButton().click();
  },

  submitEmpty: (): void => {
    taskRepository.addButton().click();
  },

  toggle: (title: string): void => {
    taskRepository.checkboxFor(title).click();
  },

  remove: (title: string): void => {
    taskRepository.deleteButtonFor(title).click();
  },

  filterBy: (filter: TaskFilter): void => {
    const button = {
      [TaskFilter.All]: taskRepository.filterAllButton,
      [TaskFilter.Active]: taskRepository.filterActiveButton,
      [TaskFilter.Completed]: taskRepository.filterCompletedButton,
    }[filter];

    button().click();
  },

  clearCompleted: (): void => {
    taskRepository.clearCompletedButton().click();
  },
} as const;
