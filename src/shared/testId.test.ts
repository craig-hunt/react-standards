import { describe, expect, it } from 'vitest';

import { testId } from './testId';
import { TEST_ID_ATTRIBUTE } from './testIds';

/**
 * The helper that carries standard 1, tested where the mutation gate can see
 * it.
 *
 * Component tests already exercise testId() through every rendered element,
 * but those are .test.tsx files and the mutation runner includes only .test.ts.
 * The gate therefore reported this module at zero, and named the mutant it
 * could not kill: returning an empty object instead of the attribute. That
 * mutant strips every test id from the application and breaks every suite in
 * every sibling repository, which is precisely the failure standard 1 exists to
 * prevent.
 *
 * A rule this important should not be covered only incidentally.
 */

const SAMPLE_ID = 'page-heading';
const OTHER_ID = 'primary-nav';
const ONE_ATTRIBUTE = 1;

describe('testId', () => {
  it('builds the attribute the suites bind to', () => {
    expect(testId(SAMPLE_ID)).toEqual({ [TEST_ID_ATTRIBUTE]: SAMPLE_ID });
  });

  it('carries the id it was given', () => {
    expect(testId(SAMPLE_ID)[TEST_ID_ATTRIBUTE]).toBe(SAMPLE_ID);
  });

  it('carries a different id when given one', () => {
    // Returning a fixed attribute would satisfy the test above.
    expect(testId(OTHER_ID)[TEST_ID_ATTRIBUTE]).toBe(OTHER_ID);
  });

  it('produces exactly one attribute', () => {
    // Spread into an element, anything extra here becomes an attribute nobody
    // asked for on every element in the application.
    expect(Object.keys(testId(SAMPLE_ID))).toHaveLength(ONE_ATTRIBUTE);
  });

  it('names the attribute from the constant rather than from a literal', () => {
    // The whole point of the helper. If the key stopped coming from
    // TEST_ID_ATTRIBUTE, this fails even though the rendered markup would look
    // unchanged today.
    expect(Object.keys(testId(SAMPLE_ID))).toEqual([TEST_ID_ATTRIBUTE]);
  });
});
