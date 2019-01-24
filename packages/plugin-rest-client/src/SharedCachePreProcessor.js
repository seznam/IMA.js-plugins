import RequestPreProcessor from './RequestPreProcessor';
import SharedCache from './SharedCache';
import Response from 'ima-plugin-rest-client/Response';

/**
 * The request pre-processor is a utility for pre-processing the REST API
 * request before it is passed to the HTTP agent.
 *
 * @interface
 */
export default class SharedCachePreProcessor extends RequestPreProcessor {
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
	process(request) {
		const cachedResponse = this._sharedCache.getCacheEntry(request);

		if (this._sharedCache.shoudCacheRequest(request) && cachedResponse) {
			return new Response(Object.assign({}, cachedResponse, { cached: true, shared: true }));
		}

		return request;
	}
}
