import { Window, Dependencies, Dispatcher } from '@ima/core';
import { ResourceLoader } from '@ima/plugin-resource-loader';

import { Events } from './Events';

/**
 * Script loader plugin class.
 */
export default class ScriptLoaderPlugin {
  #window: Window;
  #dispatcher: Dispatcher;
  #resourceLoader: ResourceLoader;
  #loadedScripts: any;

  static get $dependencies(): Dependencies {
    return ['$Window', '$Dispatcher', ResourceLoader];
  }

  constructor(
    window: Window,
    dispatcher: Dispatcher,
    resourceLoader: ResourceLoader
  ) {
    /**
     * IMA.js Window
     *
     * @type {import('@ima/core').Window}
     */
    this.#window = window;

    /**
     * IMA.js Dispatcher
     *
     * @type {import('@ima/core').Dispatcher}
     */
    this.#dispatcher = dispatcher;

    /**
     * General-purpose utility for loading resources.
     *
     * @type {ResourceLoader}
     */
    this.#resourceLoader = resourceLoader;

    /**
     * Object of loaded scripts.
     *
     * @type {Object<string, Promise<{url: string}>>}
     */
    this.#loadedScripts = {};
  }

  /**
   * Load third party script to page.
   *
   * @param url
   * @param template
   * @param force
   * @returns {Promise<{url: string}>}
   */
  load(url: string, template: string, force = false) {
    if ($Debug) {
      if (!this.#window.isClient()) {
        throw new Error(
          `The script loader cannot be used at the server side. ` +
            `Attempted to load the ${url} script.`
        );
      }
    }

    if (this.#loadedScripts[url] && !force) {
      return this.#loadedScripts[url];
    }

    const script = this._createScriptElement();
    this.#loadedScripts[url] = this.#resourceLoader
      .promisify(script, template || url)
      .then(() => this._handleOnLoad(url))
      .catch(() => this._handleOnError(url));

    if (template) {
      script.innerHTML = template;
    } else {
      script.async = true;
      script.src = url;
    }

    this.#resourceLoader.injectToPage(script);
    if (template) {
      setTimeout(() => script.onload(), 0);
    }

    return this.#loadedScripts[url];
  }

  /**
   * Creates a new script element and returns it.
   *
   * @returns The created script element.
   */
  _createScriptElement() {
    return document.createElement('script');
  }

  /**
   * Handle on load event for script. Resolve load promise and fire LOADED
   * events.
   */
  _handleOnLoad(url: string) {
    const data = { url };
    this.#dispatcher.fire(Events.LOADED, data, true);

    return data;
  }

  /**
   * Handle on error event for script. Reject load promise and fire LOADED
   * events.
   *
   * @param url
   * @throws Error
   */
  _handleOnError(url: string) {
    const error = new Error(`The ${url} script failed to load.`);
    const data = {
      url,
      error,
    };

    this.#dispatcher.fire(Events.LOADED, data, true);
    throw error;
  }
}
