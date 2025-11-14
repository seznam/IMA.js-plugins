import type { Window, Dependencies, Dispatcher } from '@ima/core';
import { ResourceLoader } from '@ima/plugin-resource-loader';

import { Events } from './Events';

/**
 * Configuration options for loading scripts
 */
export interface ScriptLoaderOptions {
  /** Set to true to load script as ES module with type="module" */
  module?: boolean;
  /** Set to true to load script asynchronously */
  async?: boolean;
  /** Custom attributes to set on the script element */
  attributes?: Record<string, string>;
}

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
   */
  load(
    url: string,
    template?: string,
    force = false,
    options?: ScriptLoaderOptions
  ) {
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

    const script = this._createScriptElement(options);

    this._loadedScripts[url] = this._resourceLoader
      .promisify(script, template || url)
      .then(() => this._handleOnLoad(url))
      .catch(() => this._handleOnError(url));

    if (template) {
      script.innerHTML = template;
    } else {
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
   */
  _createScriptElement(options?: ScriptLoaderOptions) {
    const script = document.createElement('script');

    // Set default async behavior (maintains backward compatibility)
    script.async = options?.async ?? true;

    // Set module type if specified
    if (options?.module) {
      script.type = 'module';
    }

    // Apply custom attributes
    if (options?.attributes) {
      Object.entries(options.attributes).forEach(([key, value]) => {
        script.setAttribute(key, value);
      });
    }

    return script;
  }

  /**
   * Handle on load event for script. Resolve load promise and fire LOADED
   * events.
   * @param url
   */
  _handleOnLoad(url: string) {
    const data = { url };
    this._dispatcher.fire(Events.LOADED, data);

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

    this._dispatcher.fire(Events.LOADED, data);
    throw error;
  }
}
