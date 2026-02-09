import { strict as assert } from 'node:assert';
import path from 'node:path';

import * as ima from '@ima/core';
import { assignRecursively } from '@ima/helpers';
import {
  setImaTestingLibraryClientConfig,
  generateDictionary,
} from '@ima/testing-library';

import { unAopAll } from './aop';
import { getBootConfigExtensions } from './bootConfigExtensions';
import { getConfig } from './configuration';

const setIntervalNative = global.setInterval;
const setTimeoutNative = global.setTimeout;
const setImmediateNative = global.setImmediate;

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
  timers.forEach(({ clear }) => clear());
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
  if (!document || !window) {
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

  // Configure @ima/testing-library for dictionary generation
  setImaTestingLibraryClientConfig({
    rootDir: config.rootDir,
  });

  // Init language files using @ima/testing-library
  await generateDictionary();

  const mainModule = await import(path.resolve(config.appMainPath));
  const getInitialAppConfigFunctions =
    mainModule.getInitialAppConfigFunctions ||
    mainModule.default?.getInitialAppConfigFunctions;

  if (!getInitialAppConfigFunctions) {
    throw new Error(
      `Cannot find getInitialAppConfigFunctions in ${config.appMainPath}. ` +
        `Make sure the file exports getInitialAppConfigFunctions function.`
    );
  }

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

export { initImaApp, clearImaApp };
