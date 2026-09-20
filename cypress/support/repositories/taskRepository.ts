import { TaskTestId } from '../constants/testIds';

/**
 * Element retrieval only. One method per element, no logic, no assertions.
 *
 * A repository that asserts cannot be reused by a test expecting the opposite
 * outcome, and a failure then reports from a file that names no behavior.
 */
export const taskRepository = {
  heading: () => cy.getByTestId(TaskTestId.Heading),
  newTaskInput: () => cy.getByTestId(TaskTestId.Input),
  addButton: () => cy.getByTestId(TaskTestId.AddButton),
  taskCount: () => cy.getByTestId(TaskTestId.Count),
  taskItems: () => cy.getByTestId(TaskTestId.Item),
  taskTitles: () => cy.getByTestId(TaskTestId.ItemTitle),
  emptyState: () => cy.getByTestId(TaskTestId.EmptyState),
  clearCompletedButton: () => cy.getByTestId(TaskTestId.ClearCompletedButton),
  filters: () => cy.getByTestId(TaskTestId.Filters),
  filterAllButton: () => cy.getByTestId(TaskTestId.FilterAll),
  filterActiveButton: () => cy.getByTestId(TaskTestId.FilterActive),
  filterCompletedButton: () => cy.getByTestId(TaskTestId.FilterCompleted),

  /** One task, found by the text a reader sees. Survives reordering; nth-child does not. */
  taskByTitle: (title: string) => cy.getByTestId(TaskTestId.Item).contains(title).parent(),
  checkboxFor: (title: string) =>
    cy.getByTestId(TaskTestId.Item).contains(title).parent().findByTestId(TaskTestId.ItemCheckbox),
  deleteButtonFor: (title: string) =>
    cy.getByTestId(TaskTestId.Item).contains(title).parent().findByTestId(TaskTestId.DeleteButton),
} as const;
