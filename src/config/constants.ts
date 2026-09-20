// Where the runtime configuration lives, and what a failure to read it says.
//
// The path is absolute so it resolves the same from any route: a relative one
// would resolve against /inventory and ask the host for /inventory/config.json.

export const RUNTIME_CONFIG_PATH = '/config.json';

export const RuntimeConfigError = {
  Unreachable: 'The runtime configuration file could not be read.',
  Malformed: 'The runtime configuration file is missing required values.',
} as const;
