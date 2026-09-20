import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';

import { App } from './App';
import { loadRuntimeConfig } from './config/runtimeConfig';
import './index.css';
import { ElementId, RootError } from './shared/constants';
import { RuntimeConfigProvider } from './shared/runtimeConfigContext';

/**
 * Configuration first, then render.
 *
 * Awaiting the configuration before mounting is what lets every component below
 * treat it as present rather than as possibly-absent. The alternative, fetching
 * it inside a provider and rendering a spinner, spreads a loading state through
 * screens that have nothing to do with configuration.
 *
 * A failure here is fatal and says so. A bundle that cannot read its own
 * configuration cannot know which API to call, and starting anyway would send
 * requests somewhere nobody chose.
 */
const container = document.getElementById(ElementId.Root);
if (container === null) {
  throw new Error(RootError.Missing);
}

const root = createRoot(container);
const client = new QueryClient();

const config = await loadRuntimeConfig();

root.render(
  <StrictMode>
    <RuntimeConfigProvider value={config}>
      <QueryClientProvider client={client}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </QueryClientProvider>
    </RuntimeConfigProvider>
  </StrictMode>
);
