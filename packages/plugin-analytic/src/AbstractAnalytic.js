/* eslint-disable jsdoc/check-param-names */

import AnalyticEvents from './Events';
import { ScriptLoaderPlugin } from '@ima/plugin-script-loader';

/**
 * Abstract analytic class
 */
export default class AbstractAnalytic {
  static get $dependencies() {
    return [ScriptLoaderPlugin, '$Window', '$Dispatcher'];
  }

  /**
   * @param {ima.plugin.script.loader.ScriptLoaderPlugin} scriptLoader
   * @param {ima.window.Window} window
   * @param {ima.event.Dispatcher} dispatcher
   * @param {Object<string, *>} config
   */
  constructor(scriptLoader, window, dispatcher, config) {
    /**
     * Handler from @ima/plugin-script-loader.
     *
     * @protected
     * @type {ima.plugin.script.loader.ScriptLoaderPlugin}
     */
    this._scriptLoader = scriptLoader;

    /**
     * IMA.js Window
     *
     * @protected
     * @type {ima.window.Window}
     */
    this._window = window;

    /**
     * IMA.js Dispatcher
     *
     * @protected
     * @type {ima.event.Dispatcher}
     */
    this._dispatcher = dispatcher;

    /**
     * Analytic config
     *
     * @protected
     * @type {(Object<string, *>)}
     */
    this._config = config;

    /**
     * @protected
     * @type {string}
     */
    this._analyticScriptName = null;

    /**
     * Analytic script url.
     *
     * @protected
     * @type {?string}
     */
    this._analyticScriptUrl = null;

    /**
     * If flag has value true then analytic is enable for hit events.
     *
     * @protected
     * @type {boolean}
     */
    this._enable = false;

    /**
     * If flag has value true then analytic script was loaded.
     *
     * @protected
     * @type {boolean}
     */
    this._loaded = false;
  }

  /**
   * Initialization analytic.
   *
   * @function init
   * @param {Object<string, *>} initConfig
   * @param {Object<string, *>} initConfig.purposeConsents Purpose Consents of TCModel, see: https://www.npmjs.com/package/@iabtcf/core#tcmodel
   */
  init(initConfig) {
    if (!this.isEnabled() && this._window.isClient()) {
      const window = this._window.getWindow();

      if (initConfig && initConfig.purposeConsents) {
        this._applyPurposeConsents(initConfig.purposeConsents);
      }
      this._createGlobalDefinition(window);
      this._fireLifecycleEvent(AnalyticEvents.INITIALIZED);
    }
  }

  /**
   * Load analytic script, configure analytic and execute deferred hits.
   *
   * @returns {Promise}
   */
  load() {
    if (this._window.isClient()) {
      if (this._loaded) {
        return Promise.resolve(true);
      }

      if (!this._analyticScriptUrl) {
        this._afterLoadCallback();

        return Promise.resolve(true);
      }

      return this._scriptLoader
        .load(this._analyticScriptUrl)
        .then(() => {
          this._afterLoadCallback();

          return true;
        })
        .catch(error => {
          console.error(error);
        });
    }

    return Promise.resolve(false);
  }

  /**
   * Applies Purpose Consents to respect GDPR, see https://github.com/InteractiveAdvertisingBureau/GDPR-Transparency-and-Consent-Framework
   *
   * @abstract
   * @param {Object<string, *>} purposeConsents Purpose Consents of TCModel, see: https://www.npmjs.com/package/@iabtcf/core#tcmodel
   */
  _applyPurposeConsents() {
    throw new Error(
      'The applyPurposeConsents() method is abstract and must be overridden.'
    );
  }

  /**
   * Returns true if analytic is enabled.
   *
   * @returns {boolean}
   */
  isEnabled() {
    return this._enable;
  }

  /**
   * Hit event to analytic with defined data. If analytic is not configured then
   * defer hit to storage.
   *
   * @abstract
   * @param {Object<string, *>} data
   */
  hit() {
    throw new Error('The hit() method is abstract and must be overridden.');
  }

  /**
   * Hit page view event to analytic for defined page data.
   *
   * @abstract
   * @param {Object<string, *>} pageData
   */
  hitPageView() {
    throw new Error(
      'The hitPageView() method is abstract and must be overridden.'
    );
  }

  /**
   * Configuration analytic. The anayltic must be enabled after configuration.
   *
   * @abstract
   * @protected
   */
  _configuration() {
    throw new Error(
      'The _configuration() method is abstract and must be overridden.'
    );
  }

  /**
   * Creates global definition for analytics script.
   *
   * @abstract
   * @protected
   * @param {Window} window
   */
  _createGlobalDefinition() {
    throw new Error(
      'The _createGlobalDefinition() method is abstract and must be overridden.'
    );
  }

  /**
   * @protected
   */
  _afterLoadCallback() {
    this._loaded = true;
    this._configuration();
    this._fireLifecycleEvent(AnalyticEvents.LOADED);
  }

  /**
   * @protected
   * @param {AnalyticEvents.INITIALIZED|AnalyticEvents.LOADED} eventType
   */
  _fireLifecycleEvent(eventType) {
    this._dispatcher.fire(eventType, { type: this._analyticScriptName }, true);
  }
}
