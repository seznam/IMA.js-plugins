import type { Window, Dependencies, Dispatcher } from '@ima/core';
import { ResourceLoader } from '@ima/plugin-resource-loader';

import { Events } from './Events';

/**
 * Script loader plugin class.
 */
export class ScriptLoader {
  // IMA.js Window
  _window: Window;
  // IMA.js Dispatcher
  _dispatcher: Dispatcher;
  // General-purpose utility for loading resources.
  _resourceLoader: ResourceLoader;
  // Object of loaded scripts.
  _loadedScripts: Record<string, Promise<void | { url: string }>> = {};

  static get $dependencies(): Dependencies {
    return ['$Window', '$Dispatcher', ResourceLoader];
  }

  constructor(
    window: Window,
    dispatcher: Dispatcher,
    resourceLoader: ResourceLoader
  ) {
    this._window = window;

    this._dispatcher = dispatcher;

    this._resourceLoader = resourceLoader;
  }

  /**
   * Load third party script to page.
   *
   * @param url
   * @param template
   * @param force
   * @returns {Promise<{url: string}>}
   */
  load(url: string, template?: string, force = false) {
    if ($Debug) {
      if (!this._window.isClient()) {
        throw new Error(
          `The script loader cannot be used at the server side. ` +
            `Attempted to load the ${url} script.`
        );
      }
    }

    if (url in this._loadedScripts && !force) {
      return this._loadedScripts[url];
    }

    const script = this._createScriptElement();

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
      // @ts-expect-error onload is overrided by ResourceLoader promisify, which is kinda weird (TODO rewrite?)
      setTimeout(() => script.onload!(), 0);
    }

    return this._loadedScripts[url];
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
   * @param url
   */
  _handleOnLoad(url: string) {
    const data = { url };
    this._dispatcher.fire(Events.LOADED, data, true);

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

    this._dispatcher.fire(Events.LOADED, data, true);
    throw error;
  }
}
