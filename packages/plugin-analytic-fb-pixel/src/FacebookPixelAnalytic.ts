import { Dependencies } from '@ima/core';
import { AbstractAnalytic } from '@ima/plugin-analytic';

const FB_ROOT_VARIABLE = 'fbq';

/*
 * Whole code of method _createGlobalDefinition is implementation of initialization code of Facebook Pixel from their documentation.
 * Not everything used there is typed on the internet (at least I didn't find it), therefore it is typed by us here.
 */
interface FbAnalytic {
  callMethod: (...params: unknown[]) => void;
  queue: any[];
  push: FbAnalytic;
  loaded: boolean;
  version: string;
}

type FbAnalyiticExtended = facebook.Pixel.Event & FbAnalytic;

export type AnalyticFBPixelSettings = {
  id: string | null;
};

/**
 * Facebook Pixel Helper.
 *
 * @class
 */
export class FacebookPixelAnalytic extends AbstractAnalytic {
  #config: AnalyticFBPixelSettings;
  // An identifier for Facebook Pixel.
  _id: string | null;
  // A main function of Facebook Pixel.
  _fbq: facebook.Pixel.Event | null;

  static get $dependencies(): Dependencies {
    return [
      '$Settings.plugin.analytic.fbPixel',
      ...AbstractAnalytic.$dependencies,
    ];
  }

  get config() {
    return this.#config;
  }

  /**
   * Creates a Facebook Pixel Helper instance.
   */
  constructor(
    config: AnalyticFBPixelSettings,
    ...rest: ConstructorParameters<typeof AbstractAnalytic>
  ) {
    super(...rest);

    this._analyticScriptName = 'fb_pixel';
    this._analyticScriptUrl = '//connect.facebook.net/en_US/fbevents.js';

    this.#config = config;

    this._id = null;

    this._fbq = null;
  }

  _applyPurposeConsents() {
    /* this implementation doesn't work with consents */
  }

  /**
   * Gets the identifier for Facebook Pixel.
   *
   * @returns The identifier for Facebook Pixel.
   */
  getId() {
    switch (typeof this.config.id) {
      case 'number':
        return String(this.config.id);
      case 'string':
        return this.config.id;
      default:
        throw new TypeError(
          'A Facebook Pixel identifier should be a number/string.'
        );
    }
  }

  /**
   * Hits an event.
   *
   * @override
   * @param eventName Name of the event.
   * @param eventData Data attached to the event.
   * @returns TRUE when event has been hit; otherwise FALSE.
   */
  hit(eventName: string, eventData: Record<string, any> | null = null) {
    try {
      if (!this._fbq) {
        throw new Error(
          'Initialize the FacebookPixelHelper instance before calling hit() method.'
        );
      } else if (typeof eventName !== 'string' || !eventName) {
        throw new TypeError(
          'Parameter eventName of hit() method is required and should be a string.'
        );
      } else if (typeof eventData !== 'object') {
        throw new TypeError(
          'Parameter eventData of hit() method should be an object.'
        );
      }
    } catch (error) {
      this._processError(
        error as Parameters<FacebookPixelAnalytic['_processError']>[0]
      );

      return false;
    }

    if (!eventData) {
      this._fbq('track', eventName);
    } else {
      this._fbq('track', eventName, eventData);
    }

    return true;
  }

  /**
   * Hits a page view event (optionally with page view data).
   *
   * @override
   * @param Page view data (containing path etc.).
   * @returns TRUE when event has been hit; otherwise FALSE.
   */
  hitPageView(viewContentData: Record<string, any> | null = null) {
    try {
      if (!this._fbq) {
        throw new Error(
          'Initialize the FacebookPixelHelper instance before calling hitPageView() method.'
        );
      } else if (typeof viewContentData !== 'object') {
        throw new TypeError(
          'Parameter data of hitPageView() method should be an object.'
        );
      }
    } catch (error) {
      this._processError(
        error as Parameters<FacebookPixelAnalytic['_processError']>[0]
      );

      return false;
    }

    const hitResult = this.hit('PageView');

    if (!hitResult) {
      return false;
    } else if (viewContentData) {
      return this.hit('ViewContent', viewContentData);
    }

    return true;
  }

  /**
   * Hits a search event (optionally with page name or other event data).
   *
   * @param Search query / event data.
   * @param queryOrData
   * @returns TRUE when event has been hit; otherwise FALSE.
   */
  hitSearch(queryOrData: Record<string, any> | string | null = null) {
    try {
      if (!this._fbq) {
        throw new Error(
          'Initialize the FacebookPixelHelper instance before calling hitSearch() method.'
        );
      } else if (['string', 'object'].indexOf(typeof queryOrData) === -1) {
        throw new TypeError(
          'Parameter queryOrData of hitSearch() method should be a string or an object.'
        );
      }
    } catch (error) {
      this._processError(
        error as Parameters<FacebookPixelAnalytic['_processError']>[0]
      );

      return false;
    }

    let eventData: Record<string, unknown> | null;

    if (typeof queryOrData === 'string' && queryOrData) {
      eventData = { search_string: queryOrData };
    } else {
      return this.hit('Search');
    }

    return this.hit('Search', eventData);
  }

  /**
   * @override
   * @inheritdoc
   */
  _configuration() {
    // _configuration is only called on client, therefore window is defined
    const clientWindow = this._window.getWindow()!;

    if (
      this.isEnabled() ||
      !clientWindow[FB_ROOT_VARIABLE] ||
      typeof clientWindow[FB_ROOT_VARIABLE] !== 'function'
    ) {
      return;
    }

    this._enable = true;

    this._fbq = clientWindow[FB_ROOT_VARIABLE];
    this._fbq!('init', this.getId());
  }

  /**
   * @override
   * @inheritdoc
   */
  _createGlobalDefinition(window: globalThis.Window) {
    if (window[FB_ROOT_VARIABLE]) {
      return;
    }

    const fbAnalytic = (window[FB_ROOT_VARIABLE] = function (
      ...rest: unknown[]
    ) {
      fbAnalytic.callMethod
        ? fbAnalytic.callMethod(...rest)
        : fbAnalytic.queue.push(...rest);
    }) as FbAnalyiticExtended;

    if (!window[`_${FB_ROOT_VARIABLE}`]) {
      window[`_${FB_ROOT_VARIABLE}`] = fbAnalytic;
    }

    fbAnalytic.push = fbAnalytic;
    fbAnalytic.loaded = false;
    fbAnalytic.version = '2.0';
    fbAnalytic.queue = [];

    this._fbq = fbAnalytic;

    this._configuration();
  }

  /**
   * Processes an error.
   *
   * @param error An error to be processed.
   */
  _processError(error: Error | TypeError | string) {
    if ($Debug && error) {
      console.error(error);
    }
  }
}
