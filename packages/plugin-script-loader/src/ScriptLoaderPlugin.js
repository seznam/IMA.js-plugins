import { ResourceLoader } from '@ima/plugin-resource-loader';

import Events from './Events';

/**
 * Script loader plugin class.
 */
export default class ScriptLoaderPlugin {
  static get $dependencies() {
    return ['$Window', '$Dispatcher', ResourceLoader];
  }

  /**
   * Initializes the script loader.
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
     * Object of loaded scripts.
     *
     * @type {Object<string, Promise<{url: string}>>}
     */
    this._loadedScripts = {};
  }

  /**
   * Load third party script to page.
   *
   * @param {string} url
   * @param {string=} [template]
   * @returns {Promise<{url: string}>}
   */
  load(url, template) {
    if ($Debug) {
      if (!this._window.isClient()) {
        throw new Error(
          `The script loader cannot be used at the server side. ` +
            `Attempted to load the ${url} script.`
        );
      }
    }

    if (this._loadedScripts[url]) {
      return this._loadedScripts[url];
    }

    let script = this._createScriptElement();
    this._loadedScripts[url] = this._resourceLoader
      .promisify(script, template || url)
      .then(() => this._handleOnLoad(url))
      .catch(() => this._handleOnError(url));

    if (template) {
      script.innerHTML = template;
    } else {
      script.async = true;
      script.src = url;
    }

    this._resourceLoader.injectToPage(script);
    if (template) {
      setTimeout(() => script.onload(), 0);
    }

    return this._loadedScripts[url];
  }

  /**
   * Creates a new script element and returns it.
   *
   * @returns {HTMLScriptElement} The created script element.
   */
  _createScriptElement() {
    return document.createElement('script');
  }

  /**
   * Handle on load event for script. Resolve load promise and fire LOADED
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
   * Handle on error event for script. Reject load promise and fire LOADED
   * events.
   *
   * @param {string} url
   * @throws Error
   */
  _handleOnError(url) {
    let error = new Error(`The ${url} script failed to load.`);
    let data = {
      url,
      error,
    };

    this._dispatcher.fire(Events.LOADED, data, true);
    throw error;
  }
}
