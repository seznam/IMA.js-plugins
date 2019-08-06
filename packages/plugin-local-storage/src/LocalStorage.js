import Storage from 'ima/storage/Storage';

const TEST_KEY = 'ima-plugin-local-storage';

/**
 * Local storage class
 */
class LocalStorage extends Storage {
  static get $dependencies() {
    return ['$Window'];
  }

  /**
   * @param {ima.window.Window} window Global window object on client
   */
  constructor(window) {
    super();

    /**
     * @type {ima.window.Window}
     */
    this._window = window;

    /**
     * Controls whenever the options and thus the local storage is initialized.
     *
     * @type {boolean}
     * @private
     */
    this._initialized = false;

    /**
     * Holds current storage options.
     *
     * @type {Object}
     * @private
     */
    this._options = {};
  }

  /**
   * Initialize the local storage.
   *
   * @override
   * @param {{
   *   expires: ?(number|Date)=,
   * }=} options Local storage options, you can define default expiration time
   * @returns {LocalStorage} This local storage.
   */
  init(options = {}) {
    this._options = Object.assign({}, options) || {};
    this._initialized = this.isSupported();

    return this;
  }

  /**
   * @inheritDoc
   */
  has(key) {
    return !!this.get(key);
  }

  /**
   * @inheritDoc
   */
  get(key) {
    if (!this._initialized) {
      return undefined;
    }

    let rawItem = localStorage.getItem(key);
    let item;

    try {
      item = JSON.parse(rawItem);
    } catch (error) {
      item = rawItem;
    }

    if (item && item.value) {
      if (item.expires && Date.now() >= item.expires) {
        this.delete(key);

        return undefined;
      } else {
        return item.value;
      }
    }

    return undefined;
  }

  /**
   * Sets the local storage entry identified by the specified key to the provided
   * value along with information about it's expiration, if provided. The value is
   * run through JSON.stringify, before saving.
   *
   * @override
   * @param {string} key The key identifying the local storage entity
   * @param {*} value The local storage entry value
   * @param {{
   *   expires: ?(number|Date)=,
   * }=} options Local storage options, overwrites global settings
   * @returns {LocalStorage} This local storage
   */
  set(key, value, options = {}) {
    if (!this._initialized) {
      return this;
    }

    let opts = Object.assign({}, this._options, options);

    if (value === undefined) {
      this.delete(key);
    } else {
      let item = { value };
      let expires = this._getExpires(opts);

      if (expires) {
        item.expires = expires;
      }

      localStorage.setItem(key, JSON.stringify(item));
    }

    return this;
  }

  /**
   * @inheritDoc
   */
  delete(key) {
    if (!this._initialized) {
      return this;
    }

    localStorage.removeItem(key);

    return this;
  }

  /**
   * @inheritDoc
   */
  clear() {
    if (!this._initialized) {
      return this;
    }

    localStorage.clear();

    return this;
  }

  /**
   * @inheritDoc
   */
  keys() {
    if (!this._initialized) {
      return [][Symbol.iterator]();
    }

    let keys = [];
    let key;

    for (let i = 0; i < localStorage.length; i++) {
      key = localStorage.key(i);

      if (this.get(key) !== undefined) {
        keys.push(key);
      }
    }

    return keys[Symbol.iterator]();
  }

  /**
   * @inheritDoc
   */
  size() {
    if (!this._initialized) {
      return this;
    }

    return localStorage.length;
  }

  /**
   * Shortcut to {@code this.keys()} allowing the use of {@code for..of} loop
   * directly on the instance itself.
   *
   * @return {Iterator<string>} An iterator for traversing the keys in this
   *         storage. The iterator also implements the iterable protocol,
   *         returning itself as its own iterator, allowing it to be used in
   *         a {@code for..of} loop.
   */
  [Symbol.iterator]() {
    return this.keys();
  }

  /**
   * Checks if a localStorage object on client's window is available.
   *
   * @returns {boolean}
   */
  isSupported() {
    try {
      return (
        this._window.isClient() &&
        typeof localStorage !== 'undefined' &&
        typeof JSON !== 'undefined' &&
        this._isLocalStorageReady()
      );
    } catch (error) {
      if ($Debug) {
        console.warn('Local Storage is not accessible!', error);
      }

      return false;
    }
  }

  /**
   * Tests compatibility of local storage.
   *
   * @returns {boolean}
   * @private
   */
  _isLocalStorageReady() {
    try {
      localStorage.setItem(TEST_KEY, 1);
      localStorage.removeItem(TEST_KEY);
    } catch (error) {
      return false;
    }

    return true;
  }

  /**
   * Extracts {@code expires} value from options object and converts it to
   * {@code Date()} object, if it's set in seconds.
   *
   * @param {{
   *   expires: ?(number|Date)=,
   * }=} options Local storage options
   * @returns {number|undefined}
   * @private
   */
  _getExpires(options) {
    if (!options || typeof options !== 'object') {
      return undefined;
    }

    let expires;
    if (options.expires instanceof Date) {
      expires = options.expires.valueOf();
    } else if (typeof options.expires === 'number') {
      expires = Date.now() + options.expires * 1000;
    }

    return expires;
  }
}

export default LocalStorage;
