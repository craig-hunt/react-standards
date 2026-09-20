import { defineConfig } from 'cypress';

// The suite drives the built bundle served by `vite preview`, not the dev
// server. A suite that only ever passes against the dev server proves less than
// it appears to: minification, the production React build, and the real
// index.html all differ there.
const DEFAULT_BASE_URL = 'http://localhost:4173';
const VIEWPORT_WIDTH = 1440;
const VIEWPORT_HEIGHT = 900;
const SPEC_PATTERN = 'cypress/support/test_cases/**/*.cy.ts';
const SUPPORT_FILE = 'cypress/support/e2e.ts';

// Cypress retries a failing test rather than a flaky selector. This suite binds
// to test ids, so a retry hides nothing structural. The DevOps standard asks
// for a flaky rate under 2%; a retry that masks a real defect would defeat the
// measurement, which is why the count stays low rather than generous.
const RUN_MODE_RETRIES = 1;
const OPEN_MODE_RETRIES = 0;

export default defineConfig({
  e2e: {
    baseUrl: process.env.CYPRESS_BASE_URL ?? DEFAULT_BASE_URL,
    specPattern: SPEC_PATTERN,
    supportFile: SUPPORT_FILE,
    viewportWidth: VIEWPORT_WIDTH,
    viewportHeight: VIEWPORT_HEIGHT,
    retries: {
      runMode: RUN_MODE_RETRIES,
      openMode: OPEN_MODE_RETRIES,
    },
    video: false,
  },
});
