import { createContext, use } from 'react';
import type { ReactNode } from 'react';

import { RuntimeConfigError } from '../config/constants';
import type { RuntimeConfig } from './types';

/**
 * The runtime configuration, available to any component that needs it.
 *
 * The value is set once, after the pre-render fetch resolves, so there is no
 * loading state to describe and no component that has to cope with a
 * half-configured application. A component either renders inside the provider
 * and has the configuration, or does not render at all.
 *
 * The default is null rather than a plausible-looking object. A fake default
 * would let a component outside the provider work in development and fail in
 * production, which is the failure mode this deliberately trades for a loud one.
 */
const RuntimeConfigContext = createContext<RuntimeConfig | null>(null);

interface ProviderProps {
  readonly value: RuntimeConfig;
  readonly children: ReactNode;
}

export function RuntimeConfigProvider({ value, children }: ProviderProps) {
  return <RuntimeConfigContext value={value}>{children}</RuntimeConfigContext>;
}

export function useRuntimeConfig(): RuntimeConfig {
  const config = use(RuntimeConfigContext);
  if (config === null) {
    throw new Error(RuntimeConfigError.MissingProvider);
  }

  return config;
}
