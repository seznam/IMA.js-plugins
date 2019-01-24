import ResponsePostProcessor from './ResponsePostProcessor';
import Response from 'ima-plugin-rest-client/Response';

/**
 * The response post-processor is a utility for post-processing the REST API
 * response before it is returned to the caller of the REST API client's
 * methods.
 *
 * @interface
 */
export default class SharedCachePostProcessor extends ResponsePostProcessor {
	/**
	 * @constructor
	 * @param {SharedCache} sharedCache
	 */
	constructor(sharedCache) {

		/**
		 * @private
		 * @property _sharedCache
		 * @type {SharedCache}
		 */
		this._sharedCache = sharedCache;
	}

	/**
	 * @inheritdoc
	 */
	process(response) {
		if (response.shared || !this._sharedCache.shouldCacheRequest(response.request)) {
			return response;
		}

		this._sharedCache.createCacheEntry(response);

		return response;
	}
}
