import AbstractRestClientCache from 'ima-plugin-rest-client/AbstractRestClientCache';
import ImaSharedCache from 'ima-plugin-shared-cache';

const REST_CLIENT_SHARED_CACHE_NAME = 'IMA.js REST API client';
const SharedCacheInstance = ImaSharedCache.getCache(
  REST_CLIENT_SHARED_CACHE_NAME
);

export default class SharedCache extends AbstractRestClientCache {
  /**
   * Initializes the SharedCache instance.
   *
   * @constructor
   * @method constructor
   * @param {ima.http.HttpAgent} httpAgent The IMA's HTTP agent.
   * @param {object} httpConfig $Http property of an application config.
   */
  constructor(httpAgent, httpConfig) {
    super(httpAgent, httpConfig);
  }

  /**
   * @inheritdoc
   * @override
   */
  getCacheEntry(request) {
    const { method, url, data } = request;
    const cacheKey = this.getCacheKey(method, url, data);

    return SharedCacheInstance.get(cacheKey);
  }

  /**
   * @inheritdoc
   * @override
   */
  createCacheEntry(response) {
    const { method, url, data } = response.request;

    const cacheKey = this.getCacheKey(method, url, data);
    const ttl = this.getCacheTTL(response.request);

    SharedCacheInstance.set(
      cacheKey,
      this.composeResponseCacheData(response),
      ttl
    );
  }

  /**
   * @inheritdoc
   * @override
   */
  shouldCacheRequest(request) {
    let { shared } = request.options;

    if (shared === undefined) {
      const { defaultRequestOptions } = this._httpConfig || {};

      if (defaultRequestOptions && 'shared' in defaultRequestOptions) {
        shared = defaultRequestOptions.shared;
      }
    }

    return shared;
  }

  /**
   * @inheritdoc
   * @override
   */
  getCacheTTL(request) {
    let { sharedTTL } = request.options;

    if (sharedTTL === undefined) {
      const { defaultRequestOptions } = this._httpConfig || {};

      if (defaultRequestOptions && 'sharedTTL' in defaultRequestOptions) {
        sharedTTL = defaultRequestOptions.sharedTTL;
      }
    }

    return sharedTTL;
  }
}
