/* @if production **
export function log() {};
export function info() {};
export function warn() {};
export function error() {};
export function debug() {};
export function logIf() { return 0; };
export function infoIf() { return 0; };
export function warnIf() { return 0; };
export function errorIf() { return 0; };
export function debugIf() { return 0; };
export function throwIf() { return 0; };
export function rejectIf() { return 0; };
export function configureLogger() {};
export function beSilent() {};
export function isSilent() {};
/* @else */
/* eslint-disable no-console */
export interface LoggerConfiguration {
  silentMode: boolean;
}

const _config: LoggerConfiguration = {
  silentMode: false,
};

/**
 * Configure the logger.
 *
 * @param config Some or all of configuration
 *  properties, which overwrites the current values.
 */
export function configureLogger(config: LoggerConfiguration): void {
  if (!config || typeof config !== 'object') {
    error(new TypeError('Argument config must be an object.'));

    return;
  }

  _config.silentMode = !!config.silentMode;
}

/**
 * Activates the silent mode. It's useful for unit testing.
 *
 * @example
 * import * as logger from '@ima/plugin-logger';
 *
 * describe('some class with the logger', () => {
 *   // Shortcut for configureLogger({ silentMode: true });
 *   logger.beSilent();
 * });
 */
export function beSilent(): void {
  configureLogger({ silentMode: true });
}

/**
 * Checks if the logging is in the silent mode.
 *
 * @returns TRUE = when it's active, otherwise FALSE.
 */
export function isSilent(): boolean {
  return _config.silentMode;
}

/**
 * Outputs a message.
 *
 * @param message A message.
 */
export function log(...message: unknown[]): void {
  if (!isSilent()) {
    console.log(...message);
  }
}

/**
 * Outputs an informational message.
 *
 * @param message An informational message.
 */
export function info(...message: unknown[]): void {
  if (!isSilent()) {
    console.info(...message);
  }
}

/**
 * Outputs a warning message.
 *
 * @param message A warning message.
 */
export function warn(...message: unknown[]): void {
  if (!isSilent()) {
    console.warn(...message);
  }
}

/**
 * Outputs an error message.
 *
 * @param message An error message.
 */
export function error(...message: unknown[]): void {
  if (!isSilent()) {
    console.error(...message);
  }
}

/**
 * Outputs a debug message.
 *
 * @param message A debug message.
 */
export function debug(...message: unknown[]): void {
  if (!isSilent()) {
    if (typeof console.debug === 'function') {
      console.debug(...message);
    } else {
      console.log(...message);
    }
  }
}

/**
 * Outputs a message if a condition is met.
 *
 * @param condition A condition.
 * @param message A message.
 * @returns TRUE when the condition is met, otherwise FALSE.
 */
export function logIf(condition: boolean, ...message: unknown[]): boolean {
  if (condition) {
    log(...message);
  }

  return !!condition;
}

/**
 * Outputs an informational message if a condition is met.
 *
 * @param condition A condition.
 * @param message An informational message.
 * @returns TRUE when the condition is met, otherwise FALSE.
 */
export function infoIf(condition: boolean, ...message: unknown[]): boolean {
  if (condition) {
    info(...message);
  }

  return !!condition;
}

/**
 * Outputs a warning message if a condition is met.
 *
 * @param condition A condition.
 * @param message A warning message.
 * @returns TRUE when the condition is met, otherwise FALSE.
 */
export function warnIf(condition: boolean, ...message: unknown[]): boolean {
  if (condition) {
    warn(...message);
  }

  return !!condition;
}

/**
 * Outputs an error message if a condition is met.
 *
 * @example
 * export function foo(num, str) {
 *   if (
 *     errorIf(typeof num !== 'number', new TypeError('Argument num must be a number.')) ||
 *     errorIf(typeof str !== 'string', new TypeError('Argument str must be a string.'))
 *   ) {
 *     // One or both of previous errors have been logged.
 *     return;
 *   }
 *   ...
 * }
 * @param condition A condition.
 * @param message An error message.
 * @returns TRUE when the condition is met, otherwise FALSE.
 */
export function errorIf(condition: boolean, ...message: unknown[]): boolean {
  if (condition) {
    error(...message);
  }

  return !!condition;
}

/**
 * Outputs a debug message if a condition is met.
 *
 * @param condition A condition.
 * @param message A debug message.
 * @returns TRUE when the condition is met, otherwise FALSE.
 */
export function debugIf(condition: boolean, ...message: unknown[]): boolean {
  if (condition) {
    debug(...message);
  }

  return !!condition;
}

/**
 * Throws a user-defined exception if a condition is met.
 *
 * @example
 * function _foo(num) {
 *   throwIf(typeof num !== 'number', new TypeError('Argument num must be a number.'));
 *   ...
 * }
 * @param condition A condition.
 * @param expression An expression to throw
 *        (please prefer an instance of Error, because it contains an original
 *        location, where it was created).
 */
export function throwIf(
  condition: boolean,
  expression: Error | string | number | boolean | object
): never | void {
  if (condition) {
    throw expression;
  }
}

/**
 * Returns a rejected promise if a condition is met.
 *
 * @example
 * function asyncFoo(num, str) {
 *   let rejected;
 *
 *   if (
 *     (rejected = rejectIf(typeof num !== 'number', new TypeError('Argument num must be a number.'))) ||
 *     (rejected = rejectIf(typeof str !== 'string', new TypeError('Argument str must be a number.')))
 *   ) {
 *     return rejected;
 *   }
 *   ...
 * }
 * @param condition A condition.
 * @param reason A reason of rejecting (please
 *        prefer an instance of Error, because it contains an original location,
 *        where it was created).
 * @returns A promise that is rejected with the given reason or null.
 */
export function rejectIf(
  condition: boolean,
  reason: Error | string | number | boolean | object
): Promise<never> | null {
  if (condition) {
    return Promise.reject(reason);
  }

  return null;
}
/* @endif */
