import AbstractUserAgent from './AbstractUserAgent.js';

/**
 * Client-side UserAgent class.
 */
export default class ClientUserAgent extends AbstractUserAgent {
  // @if client
  /**
   * Initializes the user agent analyzer used at the client-side.
   *
   * @param {import('platform').default} platformJS
   * @param {import('@ima/core').Window} window
   */
  constructor(platformJS, window) {
    super(platformJS);

    /**
     * @type {import('@ima/core').Window}
     */
    this._window = window;
  }

  /**
   * @override
   * @returns {string}
   */
  getUserAgent() {
    return this._window.getWindow().navigator.userAgent;
  }
  // @endif
}
