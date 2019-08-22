import { AbstractAnalytic, defaultDependencies } from 'ima-plugin-analytic';

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
   * @param {ima.plugin.script.loader.ScriptLoaderPlugin} scriptLoader
   * @param {ima.window.Window} window
   * @param {ima.event.Dispatcher} dispatcher
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

    if (customDimensions) {
      if (typeof customDimensions === 'object') {
        Object.entries(customDimensions).forEach(([key, value]) => {
          clientWindow.ga('set', key, value);
        });
      }
    }

    clientWindow.ga('set', 'page', pageData.path);
    clientWindow.ga('set', 'location', this._window.getUrl());
    clientWindow.ga('set', 'title', document.title || '');
    clientWindow.ga('send', 'pageview');
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
      typeof this._window.getWindow().ga !== 'function'
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
  }

  /**
   * @override
   * @inheritdoc
   */
  _createGlobalDefinition() {
    let window = this._window.getWindow();
    window[GA_ROOT_VARIABLE] =
      window[GA_ROOT_VARIABLE] ||
      function() {
        window[GA_ROOT_VARIABLE].q = window[GA_ROOT_VARIABLE].q || [];
        window[GA_ROOT_VARIABLE].q.push(arguments);
      };

    window[GA_ROOT_VARIABLE].l = 1 * new Date();

    this._configuration();
  }
}
