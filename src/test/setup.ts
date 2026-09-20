import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// React Testing Library leaves the rendered tree in the document when a test
// ends. Without this, a query in the next test can match an element the
// previous one rendered, which produces passes and failures that depend on file
// order rather than on behavior.
afterEach(() => {
  cleanup();
});
