import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react';
import type { RenderResult } from '@testing-library/react';
import type { ReactElement } from 'react';
import { MemoryRouter } from 'react-router';

import { RuntimeConfigProvider } from '../shared/runtimeConfigContext';
import type { RuntimeConfig } from '../shared/types';

// Every component test renders through here, so no test builds its own provider
// stack and then differs from the next one in a way that explains a failure
// nobody can reproduce.
//
// Retries are off and caching is disabled deliberately. A component test asks
// what a screen shows for a given answer; a retry turns a deliberate failure
// case into a timeout, and a shared cache leaks one test's data into the next.

const DEFAULT_ROUTE = '/';

const TEST_CONFIG: RuntimeConfig = {
  apiBaseUrl: '/api',
  environmentName: 'test',
};

interface RenderOptions {
  readonly route?: string;
}

function newClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false, staleTime: 0, gcTime: 0 },
      mutations: { retry: false },
    },
  });
}

export function renderWithProviders(ui: ReactElement, options: RenderOptions = {}): RenderResult {
  const client = newClient();

  return render(
    <RuntimeConfigProvider value={TEST_CONFIG}>
      <QueryClientProvider client={client}>
        <MemoryRouter initialEntries={[options.route ?? DEFAULT_ROUTE]}>{ui}</MemoryRouter>
      </QueryClientProvider>
    </RuntimeConfigProvider>
  );
}
