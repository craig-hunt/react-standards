import js from '@eslint/js';
import prettierConfig from 'eslint-config-prettier';
import reactHooks from 'eslint-plugin-react-hooks';
import tseslint from 'typescript-eslint';

import local from './eslint-rules/no-magic-literals.js';

const FEATURES = ['tasks', 'signup', 'inventory'];

// Each feature folder may import shared code and its own files, never another
// feature. Cross-feature code belongs in src/shared, where the boundary stays
// visible rather than emerging later as a tangle nobody chose.
//
// This is the architecture standard in the form a linter can enforce. Written
// only in a README it survives until the first deadline.
const featureBoundaries = FEATURES.map((feature) => ({
  files: [`src/features/${feature}/**/*.{ts,tsx}`],
  rules: {
    'no-restricted-imports': [
      'error',
      {
        patterns: FEATURES.filter((other) => other !== feature).map((other) => ({
          group: [
            `**/features/${other}/**`,
            `**/features/${other}`,
            `../${other}/**`,
            `../${other}`,
          ],
          message: 'Features never import each other. Move shared code to src/shared.',
        })),
      },
    ],
  },
}));

export default tseslint.config(
  { ignores: ['dist', 'node_modules', 'coverage', 'reports', '.stryker-tmp'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    // The application's literals rule covers the application.
    //
    // It deliberately stops at src. A suite's discipline is a different one:
    // no raw test ids and no raw routes, which no-restricted-syntax enforces
    // below and which the sibling suites enforce the same way. Pointing this
    // rule at cypress/ instead demands names for Cypress command strings and
    // for the brackets and quotes inside an attribute selector, which makes
    // the selector harder to read and names nothing a reader was looking for.
    files: ['src/**/*.{ts,tsx}'],
    plugins: { 'react-hooks': reactHooks, local },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'local/no-magic-literals': 'error',

      // No `any` without a reason a reader can weigh. The escape hatch stays
      // open deliberately: a rule with no exit gets disabled wholesale the
      // first time someone meets a genuinely untyped boundary.
      '@typescript-eslint/no-explicit-any': 'error',

      // const over let, never var. The formatter cannot see this and a
      // reviewer should not have to.
      'prefer-const': 'error',
      'no-var': 'error',
    },
  },
  ...featureBoundaries,
  {
    // The suite's own discipline, enforced rather than reviewed. These two
    // shapes slip past review most often, and cypress-standards and
    // playwright-standards carry the same pair, so the standard reads
    // identically whichever runner a team adopts.
    files: ['cypress/**/*.ts'],
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector: "CallExpression[callee.property.name='getByTestId'] > Literal",
          message: 'Test ids live in cypress/support/constants/testIds.ts. Import the constant.',
        },
        {
          selector: "CallExpression[callee.property.name='findByTestId'] > Literal",
          message: 'Test ids live in cypress/support/constants/testIds.ts. Import the constant.',
        },
        {
          selector: "CallExpression[callee.property.name='visit'] > Literal",
          message: 'Routes live in cypress/support/constants/routes.ts. Import the constant.',
        },
      ],
    },
  },
  prettierConfig
);
