import { AbstractAnalytic, defaultDependencies } from '@ima/plugin-analytic';

const GTAG_ROOT_VARIABLE = 'gtag';

/**
 * Google analytic 4 class
 */
export default class GoogleAnalytics4 extends AbstractAnalytic {
  static get $dependencies() {
    return [...defaultDependencies, '$Settings.plugin.analytic.google4'];
  }

  get _ga4Script() {
    const clientWindow = this._window.getWindow();

    return clientWindow[GTAG_ROOT_VARIABLE];
  }

  /**
   * Initializes the Google Analytics 4 plugin.
   *
   * @param {ima.plugin.script.loader.ScriptLoaderPlugin} scriptLoader
   * @param {ima.window.Window} window
   * @param {ima.event.Dispatcher} dispatcher
   * @param {Object<string, *>} config
   */
  constructor(scriptLoader, window, dispatcher, config) {
    super(scriptLoader, window, dispatcher, config);

    this._analyticScriptName = 'google_analytics_4';

    this._analyticScriptUrl = `https://www.googletagmanager.com/gtag/js?id=${this._config.service}`;

    this._consentSettings = this._config.consentSettings;
  }
  /**
   * Hits custom event of given with given data
   * @param {string} eventName custom event name
   * @param {Object<string, *>} eventData custom event data
   */
  hit(eventName, eventData) {
    if (!this.isEnabled()) {
      return;
    }

    this._ga4Script('event', eventName, eventData);
  }

  /**
   * Hit page view event to analytic with defined data.
   *
   * @override
   * @param {Object<string, *>} pageData
   * @param {Object<string, string>} customDimensions
   */
  hitPageView(pageData) {
    if (!this.isEnabled()) {
      return;
    }

    this._ga4Script('event', 'page_view', this._getPageViewData(pageData));
  }

  /**
   * Updates user consents in Google Analytics script
   *
   * @param {Object<string, *>} purposeConsents Purpose Consents of TCModel, see: https://www.npmjs.com/package/@iabtcf/core#tcmodel
   */
  updateConsent(purposeConsents) {
    this._applyPurposeConsents(purposeConsents);

    this._ga4Script('consent', 'update', {
      ...this._consentSettings
    });
  }

  /**
   * @override
   * @inheritdoc
   */
  _applyPurposeConsents(purposeConsents) {
    if (purposeConsents && typeof purposeConsents === 'object') {
      if (purposeConsents['1']) {
        this._consentSettings.analytics_storage = 'granted';
      } else {
        this._consentSettings.analytics_storage = 'denied';
      }
    }
  }

  /**
   * @override
   * @inheritdoc
   */
  _configuration() {
    if (
      this.isEnabled() ||
      !this._ga4Script ||
      typeof this._ga4Script !== 'function'
    ) {
      return;
    }

    this._enable = true;

    this._ga4Script('consent', 'default', {
      ...this._consentSettings,
      wait_for_update: this._config.waitForUpdateTimeout
    });

    this._ga4Script('js', new Date());

    this._ga4Script('config', this._config.service, {
      send_page_view: false
    });
  }

  /**
   * Returns page view data derived from pageData param.
   *
   * @param {Object<string, *>} pageData
   * @return {Object<string, *>} pageViewData
   */
  _getPageViewData(pageData) {
    return {
      page: pageData.path,
      location: this._window.getUrl(),
      title: document.title || ''
    };
  }

  /**
   * @override
   * @inheritdoc
   */
  _createGlobalDefinition(window) {
    window.dataLayer = window.dataLayer || [];

    window[GTAG_ROOT_VARIABLE] = function () {
      window.dataLayer.push(arguments);
    };

    this._configuration();
  }
}
