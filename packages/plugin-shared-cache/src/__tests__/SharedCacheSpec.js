import SharedCache from '../SharedCache';

describe('SharedCache', () => {
  const CACHE_NAME = 'testing cache';
  const OPTIONS = Object.freeze({
    maxEntries: 4,
    gcFactor: 0.75
  });

  it(
    'should provide the same instance of cache at the back-end for the ' +
      'same cache name',
    () => {
      let cache1 = SharedCache.getCache(CACHE_NAME, OPTIONS);
      let cache2 = SharedCache.getCache(CACHE_NAME, OPTIONS);
      expect(cache1).toBe(cache2);
    }
  );

  it('should use the options provided to it', () => {
    let cache = SharedCache.getCache(CACHE_NAME, OPTIONS);
    expect(cache.options.maxEntries).toBe(OPTIONS.maxEntries);
    expect(cache.options.gcFactor).toBe(OPTIONS.gcFactor);
  });

  it('should allow storing, retrieving and deleting entries', () => {
    let cache = SharedCache.getCache(CACHE_NAME, OPTIONS);
    cache.set('abc', 1);
    expect(cache.get('abc')).toBe(1);
    cache.delete('abc');
  });

  it('should return undefined for non-existing entries', () => {
    let cache = SharedCache.getCache(CACHE_NAME, OPTIONS);
    expect(cache.get('abc')).toBeUndefined();
    cache.set('abc', 1);
    cache.delete('abc');
    expect(cache.get('abc')).toBeUndefined();
  });

  it('should allow for testing whether an entry is in the cache', () => {
    let cache = SharedCache.getCache(CACHE_NAME, OPTIONS);
    expect(cache.has('abc')).toBe(false);
    cache.set('abc', undefined);
    expect(cache.has('abc')).toBe(true);
    cache.delete('abc');
    expect(cache.has('abc')).toBe(false);
  });

  it('should allow deleting non-existing entries', () => {
    let cache = SharedCache.getCache(CACHE_NAME, OPTIONS);
    cache.delete('abcdef');
  });

  it('should perform garbage collection when the cache is over-filled', () => {
    let cache = SharedCache.getCache(CACHE_NAME, OPTIONS);
    cache.set('abc', 1);
    cache.set('def', 2);
    cache.set('ghi', 3);
    cache.set('jkl', 4);
    cache.set('mno', 5);
    let numOfEntries = [
      cache.has('abc'),
      cache.has('def'),
      cache.has('ghi'),
      cache.has('jkl'),
      cache.has('mno')
    ]
      .map((present) => (present ? 1 : 0))
      .reduce((p1, p2) => p1 + p2, 0);
    expect(numOfEntries).toBe(4);

    cache.delete('abc');
    cache.delete('def');
    cache.delete('ghi');
    cache.delete('jkl');
    cache.delete('mno');
  });

  it(
    'should now garbage-collect the entry that triggered the garbage ' +
      'collection',
    () => {
      let cache = SharedCache.getCache(CACHE_NAME, OPTIONS);
      cache.set('abc', 1);
      cache.set('def', 2);
      cache.set('ghi', 3);
      cache.set('jkl', 4);
      cache.set('mno', 5);

      expect(cache.has('mno')).toBe(true);

      cache.delete('abc');
      cache.delete('def');
      cache.delete('ghi');
      cache.delete('jkl');
      cache.delete('mno');
    }
  );

  it(
    'should garbage-collect the entries that were not retrieved for the ' +
      'longest time period',
    () => {
      let cache = SharedCache.getCache(CACHE_NAME, OPTIONS);
      cache.set('abc', 1);
      cache.set('def', 2);
      cache.set('ghi', 3);
      cache.set('jkl', 4);

      cache.get('def');
      cache.get('ghi');

      cache.set('mno', 5);

      expect(cache.has('def')).toBe(true);
      expect(cache.has('ghi')).toBe(true);

      cache.delete('abc');
      cache.delete('def');
      cache.delete('ghi');
      cache.delete('jkl');
      cache.delete('mno');
    }
  );

  it('should not be possible to mutate the entries of the cache', () => {
    let cache = SharedCache.getCache(CACHE_NAME, OPTIONS);
    cache.set('abc', { x: 1 });
    cache.get('abc').x = 2;
    expect(cache.get('abc')).toEqual({ x: 1 });

    let value = { y: 1 };
    cache.set('abc', value);
    value.y = 2;
    expect(cache.get('abc')).toEqual({ y: 1 });

    cache.delete('abc');
  });
});
