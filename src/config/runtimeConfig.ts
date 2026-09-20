import { RUNTIME_CONFIG_PATH, RuntimeConfigError } from './constants';
import { TypeName } from '../shared/constants';
import type { RuntimeConfig } from '../shared/types';

/**
 * Environment values arrive at runtime, not at build time.
 *
 * A bundle that compiles its API address in needs one build per environment,
 * and the artifact tested in staging is then not the artifact promoted to
 * production. Reading a small JSON file at startup keeps one bundle promotable
 * unchanged: the host swaps the file, and nothing is rebuilt.
 *
 * Vite's import.meta.env is the tempting alternative and is the thing this
 * standard rejects. VITE_ values are substituted at build time and baked into
 * the output, which is exactly the coupling twelve-factor asks a static asset
 * to avoid.
 *
 * The fetch happens before the first render rather than inside a component, so
 * no screen has to describe a half-configured state and no hook has to guard
 * against one.
 */
export async function loadRuntimeConfig(fetcher: typeof fetch = fetch): Promise<RuntimeConfig> {
  const response = await fetcher(RUNTIME_CONFIG_PATH);
  if (!response.ok) {
    throw new Error(RuntimeConfigError.Unreachable);
  }

  const parsed: unknown = await response.json();
  if (!isRuntimeConfig(parsed)) {
    throw new Error(RuntimeConfigError.Malformed);
  }

  return parsed;
}

/**
 * Checks the shape rather than trusting it.
 *
 * The file is data the host supplies, which makes it a boundary. A cast would
 * let a missing field travel as undefined until some component reads it, and
 * the stack trace would then name the component rather than the file.
 */
export function isRuntimeConfig(value: unknown): value is RuntimeConfig {
  if (typeof value !== TypeName.Object || value === null) {
    return false;
  }

  const candidate = value as Partial<RuntimeConfig>;
  return (
    typeof candidate.apiBaseUrl === TypeName.String &&
    typeof candidate.environmentName === TypeName.String
  );
}
