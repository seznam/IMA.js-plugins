
/**
 * General-purpose utility for loading resources that can be loaded through
 * HTML elements that expose the {@code onload}, {@code onerror} and
 * {@code onabort} callback properties.
 */
export default class ResourceLoader {
	/**
	 * Initializes the resource laoder for the provided resource.
	 *
	 * @param {HTMLElement} resourceElement An element ready to be inserted
	 *        into the current document to load the linked resource.
	 * @param {string} resourceUri URI (URL) to the resource being loaded, if
	 *        any. Can be set to any descriptor of the resource instead, as
	 *        this is used only in the error messages.
	 * @param {boolean=} rejectOnAbort Flag signalling whether to handle
	 *        aborting of the load process as an error.
	 */
	constructor(resourceElement, resourceUri, rejectOnAbort = false) {
		if ($Debug) {
			if (typeof document === 'undefined') {
				throw new Error(
					'The ResourceLoader must be used only at the client-side'
				);
			}
		}

		this.loadPromise = new Promise((resolve, reject) => {
			resourceElement.onload = resolve;
			resourceElement.onerror = handleError;
			if (rejectOnAbort) {
				resourceElement.onabort = () => handleError(new Error(
					`Loading of a resource has been aborted: ${resourceUri}`
				));
			}

			function handleError(error) {
				if (error instanceof Error) {
					reject(error);
				} else {
					reject(new Error(
						`Failed to load resource: ${resourceUri}`
					));
				}
			}
		});

		this._resourceElement = resourceElement;

		if ($Debug) {
			Object.freeze(this);
		}
	}

	injectToPage() {
		document.head.appendChild(this._resourceElement);
	}
}
