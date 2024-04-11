import type { Dependencies } from '@ima/core';
import { AbstractAnalytic } from '@ima/plugin-analytic';

const GTAG_ROOT_VARIABLE = 'gtag';

type ConsentSettings = {
  ad_storage?: 'denied' | 'granted';
  analytics_storage?: 'denied' | 'granted';
  personalization_storage?: 'denied' | 'granted';
};

export type AnalyticGoogleSettings = {
  consentSettings?: ConsentSettings;
  service: string;
  waitForUpdateTimeout?: number;
};

/**
 * Google analytic 4 class
 */
export class GoogleAnalytics4 extends AbstractAnalytic {
  #config: AnalyticGoogleSettings;
  #referrer: string;
  _consentSettings?: ConsentSettings;

  static get $dependencies(): Dependencies {
    return [
      '$Settings.plugin.analytic.google4',
      ...AbstractAnalytic.$dependencies,
    ];
  }

  set _ga4Script(value) {
    const clientWindow = this._window.getWindow()!;

    clientWindow[GTAG_ROOT_VARIABLE] = value;
  }

  get _ga4Script() {
    const clientWindow = this._window.getWindow()!;

    return clientWindow[GTAG_ROOT_VARIABLE];
  }

  get config() {
    return this.#config;
  }

  /**
   * Initializes the Google Analytics 4 plugin.
   * @param config
   * @param {...any} rest
   */
  constructor(
    config: AnalyticGoogleSettings,
    ...rest: ConstructorParameters<typeof AbstractAnalytic>
  ) {
    super(...rest);

    this.#config = config;
    this.#referrer = '';

    this._analyticScriptName = 'google_analytics_4';

    this._analyticScriptUrl = `https://www.googletagmanager.com/gtag/js?id=${this.config.service}`;

    this._consentSettings = this.config.consentSettings;
  }
  /**
   * Hits custom event of given with given data
   *
   * @param eventName custom event name
   * @param eventData custom event data
   */
  hit(eventName: string, eventData: Record<string, any>) {
    if (!this.isEnabled()) {
      return;
    }

    this._ga4Script('event', eventName, eventData);
  }

  /**
   * Hit page view event to analytic with defined data.
   * @param pageData
   */
  hitPageView(pageData: Record<string, any>) {
    if (!this.isEnabled()) {
      return;
    }

    const pageViewData = this._getPageViewData(pageData);
    this._ga4Script('event', 'page_view', pageViewData);
    this.#referrer = pageViewData.page_location;
  }

  /**
   * Updates user consents in Google Analytics script
   *
   * @param purposeConsents Purpose Consents of TCModel, see: https://www.npmjs.com/package/@iabtcf/core#tcmodel
   */
  updateConsent(purposeConsents: Record<string, any>) {
    this._applyPurposeConsents(purposeConsents);

    this._ga4Script('consent', 'update', {
      ...this._consentSettings,
    });
  }

  /**
   * @override
   * @inheritdoc
   */
  _applyPurposeConsents(purposeConsents: Record<string, any>) {
    if (
      purposeConsents &&
      typeof purposeConsents === 'object' &&
      this._consentSettings
    ) {
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
      wait_for_update: this.config.waitForUpdateTimeout,
    });

    this._ga4Script('js', new Date());

    this._ga4Script('config', this.config.service, {
      send_page_view: false,
    });
  }

  /**
   * Returns page view data derived from pageData param.
   */
  _getPageViewData(pageData: Record<string, any>) {
    const page_location = this._window?.getUrl();
    const clientDocument = this._window?.getDocument();
    const page_referrer = this.#referrer || clientDocument?.referrer;

    return {
      page_path: pageData.path,
      page_location,
      page_referrer,
      page_route: pageData?.route?.getName() || '',
      page_status: pageData?.response?.status,
      page_title: clientDocument?.title || '',
    };
  }

  /**
   * @override
   * @inheritdoc
   */
  _createGlobalDefinition(window: globalThis.Window) {
    window.dataLayer = window.dataLayer || [];

    this._ga4Script = function (...rest: unknown[]) {
      window.dataLayer.push(...rest);
    };

    this._configuration();
  }
}
