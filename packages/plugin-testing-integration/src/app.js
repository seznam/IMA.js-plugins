import {
  createImaApp,
  getClientBootConfig,
  onLoad,
  bootClientApp,
  vendorLinker
} from '@ima/core';
import { vendors as imaVendors } from '@ima/core/build';
import { assignRecursively } from '@ima/helpers';
import { JSDOM } from 'jsdom';
import { requireFromProject, loadFiles } from './helpers';
import { getConfig } from './configuration';
import { getBootConfigExtensions } from './bootConfigExtensions';
import MessageFormat from 'messageformat';
import globby from 'globby';
import path from 'path';

const setIntervalNative = setInterval;
const setTimeoutNative = setTimeout;
const setImmediateNative = setImmediate;

let projectDependenciesLoaded = false;
let timers = [];

/**
 * Clears IMA Application instance from environment
 * @param {Object} app Object from initImaApp method
 */
function clearImaApp(app) {
  global.setInterval = setIntervalNative;
  global.setTimeout = setTimeoutNative;
  global.setImmediate = setImmediateNative;
  timers.forEach(({ clear }) => clear());
  vendorLinker.clear();
  app.oc.clear();
}

/**
 * Initializes IMA application with our production-like configuration
 * Reinitializes jsdom with configuration, that will work with our application
 * @param {Object} [bootConfigMethods] Object, that can contain methods for ima boot configuration
 * @returns {Promise<Object>}
 */
async function initImaApp(bootConfigMethods = {}) {
  const config = getConfig();
  const bootConfigExtensions = getBootConfigExtensions();
  let vendors = null;
  let defaultBootConfigMethods = null;

  /**
   * Initializes all common, client and server vendors
   */
  function _initVendorLinker() {
    const initializedVendors = [];

    []
      .concat(
        vendors.common,
        vendors.client,
        vendors.server,
        imaVendors.common,
        imaVendors.server,
        imaVendors.client
      )
      .forEach(vendor => {
        let key = vendor;
        let value = vendor;

        if (typeof vendor === 'object') {
          key = Object.keys(vendor)[0];
          value = vendor[key];
        }

        if (initializedVendors.includes(key)) {
          return;
        }

        initializedVendors.push(key);

        vendorLinker.set(key, require(value));
      });
  }

  /**
   * Initializes JSDOM environment for the application run
   */
  function _initJSDom() {
    function copyProps(src, target) {
      Object.defineProperties(target, {
        ...Object.getOwnPropertyDescriptors(src),
        ...Object.getOwnPropertyDescriptors(target)
      });
    }

    const jsdom = new JSDOM(
      `<!doctype html><html id="main-html"><body><div id="${config.masterElementId}"></div></body></html>`
    );
    const { window } = jsdom;

    global.window = window;
    global.document = window.document;
    global.navigator = {
      userAgent: 'node.js'
    };
    copyProps(window, global);
    global.jsdom = jsdom;
    global.$IMA = global.$IMA || {};
    global.window.$IMA = global.$IMA;
    global.window.$Debug = global.$Debug;
    global.window.scrollTo = () => {};
    global.window.fetch = require('node-fetch');

    // To skip protocol/host not same as server's error (ima/main.js)
    jsdom.reconfigure({
      url: `${config.protocol}//${config.host}/`
    });

    global.$IMA.$Protocol = config.protocol;
    global.$IMA.$Host = config.host;
    global.$IMA.$Env = config.environment;
    global.$IMA.$App = {};
  }

  function _generateDictionary(languages, locale = 'en') {
    // FIXME allow setting locale through config
    const mf = new MessageFormat(locale);
    const dictionaries = {};
    const langFileGlobs = languages[locale];
    globby.sync(langFileGlobs).forEach(file => {
      try {
        const filename = path
          .basename(file)
          .replace(locale.toUpperCase() + path.extname(file), '');

        const dictJson = requireFromProject(file);
        const dict = {};
        Object.keys(dictJson).forEach(key => {
          const message = dictJson[key];
          dict[key] = mf.compile(message);
        });

        dictionaries[filename] = dict;
      } catch (e) {
        console.error(
          `Tried to load dictionary JSON at path "${file}", but recieved following error.`
        );
        console.error(e);
      }
    });
    return dictionaries;
  }

  function _installTimerWrappers() {
    global.setInterval = (...args) => {
      let timer = setIntervalNative(...args);

      timers.push({ timer, clear: () => clearInterval(timer) });

      return timer;
    };
    global.setTimeout = (...args) => {
      let timer = setTimeoutNative(...args);

      timers.push({ timer, clear: () => clearTimeout(timer) });

      return timer;
    };
    global.setImmediate = (...args) => {
      let timer = setImmediateNative(...args);

      timers.push({ timer, clear: () => clearImmediate(timer) });

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

  _initJSDom();

  // Require project files after jsdom is initialized
  // to prevent errors with missing document/window
  const { js, ...build } = requireFromProject(config.appBuildPath);

  vendors = build.vendors;

  global.$IMA.i18n = _generateDictionary(build.languages, config.locale);

  defaultBootConfigMethods = requireFromProject(
    config.appMainPath
  ).getInitialAppConfigFunctions();

  // Load javascript files into namespace
  // just once, to avoid conflicts
  if (!projectDependenciesLoaded) {
    loadFiles(js);
    projectDependenciesLoaded = true;
  }

  _installTimerWrappers();
  _initVendorLinker();

  await config.prebootScript();

  let app = createImaApp();
  let bootConfig = getClientBootConfig({
    initSettings: _getBootConfigForMethod('initSettings'),
    initBindApp: _getBootConfigForMethod('initBindApp'),
    initServicesApp: _getBootConfigForMethod('initServicesApp'),
    initRoutes: _getBootConfigForMethod('initRoutes')
  });
  await onLoad();
  bootClientApp(app, bootConfig);

  // To use ima route handler in jsdom
  app.oc.get('$Router').listen();

  return Object.assign({}, app, bootConfigExtensions.getAppExtension(app));
}

export { initImaApp, clearImaApp };
