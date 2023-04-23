import AbstractUserAgent from './AbstractUserAgent.js';

/**
 * Server-side UserAgent class
 */
export default class ServerUserAgent extends AbstractUserAgent {
  // @if server
  /**
   * Initializes the user agent analyzer used at the server-side.
   *
   * @param {import('platform').default} platformJS
   * @param {import('@ima/core').Request} request
   */
  constructor(platformJS, request) {
    super(platformJS);

    /**
     * @type {import('@ima/core').Request}
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
  // @endif
}
