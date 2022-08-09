/**
 * AbstractUserAgent class
 */
export default class AbstractUserAgent {
  /**
   * Initializes the user agent analyzer plugin.
   *
   * @param {PlatformJS} platformParser
   */
  constructor(platformParser) {
    /**
     * UserAgent parser.
     *
     * @type {PlatformJS}
     */
    this._platformParser = platformParser;

    /**
     * UserAgent object.
     *
     * @type {Object<string, *>}
     */
    this._uaObject = {};
  }

  /**
   * Initialization user agent parser.
   */
  init() {
    this._fixTypes(this._platformParser.parse(this.getUserAgent()));
  }

  /**
   * Returns original UserAgent.
   */
  getUserAgent() {
    throw new Error(
      'The getUserAgent() method is abstract and must be overridden.'
    );
  }

  /**
   * Returns platform object - Returns platform object - all values are
   * strings(numbers), not undefined or null.
   *
   * @returns {object} Object structure https://github.com/bestiejs/platform.js/blob/master/doc/README.md#readme
   */
  getPlatform() {
    return this._uaObject;
  }

  /**
   * Returns the platform description.
   *
   * @returns {string}
   */
  getDescription() {
    return this._uaObject.description;
  }

  /**
   * Returns the name of the browser's layout engine.
   *
   * @returns {string}
   */
  getLayout() {
    return this._uaObject.layout;
  }

  /**
   * Returns the name of the product's manufacturer.
   *
   * @returns {string}
   */
  getManufacturer() {
    return this._uaObject.manufacturer;
  }

  /**
   * Returns the name of the browser/environment.
   *
   * @returns {string}
   */
  getName() {
    return this._uaObject.name;
  }

  /**
   * Returns the alpha/beta release indicator.
   *
   * @returns {string}
   */
  getPrerelease() {
    return this._uaObject.prerelease;
  }

  /**
   * Returns the name of the product hosting the browser.
   *
   * @returns {string}
   */
  getProduct() {
    return this._uaObject.product;
  }

  /**
   * Returns the browser/environment version.
   *
   * @returns {string}
   */
  getVersion() {
    return this._uaObject.version;
  }

  /**
   * Returns the family of the OS.
   * Common values include:
   * "Windows", "Windows Server 2008 R2 / 7", "Windows Server 2008 / Vista",
   * "Windows XP", "OS X", "Ubuntu", "Debian", "Fedora", "Red Hat", "SuSE",
   * "Android", "iOS" and "Windows Phone"
   *
   * @returns {string}
   */
  getOSFamily() {
    return this._uaObject.os.family;
  }

  /**
   * Returns the CPU architecture the OS is built for.
   *
   * @returns {number} The CPU architecture the OS is built for or -1 if
   *         unknown.
   */
  getOSArchitecture() {
    return this._uaObject.os.architecture;
  }

  /**
   * Returns the version of the OS.
   *
   * @returns {string}
   */
  getOSVersion() {
    return this._uaObject.os.version;
  }

  /**
   * Fix type for user-agent object from platform.js.
   *
   * @param {Object<string, *>} uaObject structure
   *        https://github.com/bestiejs/platform.js/blob/master/doc/README.md#readme
   */
  _fixTypes(uaObject) {
    this._uaObject.description = uaObject.description || 'unknown';
    this._uaObject.layout = uaObject.layout || 'unknown';
    this._uaObject.manufacturer = uaObject.manufacturer || 'unknown';
    this._uaObject.name = uaObject.name || 'unknown';
    this._uaObject.prerelease = uaObject.prerelease || 'unknown';
    this._uaObject.product = uaObject.product || 'unknown';
    this._uaObject.ua = uaObject.ua || 'unknown';
    this._uaObject.version = uaObject.version || 'unknown';

    // OS group
    this._uaObject.os = {};
    this._uaObject.os.architecture =
      uaObject.os && uaObject.os.architecture ? uaObject.os.architecture : -1;
    this._uaObject.os.family =
      uaObject.os && uaObject.os.family ? uaObject.os.family : 'unknown';
    this._uaObject.os.version =
      uaObject.os && uaObject.os.version ? uaObject.os.version : 'unknown';

    // parsing of SznProhlizec/sBrowser/Seznam browser
    if (typeof uaObject.ua === 'string') {
      const sznProhlizecRegExp = /SznProhlizec\/\S+/;
      const match = uaObject.ua.match(sznProhlizecRegExp);

      if (match && match[0]) {
        const SznProhlizecUserAgentParts = match[0].split('/');
        const SznProhlizecVersion = parseFloat(SznProhlizecUserAgentParts[1]);

        this._uaObject.name = SznProhlizecUserAgentParts[0];
        this._uaObject.version = SznProhlizecVersion
          ? SznProhlizecVersion.toString()
          : 'unknown';
      }
    }
  }
}
