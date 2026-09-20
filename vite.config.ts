import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
// From vitest/config rather than vite: Vitest 4 no longer merges its options
// into Vite's config type, so the test block below only type-checks here.
import { configDefaults, defineConfig } from 'vitest/config';

const DEV_PORT = 5173;
const PREVIEW_PORT = 4173;
const OUTPUT_DIR = 'dist';
const TEST_SETUP = './src/test/setup.ts';
const TEST_ENVIRONMENT = 'jsdom';
const SANDBOX_GLOB = '**/.stryker-tmp/**';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    outDir: OUTPUT_DIR,
    emptyOutDir: true,
    sourcemap: true,
  },
  server: {
    port: DEV_PORT,
  },
  // The regression suite drives the built bundle rather than the dev server, so
  // it exercises the artifact a host would serve, minification included. A
  // suite that only ever passes against the dev server proves less than it
  // appears to.
  preview: {
    port: PREVIEW_PORT,
    strictPort: true,
  },
  test: {
    environment: TEST_ENVIRONMENT,
    setupFiles: [TEST_SETUP],
    globals: false,
    css: false,

    // Stryker copies the whole project into .stryker-tmp and runs against the
    // copy. Vitest's default excludes cover node_modules and dist but not
    // that directory, so a run started while a mutation run is in flight
    // collects every test twice: once from src and once from the sandbox. The
    // count doubles, every test runs twice, and nothing fails, which is what
    // makes it worth excluding rather than worth noticing.
    //
    // A fresh checkout has no sandbox, so this never shows up in CI.
    exclude: [...configDefaults.exclude, SANDBOX_GLOB],
  },
});
