import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

import { TEST_ID_ATTRIBUTE } from '../shared/testIds';

/**
 * The test that makes standard 1 true rather than stated.
 *
 * TEST_ID_ATTRIBUTE claims to be the single definition of the attribute name.
 * It was not: every component wrote `data-testid=` in its JSX, the constant sat
 * exported and unread, and changing it would have changed nothing that renders.
 * testId() fixed that, and this stops it from quietly coming undone.
 *
 * Scanning source from a test is unusual and deliberate. No type and no lint
 * rule can express "the string this constant holds must not also appear typed
 * out elsewhere", and blazor-standards reaches for the same mechanism, scanning
 * its authored Razor files for the same reason.
 *
 * Only .tsx is scanned, which exempts src/shared/testId.ts, the one file whose
 * job is to write the attribute.
 */

const SOURCE_ROOT = 'src';
const COMPONENT_SUFFIX = '.tsx';
const ENCODING = 'utf8';
const NONE = 0;

function componentFiles(directory: string): readonly string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory()
      ? componentFiles(path)
      : entry.name.endsWith(COMPONENT_SUFFIX)
        ? [path]
        : [];
  });
}

describe('test id convention', () => {
  it('finds components to check', () => {
    // Without this, a scan that matched nothing would pass forever and the
    // rule below would be a test of an empty list.
    expect(componentFiles(SOURCE_ROOT).length).toBeGreaterThan(NONE);
  });

  it('has no component writing the attribute name itself', () => {
    const offenders = componentFiles(SOURCE_ROOT).filter((path) =>
      readFileSync(path, ENCODING).includes(TEST_ID_ATTRIBUTE)
    );

    // Compared as a list rather than a count, so a failure names the file.
    expect(offenders).toEqual([]);
  });
});
