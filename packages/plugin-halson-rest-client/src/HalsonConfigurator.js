import { Configurator } from '@ima/plugin-rest-client';

/**
 * Configurator for the HAL+JSON REST API client configurator.
 */
export default class HalsonConfigurator extends Configurator {
  /**
   * Initializes the HAL+JSON REST API client configurator.
   *
   * @param {ima.http.HttpAgent} httpAgent The IMA HTTP agent for sending
   *        HTTP request.
   * @param {string} apiRoot URL to the REST API root.
   * @param {function(*): Object<string, (string|{href: string})>=} linkMapResolver
   *        A callback that extracts the resource links map from the server's
   *        response to a request to the API root.
   */
  constructor(httpAgent, apiRoot, linkMapResolver = body => body._links) {
    super();

    /**
     * The IMA HTTP agent for sending HTTP request.
     *
     * @type {ima.http.HttpAgent}
     */
    this._httpAgent = httpAgent;

    /**
     * URL to the REST API root.
     *
     * @type {string}
     */
    this._apiRoot = apiRoot;

    /**
     * A callback that extracts the resource links map from the server's
     * response to a request to the API root.
     *
     * @type {function(*): Object<string, (string|{href: string})>}
     */
    this._linkMapResolver = linkMapResolver;
  }

  /**
   * Fetches the server-provided REST API client configuration - the resource
   * links map.
   *
   * @return {Promise<{
   *             links: Object<string, (string|{href: string})>,
   *             apiRoot: string
   *         }>} A promise that will resolve to the REST API root URL and the
   *         root resource link map.
   */
  getConfiguration() {
    let { url, data, options } = this._prepareResourceLinksRequest();
    return this._httpAgent.get(url, data, options).then(response => {
      let config = response.body;
      config._apiRoot = this._apiRoot;
      return this._processResourceLinksMapResponse(response.body);
    });
  }

  /**
   * Generates the request to executed using the IMA's HTTP agent in order to
   * fetch the navigation links map, which will then be used to generate the
   * configuration object for the HALSON REST API client.
   *
   * @protected
   * @return {{url: string, data: null, options: {}}} Request to execute
   *         using the IMA's HTTP agent in order to fetch the REST API's
   *         navigation links map.
   */
  _prepareResourceLinksRequest() {
    return {
      url: this._apiRoot + '/',
      data: null,
      options: {}
    };
  }

  /**
   * Processes the response body the server's response to the request to the
   * REST API's navigation links map.
   *
   * @protected
   * @param {*} responseBody The server's response's body.
   * @return {{
   *           links: Object.<string, string|{href: string}>,
   *           apiRoot: string
   *         }} The HALSON REST API client configruration object.
   */
  _processResourceLinksMapResponse(responseBody) {
    return {
      links: this._linkMapResolver(responseBody),
      apiRoot: this._apiRoot
    };
  }
}
