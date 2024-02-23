/**
 * General-purpose utility for loading resources that can be loaded through
 * HTML elements that expose the {@code onload}, {@code onerror} and
 * {@code onabort} callback properties.
 */
import type { Dependencies } from '@ima/core';

export default class ResourceLoader {
  static get $dependencies(): Dependencies {
    return [];
  }

  /**
   * Promisify the resource loading for the provided resource.
   *
   * @param resourceElement An element ready to be inserted
   *        into the current document to load the linked resource.
   * @param resourceUri URI (URL) to the resource being loaded, if
   *        any. Can be set to any descriptor of the resource instead, as
   *        this is used only in the error messages.
   * @param rejectOnAbort Flag signalling whether to handle
   *        aborting of the load process as an error.
   */
  promisify(
    resourceElement: HTMLElement,
    resourceUri: string,
    rejectOnAbort = false
  ) {
    return new Promise((resolve, reject) => {
      resourceElement.onload = resolve;
      resourceElement.onerror = handleError;
      if (rejectOnAbort) {
        resourceElement.onabort = () =>
          handleError(
            new Error(`Loading of a resource has been aborted: ${resourceUri}`)
          );
      }

      /**
       * Make sure to reject with error instance
       *
       * @param {Error} error
       */
      function handleError(error: Error | Event | string) {
        if (error instanceof Error) {
          reject(error);
        } else {
          reject(new Error(`Failed to load resource: ${resourceUri}`));
        }
      }
    });
  }

  injectToPage(resourceElement: Node) {
    if ($Debug) {
      if (typeof document === 'undefined') {
        throw new Error(
          'The ResourceLoader.injectToPage method must be used ' +
            'only at the client-side'
        );
      }
    }

    document.head.appendChild(resourceElement);
  }
}
