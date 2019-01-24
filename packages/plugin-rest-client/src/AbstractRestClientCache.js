/**
 * Abstract implementation of the RestClientCache class. Implementations of
 * the {@linkcode RestClientCache} interface should extend this class.
 *
 * @abstract
 */
export default class AbstractRestClientCache {
	/**
	 * Initializes the AbstractRestClientCache instance.
	 *
	 * @constructor
	 * @method constructor
	 * @param {ima.http.HttpAgent} httpAgent The IMA's HTTP agent.
	 * @param {object} httpConfig $Http property of an application config.
	 */
	constructor(httpAgent, httpConfig) {
		/**
		 * The IMA's HTTP agent.
		 *
		 * @private
		 * @property _httpAgent
		 * @type {ima.http.HttpAgent}
		 */
		this._httpAgent = httpAgent;

		/**
		 * $Http property of an application config.
		 *
		 * @type {Object}
		 */
		this._httpConfig = httpConfig;
	}

	/**
	 * @inheritdoc
	 * @abstract
	 */
	getCacheEntry(request) {
		throw new Error(
			'The getCacheEntry() method is abstract and must be overridden.'
		);
	};

	/**
	 * @inheritdoc
	 * @abstract
	 */
	createCacheEntry(response) {
		throw new Error(
			'The createCacheEntry() method is abstract and must be overridden.'
		);
	};

	/**
	 * @inheritdoc
	 * @override
	 */
	composeResponseCacheData(response) {
		let { body } = response;

		if (Array.isArray(body)) {
			body = body.map(entity => Object.assign({}, entity));
		} else {
			body = Object.assign({}, body);
		}

		return {
			body,
			status: response.status,
			params: response.params,
			headers: response.headers,
			headersRaw: response.headersRaw,
		};
	}

	/**
	 * @inheritdoc
	 * @override
	 */
	shouldCacheRequest(request) {
		let { cache } = request.options;

		if (cache === undefined) {
			const { defaultRequestOptions } = this._httpConfig || {};

			if (defaultRequestOptions && 'cache' in defaultRequestOptions) {
				cache = defaultRequestOptions.cache;
			}
		}

		return cache;
	};

	/**
	 * @inheritdoc
	 * @override
	 */
	getCacheTTL(request) {
		let { ttl } = request.options;

		if (ttl === undefined) {
			const { defaultRequestOptions } = this._httpConfig || {};

			if (defaultRequestOptions && 'ttl' in defaultRequestOptions) {
				ttl = defaultRequestOptions.ttl;
			}
		}

		return ttl;
	}

	 /**
	 * @inheritdoc
	 * @override
	 */
	getCacheKey(method, url, data) {
		return this._httpAgent.getCacheKey(method.toLowerCase(), url, data);
	};
}