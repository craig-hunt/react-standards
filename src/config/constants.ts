// Where the runtime configuration lives, and what a failure to read it says.
//
// The path is absolute so it resolves the same from any route: a relative one
// would resolve against /inventory and ask the host for /inventory/config.json.

export const RUNTIME_CONFIG_PATH = '/config.json';

export const RuntimeConfigError = {
  Unreachable: 'The runtime configuration file could not be read.',
  Malformed: 'The runtime configuration file is missing required values.',
  Unparsable: 'The runtime configuration file is not valid JSON.',

  /**
   * A wiring fault, not a configuration fault.
   *
   * Reusing Unreachable here would tell whoever reads the console that a file
   * could not be read, when no fetch was ever attempted and the real cause is
   * a component rendered outside its provider. A loud failure that names the
   * wrong cause costs more than a quiet one.
   */
  MissingProvider: 'A component read the runtime configuration outside RuntimeConfigProvider.',
} as const;
