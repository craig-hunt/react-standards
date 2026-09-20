import { describe, expect, it } from 'vitest';

import { RUNTIME_CONFIG_PATH, RuntimeConfigError } from './constants';
import { isRuntimeConfig, loadRuntimeConfig } from './runtimeConfig';

const API_BASE_URL = '/api';
const ENVIRONMENT_NAME = 'production';
const NOT_FOUND = 404;
const OK_STATUS = 200;
const VALID_BODY = { apiBaseUrl: API_BASE_URL, environmentName: ENVIRONMENT_NAME };

function respondWith(body: unknown, ok = true, status = OK_STATUS): typeof fetch {
  return (() =>
    Promise.resolve({
      ok,
      status,
      json: () => Promise.resolve(body),
    } as Response)) as typeof fetch;
}

describe('loadRuntimeConfig', () => {
  it('returns the configuration the host served', async () => {
    const config = await loadRuntimeConfig(respondWith(VALID_BODY));

    expect(config.apiBaseUrl).toBe(API_BASE_URL);
    expect(config.environmentName).toBe(ENVIRONMENT_NAME);
  });

  it('reads the configuration from an absolute path', async () => {
    // A relative path resolves against the current route, so /inventory would
    // ask the host for /inventory/config.json and fail on exactly one page.
    let requested = '';
    const spy = ((input: string) => {
      requested = input;
      return Promise.resolve({ ok: true, json: () => Promise.resolve(VALID_BODY) } as Response);
    }) as unknown as typeof fetch;

    await loadRuntimeConfig(spy);

    expect(requested).toBe(RUNTIME_CONFIG_PATH);
  });

  it('fails loudly when the file cannot be read', async () => {
    await expect(loadRuntimeConfig(respondWith(VALID_BODY, false, NOT_FOUND))).rejects.toThrow(
      RuntimeConfigError.Unreachable
    );
  });

  it('fails when a required value is missing', async () => {
    // Without this check the missing field travels as undefined until some
    // component reads it, and the stack trace then names the component rather
    // than the file that was wrong.
    await expect(loadRuntimeConfig(respondWith({ apiBaseUrl: API_BASE_URL }))).rejects.toThrow(
      RuntimeConfigError.Malformed
    );
  });

  it('fails when the body is not an object at all', async () => {
    await expect(loadRuntimeConfig(respondWith(API_BASE_URL))).rejects.toThrow(
      RuntimeConfigError.Malformed
    );
  });
});

describe('isRuntimeConfig', () => {
  it('accepts a complete configuration', () => {
    expect(isRuntimeConfig(VALID_BODY)).toBe(true);
  });

  it('rejects null', () => {
    expect(isRuntimeConfig(null)).toBe(false);
  });

  it('rejects a value of the wrong type', () => {
    expect(isRuntimeConfig({ apiBaseUrl: NOT_FOUND, environmentName: ENVIRONMENT_NAME })).toBe(
      false
    );
  });
});
