import { strict as assert } from 'node:assert';
import path from 'node:path';

import * as imaFallback from '@ima/core';
import { assignRecursively } from '@ima/helpers';
import { setImaTestingLibraryClientConfig } from '@ima/testing-library/client';

import { unAopAll } from './aop';
import { getBootConfigExtensions } from './bootConfigExtensions';
import { getConfig } from './configuration';

const setIntervalNative = global.setInterval;
const setTimeoutNative = global.setTimeout;
const setImmediateNative = global.setImmediate;
const consoleAssertNative = global.console && global.console.assert;

let timers = [];

/**
 * Clears IMA Application instance from environment
 *
 * @param {import('@ima/core').ImaApp & Record<string, any>} app - IMA.js application instance returned from initImaApp method
 * @returns {void}
 */
function clearImaApp(app) {
  global.setInterval = setIntervalNative;
  global.setTimeout = setTimeoutNative;
  global.setImmediate = setImmediateNative;
  if (global.console && consoleAssertNative) {
    global.console.assert = consoleAssertNative;
  }
  timers.forEach(({ clear }) => clear());
  timers = [];
  unAopAll();
  app.oc.clear();
}

/**
 * Initializes IMA application with production-like configuration.
 * Uses @ima/testing-library for JSDOM and dictionary setup.
 *
 * @param {Partial<import('@ima/core').AppConfigFunctions>} [bootConfigMethods] - Optional boot config methods to extend default configuration
 * @returns {Promise<import('@ima/core').ImaApp & Record<string, any>>} IMA.js application instance with extensions
 * @throws {Error} When document or window is not available (JSDOM not initialized)
 * @throws {Error} When getInitialAppConfigFunctions is not found in app main file
 */
async function initImaApp(bootConfigMethods = {}) {
  const hasDocument = typeof globalThis.document !== 'undefined';
  const hasWindow = typeof globalThis.window !== 'undefined';

  if (!hasDocument || !hasWindow) {
    throw new Error(
      'Missing document, or window. Are you running the test in the jsdom environment? Use @ima/testing-library jest-preset.'
    );
  }

  const config = getConfig();
  const bootConfigExtensions = getBootConfigExtensions();

  // Setup global assert for XPath selectors
  global.console.assert = assert;

  _installTimerWrappers();

  await config.prebootScript();

  // Configure @ima/testing-library with project root
  setImaTestingLibraryClientConfig({
    rootDir: config.rootDir,
  });

  const appMainPath = path.isAbsolute(config.appMainPath)
    ? config.appMainPath
    : path.resolve(config.rootDir, config.appMainPath);
  const mainModule = await import(appMainPath);
  const getInitialAppConfigFunctions =
    mainModule.getInitialAppConfigFunctions ||
    mainModule.default?.getInitialAppConfigFunctions;

  if (!getInitialAppConfigFunctions) {
    throw new Error(
      `Cannot find getInitialAppConfigFunctions in ${config.appMainPath}. ` +
        `Make sure the file exports getInitialAppConfigFunctions function.`
    );
  }

  // Prefer the project's @ima/core export to ensure we use the same pluginLoader
  // singleton where plugins registered. This is critical when the package is
  // npm-linked, as the link would otherwise resolve to a separate @ima/core instance.
  const ima = mainModule.ima || mainModule.default?.ima || imaFallback;

  const defaultBootConfigMethods =
    typeof getInitialAppConfigFunctions === 'function'
      ? await getInitialAppConfigFunctions()
      : getInitialAppConfigFunctions;

  /**
   * Wraps the global timer methods to collect their return values,
   * which can be later cleared in clearImaApp function
   */
  function _installTimerWrappers() {
    global.setInterval = (...args) => {
      let timer = setIntervalNative(...args);

      timers.push({ timer, clear: () => global.clearInterval(timer) });

      return timer;
    };
    global.setTimeout = (...args) => {
      let timer = setTimeoutNative(...args);

      timers.push({ timer, clear: () => global.clearTimeout(timer) });

      return timer;
    };
    global.setImmediate = (...args) => {
      let timer = setImmediateNative(...args);

      timers.push({ timer, clear: () => global.clearImmediate(timer) });

      return timer;
    };
  }

  /**
   * Creates a boot config method that merges default, extension, and custom boot config methods.
   *
   * @param {string} method - The name of the boot config method (e.g., 'initSettings', 'initBindApp')
   * @returns {(...args: any[]) => any} Function that merges all boot config methods for the given method name
   */
  function _getBootConfigForMethod(method) {
    return (...args) => {
      const results = [];
      if (typeof defaultBootConfigMethods[method] === 'function') {
        results.push(defaultBootConfigMethods[method](...args) || {});
      }
      results.push(bootConfigExtensions[method](...args) || {});

      if (typeof bootConfigMethods[method] === 'function') {
        results.push(bootConfigMethods[method](...args) || {});
      }

      if (method === 'initSettings') {
        return assignRecursively({}, ...results);
      }

      return null;
    };
  }

  // Mock window.scrollTo which is not implemented in jsdom
  if (typeof window.scrollTo !== 'function' || !window.scrollTo._mocked) {
    window.scrollTo = Object.assign(() => {}, { _mocked: true });
  }

  // Override IMA environment before boot so config.environment takes precedence over the
  // value baked into the JSDOM HTML by jest-preset (which derives it from NODE_ENV at
  // jest config evaluation time, before setupFiles run).
  if (typeof window.$IMA === 'object') {
    window.$IMA.$Env = config.environment;
  }

  // Initialize dictionary for localization. The jest-preset HTML may not have
  // dictionary data embedded, so we generate a fake dictionary (infinite Proxy
  // returning "localize(key)" for any key) to prevent errors during boot.
  if (typeof window.$IMA === 'object' && !window.$IMA.i18n) {
    window.$IMA.i18n = _generateFakeDictionary();
  }

  // Create and boot IMA app with our custom boot config
  const app = await ima.createImaApp();
  const bootConfig = await ima.getClientBootConfig({
    initSettings: _getBootConfigForMethod('initSettings'),
    initBindApp: _getBootConfigForMethod('initBindApp'),
    initServicesApp: _getBootConfigForMethod('initServicesApp'),
    initRoutes: _getBootConfigForMethod('initRoutes'),
  });

  await ima.onLoad();
  await ima.bootClientApp(app, bootConfig);

  // To use ima route handler in jsdom
  app.oc.get('$Router').listen();

  return Object.assign({}, app, bootConfigExtensions.getAppExtension(app));
}

/**
 * Generates an infinite Proxy as a fake dictionary, returning
 * "localize(key)" for every key path. Compatible with MessageFormatDictionary.
 *
 * @param {string} [keyPath] - Current key path for recursion
 * @returns {any} Fake dictionary proxy
 */
function _generateFakeDictionary(keyPath = '') {
  return new Proxy(() => `localize(${keyPath})`, {
    get: (target, prop) => {
      if (typeof prop === 'string') {
        const newPath = keyPath ? `${keyPath}.${prop}` : prop;
        return _generateFakeDictionary(newPath);
      }
      return target[prop];
    },
  });
}

export { initImaApp, clearImaApp };
