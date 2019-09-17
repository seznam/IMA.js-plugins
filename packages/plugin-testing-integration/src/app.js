import * as ima from 'ima/main';
import vendorLinker from 'ima/vendorLinker';
import { vendors as imaVendors } from 'ima/build';
import { assignRecursively } from 'ima-helpers';
import { JSDOM } from 'jsdom';
import { requireFromProject, loadFiles } from './helpers';
import { getConfig } from './configuration';

let projectDependenciesLoaded = false;

/**
 * Clears IMA Application instance from environment
 * @param {Object} app Object from initImaApp method
 */
function clearImaApp(app) {
  vendorLinker.clear();
  app.oc.clear();
}

/**
 * Initializes IMA application with our production-like configuration
 * Reinitializes jsdom with configuration, that will work with our application
 * @param {Object} [bootConfigMethods] Object, that can contain methods for ima boot configuration
 * @returns {Object}
 */
function initImaApp(bootConfigMethods = {}) {
  const config = getConfig();
  const { js, vendors } = requireFromProject(config.appBuildPath);
  const defaultBootConfigMethods = requireFromProject(
    config.appMainPath
  ).getInitialAppConfigFunctions();

  /**
   * Initializes all common, client and server vendors
   */
  function _initVendorLinker() {
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
        if (typeof vendor === 'object') {
          let key = Object.keys(vendor)[0];

          vendorLinker.set(key, require(vendor[key]));
        } else {
          vendorLinker.set(vendor, require(vendor));
        }
      });
  }

  /**
   * Initializes JSDOM environment for the application run
   */
  function _initJSDom() {
    const jsdom = new JSDOM(
      `<!doctype html><html id="main-html"><body><div id="${config.masterElementId}"></div></body></html>`
    );
    const { window } = jsdom;

    global.window = window;
    global.document = window.document;
    global.navigator = {
      userAgent: 'node.js'
    };
    global.jsdom = jsdom;
    global.$IMA = global.$IMA || {};
    global.window.$IMA = global.$IMA;
    global.window.$Debug = global.$Debug;
    global.window.scrollTo = () => {};
    global.window.fetch = require('node-fetch');
    global.window.fbq = () => {};
    global.sessionStorage = {
      setItem: () => {},
      removeItem: () => {}
    };

    // To skip protocol/host not same as server's error (ima/main.js)
    jsdom.reconfigure({
      url: `${config.protocol}//${config.host}/`
    });

    global.$IMA.$Protocol = config.protocol;
    global.$IMA.$Host = config.host;
    global.$IMA.$Env = config.environment;
    global.$IMA.$App = {};

    // To skip Image is not defined error
    global.Image = global.window.Image;
    // To skip CustomEvent is not defined error
    global.CustomEvent = global.window.CustomEvent;
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

      if (typeof bootConfigMethods[method] === 'function') {
        results.push(bootConfigMethods[method](...args) || {});
      }

      return assignRecursively({}, ...results);
    };
  }

  // Load javascript files into namespace
  // just once, to avoid conflicts
  if (!projectDependenciesLoaded) {
    loadFiles(js);
    projectDependenciesLoaded = true;
  }

  _initVendorLinker();
  _initJSDom();

  config.prebootScript();

  let app = ima.createImaApp();
  let bootConfig = ima.getClientBootConfig({
    initServicesApp: _getBootConfigForMethod('initServicesApp'),
    initBindApp: _getBootConfigForMethod('initBindApp'),
    initRoutes: _getBootConfigForMethod('initRoutes'),
    initSettings: _getBootConfigForMethod('initSettings')
  });
  ima.onLoad();
  ima.bootClientApp(app, bootConfig);

  return app;
}

export { initImaApp, clearImaApp };
