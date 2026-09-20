import { defineConfig } from 'vitest/config';

// The configuration Stryker runs against, and only Stryker.
//
// stryker.config.json mutates the rules modules and excludes every .tsx file,
// because components are covered by render tests and the regression suite. The
// runner, though, does not know that: by default it runs the whole Vitest
// suite once per mutant, component tests included, and each of those pays a
// jsdom setup measured in tens of seconds.
//
// The first full run projected to about 75 minutes for 135 mutants. A gate that
// slow is one people learn to ignore, which is the failure it exists to
// prevent. Narrowing the runner to the tests that cover the mutated code fixes
// the cause rather than raising a timeout.
//
// Two differences from vite.config.ts, both deliberate:
//
//   environment: node, because none of these tests touch a DOM. jsdom is what
//   makes the default configuration slow, and a rules module that needed it
//   would be a rules module in the wrong place.
//
//   no setupFiles, because setup.ts registers jest-dom matchers and React
//   Testing Library cleanup, neither of which exists outside a DOM.
//
// The .test.ts / .test.tsx split is what makes this work: a test of a rule is a
// .ts file, a test of a component is a .tsx file, and the extension already
// says which is which.
const LOGIC_TESTS = ['src/**/*.test.ts'];
const TEST_ENVIRONMENT = 'node';

export default defineConfig({
  test: {
    environment: TEST_ENVIRONMENT,
    include: LOGIC_TESTS,
    globals: false,
    css: false,
  },
});
