/**
 * The shared cache entry is a typed container of cache data used to track the
 * creation, updated, access and expiration of shared cache entries.
 */
export default class SharedCacheEntry {
  /**
   * Initializes the cache entry.
   *
   * @param {*} value The cache entry value.
   * @param {number} ttl The time to live in milliseconds.
   */
  constructor(value, ttl) {
    /**
     * Cache entry value.
     *
     * @type {*}
     */
    this._value = value;

    /**
     * The time to live in milliseconds. The cache entry is considered
     * expired after this time.
     *
     * @type {number}
     */
    this._ttl = ttl;

    /**
     * The timestamp of creation of this cache entry.
     *
     * @type {number}
     */
    this._created = Date.now();

    /**
     * The timestamp of last updated of this cache entry.
     *
     * @type {number}
     */
    this._updated = Date.now();

    /**
     * The timestamp of when this cache entry was last accessed.
     *
     * @type {number}
     */
    this._accessed = Number.MIN_SAFE_INTEGER;
  }

  /**
   * Returns `true` if this entry has expired.
   *
   * @returns {boolean} `true` if this entry has expired.
   */
  isExpired() {
    if (!this._ttl) {
      return false;
    }
    let now = Date.now();
    return now > this._created + this._ttl;
  }

  /**
   * Returns the entry value.
   *
   * @returns {*} The entry value.
   */
  get value() {
    this._accessed = Date.now();
    return this._value;
  }

  /**
   * Sets the entry value and updates
   * the last update timestamp.
   */
  set value(value) {
    this._updated = Date.now();
    this._value = value;
  }

  /**
   * Returns timestamp of when this entry
   * was created.
   *
   * @returns {number}
   */
  get created() {
    return this._created;
  }

  /**
   * Returns timestamp of when this entry
   * was last updated.
   *
   * @returns {number}
   */
  get lastUpdate() {
    return this._updated;
  }

  /**
   * Returns timestamp of when this entry
   * was last accessed.
   *
   * @returns {number}
   */
  get lastAccess() {
    return this._accessed;
  }
}
