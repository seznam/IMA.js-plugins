import { AbstractAnalytic, defaultDependencies } from '@ima/plugin-analytic';

const FB_ROOT_VARIABLE = 'fbq';

/**
 * Facebook Pixel Helper.
 *
 * @class
 */
export default class FacebookPixelAnalytic extends AbstractAnalytic {
  static get $dependencies() {
    return [...defaultDependencies, '$Settings.plugin.analytic.fbPixel'];
  }

  /**
   * Creates a Facebook Pixel Helper instance.
   *
   * @function Object() { [native code] }
   * @param {import('@ima/plugin-script-loader').ScriptLoaderPlugin} scriptLoader
   * @param {import('@ima/core').Window} window
   * @param {import('@ima/core').Dispatcher} dispatcher
   * @param {object} config
   */
  constructor(scriptLoader, window, dispatcher, config) {
    super(scriptLoader, window, dispatcher, config);

    this._analyticScriptName = 'fb_pixel';
    this._analyticScriptUrl = '//connect.facebook.net/en_US/fbevents.js';

    /**
     * An identifier for Facebook Pixel.
     *
     * @type {string}
     */
    this._id = null;

    /**
     * A main function of Facebook Pixel.
     *
     * @type {Function}
     */
    this._fbq = null;
  }

  /**
   * Gets the identifier for Facebook Pixel.
   *
   * @returns {string} The identifier for Facebook Pixel.
   */
  getId() {
    switch (typeof this._config.id) {
      case 'number':
        return String(this._config.id);
      case 'string':
        return this._config.id;
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
   * @param {string} eventName Name of the event.
   * @param {object} [eventData=null] Data attached to the event.
   * @returns {boolean} TRUE when event has been hit; otherwise FALSE.
   */
  hit(eventName, eventData = null) {
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
      this._processError(error);

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
   * @param {object} [viewContentData = null] Page view data (containing path etc.).
   * @returns {boolean} TRUE when event has been hit; otherwise FALSE.
   */
  hitPageView(viewContentData = null) {
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
      this._processError(error);

      return false;
    }

    let hitResult = this.hit('PageView');

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
   * @param {string|object} [queryOrData=null] Search query / event data.
   * @returns {boolean} TRUE when event has been hit; otherwise FALSE.
   */
  hitSearch(queryOrData = null) {
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
      this._processError(error);

      return false;
    }

    let eventData;

    if (typeof queryOrData === 'string' && queryOrData) {
      eventData = { search_string: queryOrData };
    } else {
      eventData = queryOrData;
    }

    if (!eventData) {
      return this.hit('Search');
    } else {
      return this.hit('Search', eventData);
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
      !clientWindow[FB_ROOT_VARIABLE] ||
      typeof clientWindow[FB_ROOT_VARIABLE] !== 'function'
    ) {
      return;
    }

    this._enable = true;

    this._fbq = window[FB_ROOT_VARIABLE];
    this._fbq('init', this.getId());
  }

  /**
   * @override
   * @inheritdoc
   */
  _createGlobalDefinition(window) {
    if (window[FB_ROOT_VARIABLE]) {
      return;
    }

    const fbAnalytic = (window[FB_ROOT_VARIABLE] = function () {
      fbAnalytic.callMethod
        ? fbAnalytic.callMethod.apply(fbAnalytic, arguments)
        : fbAnalytic.queue.push(arguments);
    });

    if (!window['_' + FB_ROOT_VARIABLE]) {
      window['_' + FB_ROOT_VARIABLE] = fbAnalytic;
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
   * @param {Error|TypeError|string} error An error to be processed.
   */
  _processError(error) {
    if ($Debug && error) {
      console.error(error);
    }
  }
}
