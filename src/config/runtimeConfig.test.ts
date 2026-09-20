import { describe, expect, it } from 'vitest';

import { RUNTIME_CONFIG_PATH, RuntimeConfigError } from './constants';
import { isRuntimeConfig, loadRuntimeConfig } from './runtimeConfig';

const API_BASE_URL = '/api';
const ENVIRONMENT_NAME = 'production';
const NOT_FOUND = 404;
const OK_STATUS = 200;
const BAD_JSON = 'Unexpected token < in JSON at position 0';
const VALID_BODY = { apiBaseUrl: API_BASE_URL, environmentName: ENVIRONMENT_NAME };

function respondWith(body: unknown, ok = true, status = OK_STATUS): typeof fetch {
  return (() =>
    Promise.resolve({
      ok,
      status,
      json: () => Promise.resolve(body),
    } as Response)) as typeof fetch;
}

/**
 * A response that arrives, reports success, and then fails to parse.
 *
 * The shape a host serves when something upstream returns an error page with a
 * 200: the body is HTML, response.json() rejects, and nothing before that point
 * looks wrong.
 */
function respondUnparsable(): typeof fetch {
  return (() =>
    Promise.resolve({
      ok: true,
      status: OK_STATUS,
      json: () => Promise.reject(new SyntaxError(BAD_JSON)),
    } as unknown as Response)) as typeof fetch;
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

  it('reports unparsable JSON as a configuration fault', async () => {
    // response.json() rejects with a native SyntaxError naming a token and a
    // column, which reads as a bug in the application rather than as a bad
    // file on the host. The boundary normalizes it, and without this test that
    // normalization was never executed: every other case here resolves json().
    await expect(loadRuntimeConfig(respondUnparsable())).rejects.toThrow(
      RuntimeConfigError.Unparsable
    );
  });

  it('keeps the parser message from escaping the boundary', async () => {
    // The startup failure should name the file, not the token the parser
    // stopped on. Swallowing the catch entirely would also pass the test
    // above only if it threw something; this pins which message arrives.
    await expect(loadRuntimeConfig(respondUnparsable())).rejects.not.toThrow(BAD_JSON);
  });

  it('fails when a required value is missing', async () => {
    // Without this check the missing field travels as undefined until some
    // component reads it, and the stack trace would then name the component
    // rather than the file that was wrong.
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

  it('rejects a callable carrying the right properties', () => {
    // The typeof check is the only thing refusing this one. A string is
    // rejected by the property checks below it either way, so testing with a
    // string left the typeof clause unexercised and a mutant removing it
    // survived.
    //
    // JSON.parse cannot produce a function, so this cannot arrive through
    // loadRuntimeConfig. It can arrive here: isRuntimeConfig is exported, and
    // an exported guard answers for whatever it is handed.
    const callable = (() => undefined) as unknown as Record<string, unknown>;
    callable.apiBaseUrl = API_BASE_URL;
    callable.environmentName = ENVIRONMENT_NAME;

    expect(isRuntimeConfig(callable)).toBe(false);
  });
});
