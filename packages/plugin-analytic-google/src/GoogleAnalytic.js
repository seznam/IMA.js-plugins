import {
  Events as AnalyticEvents,
  AbstractAnalytic
} from 'ima-plugin-analytic';

const GA_ROOT_VARIABLE = 'ga';

/**
 * Google analytic class
 */
export default class GoogleAnalytic extends AbstractAnalytic {
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

    this._analyticScriptUrl = '//www.google-analytics.com/analytics.js';
  }

  /**
   * @inheritdoc
   */
  createGlobalDefinition(window) {
    window[GA_ROOT_VARIABLE] =
      window[GA_ROOT_VARIABLE] ||
      function() {
        window[GA_ROOT_VARIABLE].q = window[GA_ROOT_VARIABLE].q || [];
        window[GA_ROOT_VARIABLE].q.push(arguments);
      };

    window[GA_ROOT_VARIABLE].l = 1 * new Date();
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
    this.deferHitAfterLoad(() => {
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
    });
  }

  /**
   * Hit page view event to analytic with defined data.
   *
   * @override
   * @param {Object<string, *>} pageData
   */
  hitPageView(pageData) {
    this.deferHitAfterLoad(() => {
      const clientWindow = this._window.getWindow();

      clientWindow.ga('set', 'page', pageData.path);
      clientWindow.ga('set', 'location', this._window.getUrl());
      clientWindow.ga('set', 'title', document.title || '');
      clientWindow.ga('send', 'pageview');
    });
  }

  /**
   * Configuration Google analytic
   *
   * @override
   * @protected
   */
  _configuration() {
    const clientWindow = this._window.getWindow();

    if (
      !clientWindow.ga ||
      typeof this._window.getWindow().ga !== 'function' ||
      this.isEnabled()
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
    this._dispatcher.fire(AnalyticEvents.LOADED, { type: 'google' }, true);
  }
}
