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
    this._analyticScriptUrl = 'https://www.googletagmanager.com/gtag/js';
  }

  hit(/*data*/) {
    if (!this.isEnabled()) {
      return;
    }

    // const clientWindow = this._window.getWindow();
    //
    // clientWindow[GTAG_ROOT_VARIABLE](
    //   data.method || 'send',
    //   data.type || 'event',
    //   data.category || 'undefined',
    //   data.action || 'undefined',
    //   data.label,
    //   data.value,
    //   data.fields
    // );
  }

  /**
   * Hit page view event to analytic with defined data.
   *
   * @override
   * @param {Object<string, *>} pageData
   * @param {Object<string, string>} customDimensions
   */
  hitPageView() {
    if (!this.isEnabled()) {
      return;
    }

    const clientWindow = this._window.getWindow();

    clientWindow[GTAG_ROOT_VARIABLE]('event', 'page_view');
  }

  _configuration() {
    const clientWindow = this._window.getWindow();

    if (
      this.isEnabled() ||
      !clientWindow[GTAG_ROOT_VARIABLE] ||
      typeof clientWindow[GTAG_ROOT_VARIABLE] !== 'function'
    ) {
      return;
    }

    clientWindow[GTAG_ROOT_VARIABLE]('js', new Date());

    clientWindow[GTAG_ROOT_VARIABLE]('config', this._config.service);
  }

  _createGlobalDefinition(window) {
    window.dataLayer = window.dataLayer || [];
    window[GTAG_ROOT_VARIABLE] = function () {
      dataLayer.push(arguments); // eslint-disable-line no-undef
    };

    this._configuration();
  }
}
