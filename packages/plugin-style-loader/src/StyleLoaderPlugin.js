import Events from './Events';
import { ResourceLoader } from '@ima/plugin-resource-loader';

/**
 * Style loader plugin class.
 */
export default class StyleLoader {
  static get $dependencies() {
    return ['$Window', '$Dispatcher', ResourceLoader];
  }

  /**
   * Initializes the style loader.
   *
   * @param {ima.window.Window} window
   * @param {ima.event.Dispatcher} dispatcher
   * @param {ResourceLoader} resourceLoader
   */
  constructor(window, dispatcher, resourceLoader) {
    /**
     * IMA.js Window
     *
     * @type {ima.window.Window}
     */
    this._window = window;

    /**
     * IMA.js Dispatcher
     *
     * @type {ima.event.Dispatcher}
     */
    this._dispatcher = dispatcher;

    /**
     * General-purpose utility for loading resources.
     *
     * @type {ResourceLoader}
     */
    this._resourceLoader = resourceLoader;

    /**
     * Object of loaded styles.
     *
     * @type {Object<string, Promise<{url: string}>>}
     */
    this._loadedStyles = {};
  }

  /**
   * Load third party style to page.
   *
   * @param {string} url
   * @param {string=} [template]
   * @param {Object<string, Function | string | number>} [attributes]
   * @returns {Promise<{url: string}>}
   */
  load(url, template, attributes) {
    if ($Debug) {
      if (!this._window.isClient()) {
        throw new Error(
          `The style loader cannot be used at the server side. ` +
            `Attempted to load the ${url} style.`
        );
      }
    }

    if (this._loadedStyles[url]) {
      return this._loadedStyles[url];
    } else if (!template && this._window.querySelector(`link[href="${url}"]`)) {
      return Promise.resolve({ url });
    }

    let style = this._createStyleElement(!!template);
    this._loadedStyles[url] = this._resourceLoader
      .promisify(style, template || url)
      .then(() => this._handleOnLoad(url))
      .catch(() => this._handleOnError(url));

    if (template) {
      style.innerHTML = template;
    } else {
      style.rel = 'stylesheet';
      style.href = url;
    }

    if (attributes && Object.keys(attributes).length > 0) {
      for (let attribute in attributes) {
        style[attribute] = attributes[attribute];
      }
    }

    this._resourceLoader.injectToPage(style);
    if (template) {
      setTimeout(() => style.onload(), 0);
    }

    return this._loadedStyles[url];
  }

  /**
   * Creates a new style element and returns it.
   *
   * @param {boolean} isInlineStyle
   * @returns {HTMLLinkElement} The created style element.
   */
  _createStyleElement(isInlineStyle) {
    let element = isInlineStyle ? 'style' : 'link';

    return document.createElement(element);
  }

  /**
   * Handle on load event for style. Resolve load promise and fire LOADED
   * events.
   *
   * @param {string} url
   * @returns {{url: string}}
   */
  _handleOnLoad(url) {
    let data = { url };
    this._dispatcher.fire(Events.LOADED, data, true);

    return data;
  }

  /**
   * Handle on error event for style. Reject load promise and fire LOADED
   * events.
   *
   * @param {string} url
   * @throws Error
   */
  _handleOnError(url) {
    let error = new Error(`The ${url} style failed to load.`);
    let data = {
      url,
      error
    };

    this._dispatcher.fire(Events.LOADED, data, true);
    throw error;
  }
}
