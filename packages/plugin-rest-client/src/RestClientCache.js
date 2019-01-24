/**
 * Utility class that holds methods related to cache manipulation.
 *
 * @interface
 */
export default class RestClientCache {
	/**
	 * Returns cache entry containing response for given request.
	 *
	 * @param {Request} request
	 * @returns {Object<string, *>} The cached response object.
	 */
	getCacheEntry(request) {};

	/**
	 * Creates cache entry containing response for given request attributes.
	 *
	 * @param {Response} response
	 * @returns {Object<string, *>} The cached response object.
	 */
	createCacheEntry(response) {};

	/**
	 * Returns modified response object that is save for saving in cache.
	 * 
	 * @param {Response} response
	 * @returns {Object<string, *>}
	 */
	composeResponseCachedData(response) {};

	/**
	 * Returns true if the given request has `cache` option set to true
	 * or the `cache` option is not defined and default configuration says
	 * requests should be cached.
	 *
	 * @param {Request} request
	 * @returns {boolean}
	 */
	shouldCacheRequest(request) { };

	/**
	 * Returns TTL value for requests cache. If the TTL wasn't set in request
	 * options then it's taken over from default request options.
	 *
	 * @param {Request} request The request to obtain TTL value from.
	 * @returns {number} The TTL value
	 */
	getCacheTTL(request) {};

	/**
	 * Generates a cache key to use for identifying a request to the specified
	 * URL using the specified HTTP method, submitting the provided data.
	 *
	 * @param {string} method The HTTP method used by the request.
	 * @param {string} url The URL to which the request is sent.
	 * @param {Object<string, string>} data The data associated with the
	 *        request. These can be either the query parameters or request body
	 *        data.
	 * @return {string} The key to use for identifying such request in the
	 *         cache.
	 */
	getCacheKey(method, url, data) { };
}