/* eslint-disable jsdoc/check-param-names */
import { Dependencies, Dispatcher, Window } from '@ima/core';
import { ScriptLoaderPlugin } from '@ima/plugin-script-loader';

import { Events as AnalyticEvents } from './Events';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface AbstractAnalyticSettings {}

/**
 * Abstract analytic class
 */
export default abstract class AbstractAnalytic {
  _scriptLoader: ScriptLoaderPlugin;
  _window: Window;
  _dispatcher: Dispatcher;
  _config: AbstractAnalyticSettings;
  _analyticScriptName: string | null = null;
  //Analytic script url.
  _analyticScriptUrl: string | null = null;
  //If flag has value true then analytic is enabled to hit events.
  _enable = false;
  //If flag has value true then analytic script was loaded.
  _loaded = false;

  static get $dependencies(): Dependencies {
    return [ScriptLoaderPlugin, '$Window', '$Dispatcher'];
  }

  constructor(
    scriptLoader: ScriptLoaderPlugin,
    window: Window,
    dispatcher: Dispatcher,
    config: AbstractAnalyticSettings
  ) {
    this._scriptLoader = scriptLoader;

    this._window = window;

    this._dispatcher = dispatcher;

    this._config = config;
  }

  /**
   * Initialization analytic.
   *
   * @function init
   * @param {Object<string, *>} initConfig
   * @param {Object<string, *>} initConfig.purposeConsents Purpose Consents of TCModel, see: https://www.npmjs.com/package/@iabtcf/core#tcmodel
   */
  init(initConfig: Record<string, any>) {
    if (!this.isEnabled() && this._window.isClient()) {
      const window = this._window.getWindow() as globalThis.Window;

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
        .catch((error: Error) => {
          console.error(error);
        });
    }

    return Promise.resolve(false);
  }

  /**
   * Applies Purpose Consents to respect GDPR, see https://github.com/InteractiveAdvertisingBureau/GDPR-Transparency-and-Consent-Framework
   *
   * @abstract
   * @param purposeConsents Purpose Consents of TCModel, see: https://www.npmjs.com/package/@iabtcf/core#tcmodel
   */
  _applyPurposeConsents(_purposeConsents: Record<string, any>) {
    throw new Error(
      'The applyPurposeConsents() method is abstract and must be overridden.'
    );
  }

  /**
   * Returns true if analytic is enabled.
   */
  isEnabled() {
    return this._enable;
  }

  /**
   * Hit event to analytic with defined data. If analytic is not configured then
   * defer hit to storage.
   *
   * @abstract
   * @param data
   */
  hit(_data: Record<string, any>) {
    throw new Error('The hit() method is abstract and must be overridden.');
  }

  /**
   * Hit page view event to analytic for defined page data.
   *
   * @abstract
   * @param pageData
   */
  hitPageView(_pageData: Record<string, any>) {
    throw new Error(
      'The hitPageView() method is abstract and must be overridden.'
    );
  }

  /**
   * Configuration analytic. The analytic must be enabled after configuration.
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
   */
  _createGlobalDefinition(_window: globalThis.Window) {
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
   * @param eventType
   */
  _fireLifecycleEvent(eventType: AnalyticEvents) {
    this._dispatcher.fire(eventType, { type: this._analyticScriptName }, true);
  }
}
