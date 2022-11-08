import SharedCacheEntry from '../SharedCacheEntry';

const ENTRY_VALUE = { test: 'value' };
let cacheEntry = null;

describe('SharedCacheEntry', () => {
  beforeEach(() => {
    jest.spyOn(Date, 'now').mockReturnValue(1000);
    cacheEntry = new SharedCacheEntry(ENTRY_VALUE, 500);
  });

  it('should mark timestamp when it was created', () => {
    expect(cacheEntry.created).toBe(1000);
  });

  describe('value getter', () => {
    it('should return entry value and mark timestamp when it was last accessed', () => {
      expect(cacheEntry.lastAccess).toBe(Number.MIN_SAFE_INTEGER);

      Date.now.mockReturnValue(2000);
      expect(cacheEntry.value).toBe(ENTRY_VALUE); // Explicitly `toBe` to check if the object is not dereferenced
      expect(cacheEntry.lastAccess).toBe(2000);
    });
  });

  describe('value setter', () => {
    it('should update entry value and mark timestamp when it was last updated', () => {
      expect(cacheEntry.lastUpdate).toBe(1000);

      Date.now.mockReturnValue(3000);
      const NEW_VALUE = { test: 'newvalue' };
      cacheEntry.value = NEW_VALUE;

      expect(cacheEntry.value).toBe(NEW_VALUE); // Explicitly `toBe` to check if the object is not dereferenced
      expect(cacheEntry.lastUpdate).toBe(3000);
    });
  });

  describe('isExpired() method', () => {
    beforeEach(() => {
      Date.now.mockReturnValue(4000); // 4000 (now) > 1000 (timestamp) + 500 (TTL)
    });

    it('should return true if entry TTL ran out.', () => {
      expect(cacheEntry.isExpired()).toBeTruthy();
    });

    it('should return false if entry TTL is unlimited (TTL = 0)', () => {
      const unlimitedEntry = new SharedCacheEntry(ENTRY_VALUE, 0);

      expect(unlimitedEntry.isExpired()).toBeFalsy();
    });
  });
});
