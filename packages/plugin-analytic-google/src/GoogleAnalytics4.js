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

    this._enable = true;

    clientWindow[GTAG_ROOT_VARIABLE]('consent', 'default', {
      ad_storage: 'denied',
      analytics_storage: 'denied',
      personalization_storage: 'denied',
      wait_for_update: 5000
    });

    clientWindow[GTAG_ROOT_VARIABLE]('js', new Date());

    clientWindow[GTAG_ROOT_VARIABLE]('config', this._config.service, {
      send_page_view: false
    });
  }

  _createGlobalDefinition(window) {
    window['gtag_enable_tcf_support'] = true;

    window.dataLayer = window.dataLayer || [];
    window[GTAG_ROOT_VARIABLE] = function () {
      dataLayer.push(arguments); // eslint-disable-line no-undef
    };

    this._configuration();
  }
}
