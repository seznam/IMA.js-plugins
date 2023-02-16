import { resolveImaConfig } from '@ima/cli';
import {
  createImaApp,
  getClientBootConfig,
  onLoad,
  bootClientApp,
} from '@ima/core';
import { assignRecursively } from '@ima/helpers';
import environmentFactory from '@ima/server/lib/factory/environmentFactory.js';
import responseUtilsFactory from '@ima/server/lib/factory/responseUtilsFactory.js';
import { JSDOM } from 'jsdom';

import { unAopAll } from './aop';
import { getBootConfigExtensions } from './bootConfigExtensions';
import { getConfig } from './configuration';
import { requireFromProject } from './helpers';
import { generateDictionary } from './localization';

const createIMAServer = require('@ima/server');

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
 * @param {object} [bootConfigMethods] Object, that can contain methods for ima boot configuration
 * @returns {Promise<object>}
 */
async function initImaApp(bootConfigMethods = {}) {
  const config = getConfig();
  const bootConfigExtensions = getBootConfigExtensions();
  const imaConfig = await resolveImaConfig({ rootDir: config.rootDir });

  // JSDom needs to be initialized before we start importing project files,
  // since some packages can do some client/server detection at this point
  _initJSDom();
  _installTimerWrappers();

  await config.prebootScript();

  const defaultBootConfigMethods = requireFromProject(
    config.appMainPath
  ).getInitialAppConfigFunctions();

  /**
   * Initializes JSDOM environment for the application run
   */
  function _initJSDom() {
    const content = _getIMAResponseContent();

    // SPA jsdom interpreter
    const jsdom = new JSDOM(content, {
      pretendToBeVisual: true,
      url: `${config.protocol}//${config.host}/`,
    });

    // Setup node environment to work with jsdom window
    const { window } = jsdom;

    global.window = window;
    global.jsdom = jsdom;

    // Call all page scripts (jsdom build-in runScript creates new V8 context, unable to mix with node context)
    const scripts = jsdom.window.document.getElementsByTagName('script');
    for (const JSscript of scripts) {
      if (JSscript.id !== 'ima-runner') {
        window.eval(JSscript.text);
      }
    }

    // Extend node global with created window vars
    Object.defineProperties(global, {
      ...Object.getOwnPropertyDescriptors(window),
      ...Object.getOwnPropertyDescriptors(global),
    });

    // Copy app from config
    global.$IMA.$App = config.$App || {};

    // Mock dictionary
    global.$IMA.i18n = generateDictionary(imaConfig.languages, config.locale);

    // Mock scroll for ClientWindow.scrollTo
    global.window.scrollTo = () => {};

    // Mock fetch with node fetch
    global.window.fetch = global.fetch;
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
   *Get response content for the application run
   *
   * @returns {string} html content
   */
  function _getIMAResponseContent() {
    // Prepare IMA startup environment, requires config file in <rootDir>/server/config folder
    const environment = environmentFactory({
      applicationFolder: config.rootDir,
    });

    // // Event to generate request chain response
    const dummyEvent = {
      context: {},
      environment,
      result: {},
      req: {},
      res: {
        locals: {
          language: config.locale,
          languagePartPath: '',
          host: config.host,
          root: '',
          path: '',
          protocol: config.protocol,
          cnsVariables: { testType: 'integration' },
        },
      },
    };

    let createdIMAServer;

    let pageTemplate;

    createdIMAServer = createIMAServer({
      environment,
      manifestRequire: () => ({ default: {} }),
    });
    pageTemplate = createdIMAServer.serverApp.renderStaticSPAPage({
      ...dummyEvent,
      environment: createdIMAServer.environment,
    });

    // Get content template processor and variables generator
    const { processContent, createContentVariables } = responseUtilsFactory();

    const responceSource = {
      response: pageTemplate,
      bootConfig: createdIMAServer.serverApp.createBootConfig(dummyEvent),
    };

    // Generate dummy SPA page content
    const contentVariables = createContentVariables(responceSource);
    responceSource.response.contentVariables = contentVariables;
    return processContent(responceSource);
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
