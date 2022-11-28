import { AbstractAnalytic, defaultDependencies } from '@ima/plugin-analytic';

const GTAG_ROOT_VARIABLE = 'gtag';

/**
 * Google analytic 4 class
 */
export default class GoogleAnalytics4 extends AbstractAnalytic {
  static get $dependencies() {
    return [...defaultDependencies, '$Settings.plugin.analytic.google4'];
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

  hit() {
    /* not implemented yet */
    return;
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

    const clientWindow = this._window.getWindow();

    clientWindow[GTAG_ROOT_VARIABLE](
      'event',
      'page_view',
      this._getPageViewData(pageData)
    );
  }

  /**
   * Updates user consents in Google Analytics script
   *
   * @param {Object<string, *>} purposeConsents Purpose Consents of TCModel, see: https://www.npmjs.com/package/@iabtcf/core#tcmodel
   */
  updateConsent(purposeConsents) {
    const clientWindow = this._window.getWindow();

    this._applyPurposeConsents(purposeConsents);

    clientWindow[GTAG_ROOT_VARIABLE]('consent', 'update', {
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
    const clientWindow = this._window.getWindow();

    if (
      this.isEnabled() ||
      !clientWindow[GTAG_ROOT_VARIABLE] ||
      typeof clientWindow[GTAG_ROOT_VARIABLE] !== 'function'
    ) {
      return;
    }

    this._enable = true;

    clientWindow[GTAG_ROOT_VARIABLE]('consent', 'default', {
      ...this._consentSettings,
      wait_for_update: 5000
    });

    clientWindow[GTAG_ROOT_VARIABLE]('js', new Date());

    clientWindow[GTAG_ROOT_VARIABLE]('config', this._config.service, {
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
      dataLayer.push(arguments); // eslint-disable-line no-undef
    };

    this._configuration();
  }
}
