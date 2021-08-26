import { Cache, HttpAgent } from '@ima/core';

export default class MerkurResource {
  static get $dependencies() {
    return [HttpAgent, Cache];
  }

  /**
   *
   * @param {HttpAgent} http
   * @param {Cache} cache
   */
  constructor(http, cache) {
    /**
     * @type {HttpAgent}
     */
    this._http = http;

    /**
     * @type {Cache}
     */
    this._cache = cache;
  }

  /**
   * Make API call to defined url and returns response from server.
   *
   * @param {string} url
   * @param {Object<string, *>} data
   * @param {Object<string, *>} options
   * @return {Promise<Response>} response
   */
  async get(url, data, options = {}) {
    if (!data.containerSelector) {
      throw new Error(
        'The containerSelector property must be set in data argument.'
      );
    }

    let cloneData = Object.assign({}, data);
    const { containerSelector, slot = {} } = cloneData;

    delete cloneData.containerSelector;
    delete cloneData.slot;

    options = this._addDefaultRequestOptions(options);
    const response = await this._http[options.method](url, cloneData, options);

    this._removeHTMLFromCache(url, cloneData, options);

    if (response && response.body) {
      response.body.containerSelector = containerSelector;

      // Deprecated, left for backwards compatibility
      if (response.body.props) {
        response.body.props.containerSelector = containerSelector;
      }

      if (Object.keys(slot).length > 0 && response.body.slot) {
        Object.keys(slot).forEach(slotName => {
          if (response.body.slot[slotName]) {
            response.body.slot[slotName].containerSelector =
              slot[slotName].containerSelector;
          }
        });
      }
    }

    return response;
  }

  _addDefaultRequestOptions(options) {
    const cloneOptions = Object.assign({}, options);

    if (cloneOptions.cache === undefined) {
      cloneOptions.cache = true;
    }

    cloneOptions.method = cloneOptions.method || 'get';
    cloneOptions.ttl = options.ttl || 60000;

    return cloneOptions;
  }

  _removeHTMLFromCache(url, data, options) {
    const cacheKey = this._http.getCacheKey(options.method, url, data);

    if (this._cache.has(cacheKey)) {
      let cacheValue = this._cache.get(cacheKey);

      if ('html' in cacheValue.body) {
        delete cacheValue.body.html;

        if ('slot' in cacheValue.body) {
          Object.values(cacheValue.body.slot).forEach(slot => {
            if ('html' in slot) {
              delete slot.html;
            }
          });
        }

        this._cache.set(cacheKey, cacheValue, options.ttl);
      }
    }
  }
}
