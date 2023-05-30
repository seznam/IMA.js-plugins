import { strict as assert } from 'node:assert';

import { resolveImaConfig } from '@ima/cli';
import {
  createImaApp,
  getClientBootConfig,
  onLoad,
  bootClientApp,
} from '@ima/core';
import { assignRecursively } from '@ima/helpers';
import { createIMAServer } from '@ima/server';
import { JSDOM } from 'jsdom';

import { unAopAll } from './aop';
import { getBootConfigExtensions } from './bootConfigExtensions';
import { getConfig } from './configuration';
import { requireFromProject } from './helpers';
import { generateDictionary } from './localization';

const setIntervalNative = global.setInterval;
const setTimeoutNative = global.setTimeout;
const setImmediateNative = global.setImmediate;

let timers = [];

/**
 * Clears IMA Application instance from environment
 *
 * @param {object} app Object from initImaApp method
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
 * Initializes IMA application with our production-like configuration
 * Reinitializes jsdom with configuration, that will work with our application
 *
 * @param {import('@ima/core').AppConfigFunctions} [bootConfigMethods] Object, that can contain methods for ima boot configuration
 * @returns {Promise<object>}
 */
async function initImaApp(bootConfigMethods = {}) {
  const config = getConfig();

  const bootConfigExtensions = getBootConfigExtensions();
  const imaConfig = await resolveImaConfig({ rootDir: config.rootDir });

  // JSDom needs to be initialized before we start importing project files,
  // since some packages can do some client/server detection at this point
  await _initJSDom();
  _installTimerWrappers();

  await config.prebootScript();

  const defaultBootConfigMethods = requireFromProject(
    config.appMainPath
  ).getInitialAppConfigFunctions();

  /**
   * Initializes JSDOM environment for the application run
   */
  async function _initJSDom() {
    const content = await _getIMAResponseContent();

    // SPA jsdom interpreter
    const jsdom = new JSDOM(content, {
      pretendToBeVisual: true,
      url: `${config.protocol}//${config.host}/`,
    });

    // Setup node environment to work with jsdom window
    const { window } = jsdom;

    global.window = window;
    global.jsdom = jsdom;
    global.document = window.document;

    // Extend node global with created window vars
    Object.defineProperties(global, {
      ...Object.getOwnPropertyDescriptors(window),
      ...Object.getOwnPropertyDescriptors(global),
    });

    // set debug before IMA env debug
    global.$Debug = true;

    // Mock dictionary
    global.$IMA.i18n = generateDictionary(imaConfig.languages, config.locale);

    // Mock scroll for ClientWindow.scrollTo for ima/core page routing scroll
    global.window.scrollTo = () => {};

    // Replace window fetch by node fetch
    global.window.fetch = global.fetch;

    // Required for JSDOM XPath selectors
    global.console.assert = assert; // eslint-disable-line no-console

    // Call all page scripts (jsdom build-in runScript creates new V8 context, unable to mix with node context)
    const pageScripts = jsdom.window.document.getElementsByTagName('script');
    if (typeof config.pageScriptEvalFn === 'function') {
      for (const script of pageScripts) {
        config.pageScriptEvalFn(script);
      }
    }
  }

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
   * @param {string} method
   * @returns {Function} Function merging bootConfigMethods from param
   * and web default boot config methods
   */
  function _getBootConfigForMethod(method) {
    return (...args) => {
      const results = [];
      results.push(defaultBootConfigMethods[method](...args) || {});
      results.push(bootConfigExtensions[method](...args) || {});

      if (typeof bootConfigMethods[method] === 'function') {
        results.push(bootConfigMethods[method](...args) || {});
      }

      return assignRecursively({}, ...results);
    };
  }

  /**
   * Get response content for the application run
   *
   * @returns {string} html content
   */
  async function _getIMAResponseContent() {
    // Mock devUtils to override manifest loading
    const devUtils = {
      manifestRequire: () => ({}),
    };

    // Prepare serverApp with environment override
    const { serverApp } = await createIMAServer({
      devUtils,
      applicationFolder: config.applicationFolder,
      processEnvironment: currentEnvironment =>
        config.processEnvironment({
          ...currentEnvironment,
          $Server: {
            ...currentEnvironment.$Server,
            concurrency: 0,
            serveSPA: {
              allow: true,
            },
          },
          $Debug: true,
        }),
    });

    // Generate request response
    const response = await serverApp.requestHandler(
      {
        get: () => '',
        headers: () => '',
        originalUrl: config.host,
        protocol: config.protocol.replace(':', ''),
      },
      {
        status: () => 200,
        send: () => {},
        set: () => {},
        locals: {
          language: config.locale,
          host: config.host,
          protocol: config.protocol,
          path: config.path || '',
          root: config.root || '',
          languagePartPath: config.languagePartPath || '',
        },
      }
    );

    return response.content;
  }

  const app = createImaApp();
  const bootConfig = getClientBootConfig({
    initSettings: _getBootConfigForMethod('initSettings'),
    initBindApp: _getBootConfigForMethod('initBindApp'),
    initServicesApp: _getBootConfigForMethod('initServicesApp'),
    initRoutes: _getBootConfigForMethod('initRoutes'),
  });
  await onLoad();
  bootClientApp(app, bootConfig);

  // To use ima route handler in jsdom
  app.oc.get('$Router').listen();

  return Object.assign({}, app, bootConfigExtensions.getAppExtension(app));
}

export { initImaApp, clearImaApp };
