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
  #scriptLoader: ScriptLoaderPlugin;
  #window: Window;
  #dispatcher: Dispatcher;
  #config: AbstractAnalyticSettings;
  #analyticScriptName: string | null = null;
  /**
   * Analytic script url.
   */
  #analyticScriptUrl: string | null = null;
  /**
   * If flag has value true then analytic is enabled to hit events.
   */
  #enable = false;
  /**
   * If flag has value true then analytic script was loaded.
   */
  #loaded = false;

  static get $dependencies(): Dependencies {
    return [ScriptLoaderPlugin, '$Window', '$Dispatcher'];
  }

  constructor(
    scriptLoader: ScriptLoaderPlugin,
    window: Window,
    dispatcher: Dispatcher,
    config: AbstractAnalyticSettings
  ) {
    this.#scriptLoader = scriptLoader;

    this.#window = window;

    this.#dispatcher = dispatcher;

    this.#config = config;
  }

  /**
   * Initialization analytic.
   *
   * @function init
   * @param {Object<string, *>} initConfig
   * @param {Object<string, *>} initConfig.purposeConsents Purpose Consents of TCModel, see: https://www.npmjs.com/package/@iabtcf/core#tcmodel
   */
  init(initConfig: Record<string, any>) {
    if (!this.isEnabled() && this.#window.isClient()) {
      const window = this.#window.getWindow() as globalThis.Window;

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
    if (this.#window.isClient()) {
      if (this.#loaded) {
        return Promise.resolve(true);
      }

      if (!this.#analyticScriptUrl) {
        this._afterLoadCallback();

        return Promise.resolve(true);
      }

      return this.#scriptLoader
        .load(this.#analyticScriptUrl)
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
   * @param {Object<string, *>} purposeConsents Purpose Consents of TCModel, see: https://www.npmjs.com/package/@iabtcf/core#tcmodel
   */
  _applyPurposeConsents(_purposeConsents: Record<string, any>) {
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
    return this.#enable;
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
    this.#loaded = true;
    this._configuration();
    this._fireLifecycleEvent(AnalyticEvents.LOADED);
  }

  /**
   * @protected
   * @param {AnalyticEvents.INITIALIZED|AnalyticEvents.LOADED} eventType
   */
  _fireLifecycleEvent(eventType: AnalyticEvents) {
    this.#dispatcher.fire(eventType, { type: this.#analyticScriptName }, true);
  }
}
