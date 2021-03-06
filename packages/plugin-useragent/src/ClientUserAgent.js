// @client-side

import AbstractUserAgent from './AbstractUserAgent.js';

/**
 * Client-side UserAgent class.
 */
export default class ClientUserAgent extends AbstractUserAgent {
  /**
   * Initializes the user agent analyzer used at the client-side.
   *
   * @param {PlatformJS} platformJS
   * @param {ima.window.Window} window
   */
  constructor(platformJS, window) {
    super(platformJS);

    /**
     * @type {ima.window.Window}
     */
    this._window = window;
  }

  /**
   * @override
   * @return {string}
   */
  getUserAgent() {
    return this._window.getWindow().navigator.userAgent;
  }
}
