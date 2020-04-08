// TODO: consider using the memored npm module for sharing the cache between
// all processes
import clone from 'clone';
import SharedCacheEntry from './SharedCacheEntry';

const CACHES_KEY = Symbol('sharedCaches');

// We have to store our cache in the global context because the context of
// modules in the application may not be shared and may ge cleared by the IMA's
// aplication server.
if (typeof window === 'undefined' && !global[CACHES_KEY]) {
  Object.defineProperty(global, CACHES_KEY, {
    enumerable: false,
    writable: false,
    value: {},
  });
}

// This effectively prevents any 3rd party code from creating instances of the
// SharedCache class since it is impossible to create to identical symbols and
// we use this one as our internal private secret.
const PRIVATE_CONSTRUCTOR_ACCESS = Symbol('');

/**
 * Private field an method symbols.
 *
 * @type {Object<string, symbol>}
 */
const PRIVATE = Object.freeze({
  // fields
  entries: Symbol('entries'),
  entryCount: Symbol('entryCount'),

  // methods
  performGarbageCollection: Symbol('performGarbageCollection'),
});

/**
 * This cache is not meant to be used at the client-side will always remain
 * empty when used at the client-side. Use the application's per-request cache
 * instead.
 */
export default class SharedCache {
  /**
   * Initializes the shared cache.
   *
   * @param {symbol} privateSecret A shared secret that is used to prevent
   *        3rd party code from creating new instances of the shared cache.
   * @param {{maxEntries: number, gcFactor: number, ttl: number}} options
   *        The configuration options of this cache.
   */
  constructor(privateSecret, options) {
    if (privateSecret !== PRIVATE_CONSTRUCTOR_ACCESS) {
      throw new TypeError('The SharedCache constructor is private');
    }

    if (Object.prototype.hasOwnProperty.call(options, 'maxEntries')) {
      if (
        typeof options.maxEntries !== 'number' ||
        Math.floor(options.maxEntries) !== options.maxEntries ||
        options.maxEntries < 1
      ) {
        throw new TypeError(
          'The maxEntries option has to be either ' +
            'a positive integer, or left out'
        );
      }
    }
    if (Object.prototype.hasOwnProperty.call(options, 'gcFactor')) {
      if (
        typeof options.gcFactor !== 'number' ||
        options.gcFactor <= 0 ||
        options.gcFactor >= 1
      ) {
        throw new TypeError(
          'The gcFactor option has to be either ' +
            'a float within the range (0, 1) (non-inclusive), ' +
            'or left out'
        );
      }
    }
    if (Object.prototype.hasOwnProperty.call(options, 'ttl')) {
      if (typeof options.ttl !== 'number' || options.ttl < 0) {
        throw new TypeError(
          'The ttl option has to be either ' +
            'a float and greater or equal to 0 ' +
            'or left out'
        );
      }
    }

    /**
     * The configuration options of this cache. The {@code maxEntries}
     * property specified the maximum number of entries that can be stored
     * in this cache before the garbage collection is triggered. The
     * {@code gcFactor} specified the ratio of entries that should be kept
     * after running the garbage collection to the maximum number of
     * entries that can be stored in this cache. The {@code ttl} property
     * specifies for how long should the cache entries be kept.
     *
     * @type {{maxEntries: number, gcFactor: number, ttl: number}}
     */
    this.options = Object.freeze(
      Object.assign(
        {
          maxEntries: 64,
          gcFactor: 0.75,
          ttl: 0, // 0 = unlimited
        },
        options
      )
    );

    // store the entries in a blank object without a prototype
    /**
     * The entries of this cache. The field names are cache entry keys. The
     * {@code lastUpdate} and {@code lastAccess} entry properties are UNIX
     * timestamps with millisecond precision.
     *
     * @type {Object<string, SharedCacheEntry>}
     */
    this[PRIVATE.entries] = Object.create(null);

    /**
     * The current number of entries in this cache. This is an
     * optimization field so that the number does not need to be recounted
     * every time an entry is added.
     *
     * @type {number}
     */
    this[PRIVATE.entryCount] = 0;

    Object.seal(this);
  }

  /**
   * Tests whether a cache entry identified by the provided key exists within
   * this cache.
   *
   * @param {string} key The key identifying the cache entry.
   * @return {boolean} {@code true} if the entry exists in this cache.
   */
  has(key) {
    if (typeof window !== 'undefined') {
      return false;
    }

    const cacheEntry = this[PRIVATE.entries][key];
    if (cacheEntry && !cacheEntry.isExpired()) {
      return true;
    }

    this.delete(key);

    return false;
  }

  /**
   * Retrieves the value of the specified cache entry, if the entry exists.
   *
   * The method always returns {@code undefined} at the client-side.
   *
   * @param {string} key The key identifying the cache entry.
   * @return {*} The value of the specified cache entry, or {@code undefined}
   *         if the entry does not exist or the cache is being used at the
   *         client side.
   */
  get(key) {
    const cacheEntry = this[PRIVATE.entries][key];

    if (cacheEntry && !cacheEntry.isExpired()) {
      return clone(cacheEntry.value);
    }

    this.delete(key);

    return undefined;
  }

  /**
   * Sets the specified cache entry to the provided value.
   *
   * The method performs garbage collection if the cache would overflow by
   * adding the new entry before the new entry is added.
   *
   * The method has no effect at the client-side.
   *
   * @param {string} key The key identifying the cache entry.
   * @param {*} value The value to store in the cache entry. The value must
   *        be cloneable.
   * @param {number} ttl The time-to-life of the new record.
   */
  set(key, value, ttl) {
    if (typeof window !== 'undefined') {
      return;
    }

    if (this[PRIVATE.entries][key]) {
      this[PRIVATE.entries][key].value = clone(value);
    } else {
      if (this[PRIVATE.entryCount] >= this.options.maxEntries) {
        this[PRIVATE.performGarbageCollection]();
      }

      this[PRIVATE.entries][key] = new SharedCacheEntry(
        clone(value),
        ttl || this.options.ttl
      );
      this[PRIVATE.entryCount]++;
    }
  }

  /**
   * Deletes the entry identified by the specified key from this cache.
   *
   * The method has no effect if the entry does not exist, or the cache is
   * being used at the client side.
   *
   * @param {string} key The cache entry key.
   */
  delete(key) {
    if (typeof window !== 'undefined') {
      return;
    }

    if (this[PRIVATE.entries][key]) {
      delete this[PRIVATE.entries][key];
      this[PRIVATE.entryCount]--;
    }
  }

  /**
   * Returns the shared cache identified by the specified name. The cache is
   * created and initialized with the provided options if it does not exist
   * already.
   *
   * Note that there is no upper bound on the number of shared caches, nor
   * are the old caches never deleted, therefore it is recommended to use a
   * small number of shared caches in the application with well defined
   * and documented names.
   *
   * @param {string} cacheName The name of the cache to retrieve.
   * @param {{maxEntries: number, gcFactor: number, ttl: number}} cacheOptions
   *        Options with which the cache should be initialized, in case it
   *        does not exist already.
   * @return {SharedCache} The requested shared cache.
   */
  static getCache(
    cacheName,
    cacheOptions = { maxEntries: 64, gcFactor: 0.75, ttl: 0 }
  ) {
    if (typeof window !== 'undefined') {
      return new SharedCache(PRIVATE_CONSTRUCTOR_ACCESS, cacheOptions);
    }

    if (!global[CACHES_KEY][cacheName]) {
      global[CACHES_KEY][cacheName] = new SharedCache(
        PRIVATE_CONSTRUCTOR_ACCESS,
        cacheOptions
      );
    }

    return global[CACHES_KEY][cacheName];
  }

  /**
   * Performs the garbage collection of the entries in this cache, deleting
   * the entries that were not accessed for the longest time, until the
   * number of the entries in the cache is reduced to the maximum number of
   * entries multiplied by the garbage collection factor specified in the
   * options.
   */
  [PRIVATE.performGarbageCollection]() {
    let entries = this[PRIVATE.entries];
    let entriesToDelete = [];
    let numOfEntriesToDelete = Math.ceil(
      this[PRIVATE.entryCount] - this.options.maxEntries * this.options.gcFactor
    );

    for (let key in entries) {
      let entry = entries[key];
      let insertAtIndex = entriesToDelete.length ? -1 : 0;
      for (
        let index = 0, length = entriesToDelete.length;
        index < length;
        index++
      ) {
        if (entriesToDelete[index].lastAccess < entry.lastAccess) {
          continue;
        }

        insertAtIndex = index;
        break;
      }
      if (insertAtIndex > -1) {
        entriesToDelete.splice(insertAtIndex, 0, {
          key,
          lastAccess: entry.lastAccess,
        });
      }

      if (entriesToDelete.length > numOfEntriesToDelete) {
        entriesToDelete.splice(numOfEntriesToDelete);
      }
    }

    for (let { key } of entriesToDelete) {
      this.delete(key);
    }
  }
}
