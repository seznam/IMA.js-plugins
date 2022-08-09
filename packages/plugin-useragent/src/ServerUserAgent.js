// @server-side

import AbstractUserAgent from './AbstractUserAgent.js';

/**
 * Server-side UserAgent class
 */
export default class ServerUserAgent extends AbstractUserAgent {
  /**
   * Initializes the user agent analyzer used at the server-side.
   *
   * @param {PlatformJS} platformJS
   * @param {ima.router.Request} request
   */
  constructor(platformJS, request) {
    super(platformJS);

    /**
     * @type {ima.router.Request}
     */
    this._request = request;
  }

  /**
   * @override
   * @returns {string}
   */
  getUserAgent() {
    return this._request.getHeader('User-Agent');
  }
}
