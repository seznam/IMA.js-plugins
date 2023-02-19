import { Dispatcher, GenericError, Window } from '@ima/core';
import easyUid from 'easy-uid';

import { AssetLoaderEvents } from './AssetLoaderEvents';

export type AssetAttributes = Record<string, string>;
export interface LoadedAsset {
  id: string;
  assetPromise: Promise<void>;
}

const isURLRe = /^(http:|https:)?\/\//;

export class AssetLoader {
  #window: Window;
  #dispatcher: Dispatcher;
  #loadedAssetsCache = new Map<string, LoadedAsset>();

  static get $dependencies() {
    return [Window, Dispatcher];
  }

  constructor(window: Window, dispatcher: Dispatcher) {
    this.#window = window;
    this.#dispatcher = dispatcher;
  }

  /**
   * Creates elements for given assets, promisifies onload
   * callbacks and injects asset elements into the page.
   *
   * This method also manages cache of asset promises to assure
   * that every unique asset is loaded only once, even when the
   * called multiple times with the same URL.
   *
   * @param params
   * @param params.urlOrContent URL or inline content of the asset to load.
   * @param params.type Asset type - script or style
   * @param params.attributes Additional optional element attributes
   * @param params.forceReload Set to true to force reload of existing asset.
   *  The existing asset is removed from DOM before injecting new one.
   * @param params.injectRoot Optional different root, where asset elements
   *  are appended. Defaults to document.head.
   */
  async #load({
    type,
    urlOrContent,
    attributes,
    forceReload,
    injectRoot,
  }: {
    urlOrContent: string;
    type: 'script' | 'style';
    attributes: AssetAttributes | undefined;
    forceReload: boolean;
    injectRoot?: HTMLElement;
  }): Promise<void> {
    if (!urlOrContent) {
      throw new GenericError(
        `URL or asset content is empty, unable to load: ${urlOrContent}.`,
        { urlOrContent }
      );
    }

    if (!this.#window.isClient()) {
      throw new GenericError(
        `The asset loader cannot be used on Server-side. Unable to load ${urlOrContent}.`,
        { urlOrContent }
      );
    }

    // Remove asset from DOM before reloading
    if (forceReload) {
      const existingAsset = this.#loadedAssetsCache.get(urlOrContent);

      if (existingAsset) {
        this.#window
          .getDocument()
          ?.querySelector(`[data-asset-loader-id="${existingAsset.id}"`)
          ?.remove();
        this.#loadedAssetsCache.delete(urlOrContent);
      }
    }

    // Return promise from cache
    if (this.#loadedAssetsCache.has(urlOrContent)) {
      return this.#loadedAssetsCache.get(urlOrContent)?.assetPromise;
    }

    const uid = easyUid();
    const inline = isURLRe.test(urlOrContent) ? false : true;
    const assetElement = this.#createElement(
      type === 'script' ? 'script' : inline ? 'style' : 'link',
      inline ? '' : urlOrContent,
      uid
    );

    if (inline) {
      assetElement.innerHTML = urlOrContent;
    }

    if (attributes && Object.keys(attributes).length) {
      for (const attribute in attributes) {
        assetElement.setAttribute(attribute, attributes[attribute]);
      }
    }

    // Promisify script url/content loading
    const assetPromise = inline
      ? Promise.resolve()
      : this.promisify(assetElement)
          .then(() => this.#handleSuccess(urlOrContent))
          .catch(error => this.#handleError(urlOrContent, error as Error));

    // Save asset promise to cache
    this.#loadedAssetsCache.set(urlOrContent, {
      id: uid,
      assetPromise,
    });

    // Inject element to page
    this.injectToPage(assetElement, injectRoot);

    return assetPromise;
  }

  /**
   * Helper for creating asset elements with pre-filled
   * id data attribute (for later identification).
   *
   * @param tagName Tag name to create.
   * @param url Asset source URL.
   * @param id Asset element unique ID.
   * @returns Asset element.
   */
  #createElement<E extends 'script' | 'link' | 'style'>(
    tagName: E,
    url: string | null,
    id: string
  ): HTMLScriptElement | HTMLLinkElement | HTMLStyleElement {
    const element = this.#window.getDocument()!.createElement(tagName);

    // Set default attributes
    element.setAttribute('data-asset-loader-id', id);

    if (tagName === 'link') {
      (element as HTMLLinkElement).rel = 'stylesheet';
    }

    // Inline elements don't have url
    if (!url) {
      return element;
    }

    // Set elements resource URL
    if (tagName === 'link') {
      (element as HTMLLinkElement).href = url;
    } else if (url && tagName === 'script') {
      (element as HTMLScriptElement).src = url;
    }

    return element;
  }

  /**
   * Handler for successfully loaded external 3rd party assets.
   *
   * @param url Asset source url.
   */
  #handleSuccess(url: string) {
    this.#dispatcher.fire(AssetLoaderEvents.LOADED, { url }, true);
  }

  /**
   * Handler for 3rd party assets which failed to load.
   *
   * @param url Asset source url.
   * @param error Rejected promise error.
   */
  #handleError(url: string, error: Error) {
    const handledError = new GenericError(`The ${url} script failed to load.`, {
      url,
      cause: error,
    });

    this.#dispatcher.fire(
      AssetLoaderEvents.LOADED,
      {
        url,
        error,
      },
      true
    );

    throw handledError;
  }

  /**
   * Helper for injecting asset elements to document.
   *
   * @param element Asset element to inject to document.
   * @param injectRoot Optional custom root, where assets
   *  are appended.
   */
  injectToPage(element: HTMLElement, injectRoot?: HTMLElement) {
    (injectRoot ? injectRoot : this.#window.getDocument()?.head)?.appendChild(
      element
    );
  }

  /**
   * Promisify the resource loading for the provided asset.
   *
   * @param element Resource element, which onload and onerror
   *  event callbacks are promisified into resolve/reject methods.
   * @param rejectOnAbort Set to true to also handle onabort event.
   */
  async promisify(element: HTMLElement, rejectOnAbort = false): Promise<void> {
    return new Promise((resolve, reject) => {
      element.onload = () => {
        resolve();
      };

      element.onerror = event => {
        reject(
          new GenericError(`Failed to load asset.`, {
            cause: event,
          })
        );
      };

      if (rejectOnAbort) {
        element.onabort = event => {
          reject(
            new GenericError(`Loading of a asset has been aborted`, {
              cause: event,
            })
          );
        };
      }
    });
  }

  /**
   * Load 3rd party style to the page. It can be either
   * external style URL or inlined content.
   *
   * @param urlOrContent URL to style resource or inlined style content.
   * @param options
   * @param options.attributes Additional optional element attributes.
   * @param options.forceReload Set to true to force reload of existing asset.
   *  The existing asset is removed from DOM before injecting new one.
   * @param options.injectRoot Optional different root, where asset elements
   *  are appended. Defaults to document.head.
   */
  async loadStyle(
    urlOrContent: string,
    options?: {
      attributes?: AssetAttributes;
      forceReload?: boolean;
      injectRoot?: HTMLElement;
    }
  ): Promise<void> {
    return this.#load({
      type: 'style',
      urlOrContent,
      attributes: options?.attributes,
      forceReload: options?.forceReload ?? false,
      injectRoot: options?.injectRoot,
    });
  }

  /**
   * Load 3rd party script to the page. It can be either
   * external style URL or inlined content.
   *
   * @param urlOrContent URL to script resource or inlined script.
   * @param options
   * @param options.attributes Additional optional element attributes.
   * @param options.forceReload Set to true to force reload of existing asset.
   *  The existing asset is removed from DOM before injecting new one.
   * @param options.injectRoot Optional different root, where asset elements
   *  are appended. Defaults to document.head.
   */
  async loadScript(
    urlOrContent: string,
    options?: {
      attributes?: AssetAttributes;
      forceReload?: boolean;
      injectRoot?: HTMLElement;
    }
  ): Promise<void> {
    return this.#load({
      type: 'script',
      urlOrContent,
      attributes: options?.attributes,
      forceReload: options?.forceReload ?? false,
      injectRoot: options?.injectRoot,
    });
  }
}
