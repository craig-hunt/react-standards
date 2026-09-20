import { TEST_ID_ATTRIBUTE } from './testIds';

/**
 * Builds the test-id attribute, so components never write its name.
 *
 * Standard 1 claims the attribute name lives in one place. Without this, that
 * claim was false in the application: every component wrote `data-testid=`
 * directly in its JSX, and `TEST_ID_ATTRIBUTE` sat exported and unread, so
 * changing it would have changed nothing that renders. A single definition
 * nothing reads is a comment wearing a constant's clothes.
 *
 * Spread into an element, the name flows from the constant to the markup:
 *
 *   <h1 {...testId(TaskTestId.Heading)}>
 *
 * This is the React equivalent of the `TestId.For()` helper blazor-standards
 * splats through `@attributes`, and it exists for the same reason: a team that
 * writes the attribute by hand loses the single definition within a sprint, and
 * nothing tells them until a suite in another repository goes red.
 *
 * A convention test asserts no component writes the literal attribute name, so
 * the helper cannot be quietly bypassed.
 */
export function testId(id: string): Readonly<Record<string, string>> {
  return { [TEST_ID_ATTRIBUTE]: id };
}
