import { AbstractAnalytic, defaultDependencies } from '@ima/plugin-analytic';

const GA_ROOT_VARIABLE = 'ga';

/**
 * Google analytic class
 */
export default class GoogleAnalytic extends AbstractAnalytic {
  static get $dependencies() {
    return [...defaultDependencies, '$Settings.plugin.analytic.google'];
  }

  /**
   * Initializes the Google Analytics plugin.
   *
   * @param {import('@ima/plugin-script-loader').ScriptLoaderPlugin} scriptLoader
   * @param {import('@ima/core').Window} window
   * @param {import('@ima/core').Dispatcher} dispatcher
   * @param {Object<string, *>} config
   */
  constructor(scriptLoader, window, dispatcher, config) {
    super(scriptLoader, window, dispatcher, config);

    this._analyticScriptName = 'google';
    this._analyticScriptUrl = '//www.google-analytics.com/analytics.js';
  }

  /**
   * Hit event to analytic with defined data. If analytic is not configured then
   * defer hit to storage.
   *
   * @override
   * @param {{
   *          method: string=,
   *          type: string=,
   *          category: string=,
   *          action: string=,
   *          label: string=,
   *          value: number,
   *          fields: Object<string, *>
   *        }} data The key of data are defined in documentation of google
   *        analytic.
   */
  hit(data) {
    if (!this.isEnabled()) {
      return;
    }

    this._window
      .getWindow()
      .ga(
        data.method || 'send',
        data.type || 'event',
        data.category || 'undefined',
        data.action || 'undefined',
        data.label,
        data.value,
        data.fields
      );
  }

  /**
   * Hit page view event to analytic with defined data.
   *
   * @override
   * @param {Object<string, *>} pageData
   * @param {Object<string, string>} customDimensions
   */
  hitPageView(pageData, customDimensions = null) {
    if (!this.isEnabled()) {
      return;
    }

    const clientWindow = this._window.getWindow();

    if (customDimensions && typeof customDimensions === 'object') {
      this._setSetter(customDimensions);
    }

    this._setSetter(this._getPageViewData(pageData));

    clientWindow.ga('send', 'pageview');
  }

  /**
   * @override
   * @inheritdoc
   */
  _applyPurposeConsents(purposeConsents) {
    if (purposeConsents && typeof purposeConsents === 'object') {
      if (purposeConsents['1']) {
        delete this._config.settings['clientId'];
        delete this._config.settings['storage'];
      }
      // TODO: respect other purposes
      // delete this._config.settingsSetter['allowAdFeatures'];
      // delete this._config.settingsSetter['anonymizeIp'];
      // delete this._config.settingsSetter['allowAdPersonalizationSignals'];
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
      !clientWindow.ga ||
      typeof clientWindow.ga !== 'function'
    ) {
      return;
    }

    this._enable = true;
    clientWindow.ga(
      'create',
      this._config.service,
      'auto',
      this._config.settings
    );

    this._setSetter(this._config.settingsSetter);
  }

  /**
   * Returns page view data derived from pageData param.
   *
   * @param {Object<string, *>} pageData
   * @returns {Object<string, *>} pageViewData
   */
  _getPageViewData(pageData) {
    return {
      page: pageData.path,
      location: this._window.getUrl(),
      title: document.title || '',
    };
  }

  _setSetter(settings) {
    const clientWindow = this._window.getWindow();

    if (settings && typeof settings === 'object') {
      Object.entries(settings).forEach(([key, value]) => {
        clientWindow.ga('set', key, value);
      });
    }
  }

  /**
   * @override
   * @inheritdoc
   */
  _createGlobalDefinition() {
    const window = this._window.getWindow();

    window[GA_ROOT_VARIABLE] =
      window[GA_ROOT_VARIABLE] ||
      function () {
        window[GA_ROOT_VARIABLE].q = window[GA_ROOT_VARIABLE].q || [];
        window[GA_ROOT_VARIABLE].q.push(arguments);
      };

    window[GA_ROOT_VARIABLE].l = 1 * new Date();

    this._configuration();
  }
}
