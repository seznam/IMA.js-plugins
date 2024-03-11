/* eslint-disable jsdoc/check-param-names */
import { Dependencies, Dispatcher, Window } from '@ima/core';
import { ScriptLoaderPlugin } from '@ima/plugin-script-loader';

import { Events as AnalyticEvents } from './Events';

// @property purposeConsents Purpose Consents of TCModel, see: https://www.npmjs.com/package/@iabtcf/core#tcmodel
export type InitConfig = Record<string, any> & {
  purposeConsents?: Record<string, any>;
};

/**
 * Abstract analytic class
 */
export abstract class AbstractAnalytic {
  _scriptLoader: ScriptLoaderPlugin;
  _window: Window;
  _dispatcher: Dispatcher;
  _analyticScriptName: string | null = null;
  // Analytic script url.
  _analyticScriptUrl: string | null = null;
  // If flag has value true then analytic is enabled to hit events.
  _enable = false;
  // If flag has value true then analytic script was loaded.
  _loaded = false;

  static get $dependencies(): Dependencies {
    return [ScriptLoaderPlugin, '$Window', '$Dispatcher'];
  }

  constructor(
    scriptLoader: ScriptLoaderPlugin,
    window: Window,
    dispatcher: Dispatcher
  ) {
    this._scriptLoader = scriptLoader;

    this._window = window;

    this._dispatcher = dispatcher;
  }

  /**
   * Initialization analytic.
   *
   * @function init
   * @param initConfig
   * @param initConfig.purposeConsents Purpose Consents of TCModel, see: https://www.npmjs.com/package/@iabtcf/core#tcmodel
   */
  init(initConfig?: InitConfig) {
    if (!this.isEnabled() && this._window.isClient()) {
      // we are on client, therefore window is defined
      const window = this._window.getWindow()!;

      if (initConfig?.purposeConsents) {
        this._applyPurposeConsents(initConfig.purposeConsents);
      }
      this._createGlobalDefinition(window);
      this._fireLifecycleEvent(AnalyticEvents.INITIALIZED);
    }
  }

  /**
   * Load analytic script, configure analytic and execute deferred hits.
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
  abstract _applyPurposeConsents(purposeConsents: Record<string, any>): void;

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
   */
  abstract hit(...args: unknown[]): void;

  /**
   * Hit page view event to analytic for defined page data.
   *
   * @abstract
   */
  abstract hitPageView(...args: unknown[]): void;

  /**
   * Configuration analytic. The analytic must be enabled after configuration.
   *
   * @abstract
   * @protected
   */
  abstract _configuration(): void;

  /**
   * Creates global definition for analytics script.
   *
   * @abstract
   * @protected
   */
  abstract _createGlobalDefinition(window: globalThis.Window): void;

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
