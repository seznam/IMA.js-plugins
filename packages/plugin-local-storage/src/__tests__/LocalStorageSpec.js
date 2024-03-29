import LocalStorage from '../LocalStorage';

describe('LocalStorageHelper', () => {
  let dummyWindow = {
    isClient() {
      return true;
    },
  };

  let localStorageMock = {
    setItem() {},
    getItem() {},
    removeItem() {},
    clear() {},
    key(index) {
      return this._keys[index];
    },
    length: 4,
    _keys: ['a', 'b', 'c', 'd'],
  };

  let localStorageInstance = null;

  beforeEach(() => {
    global.localStorage = localStorageMock;
    localStorageInstance = new LocalStorage(dummyWindow);
    localStorageInstance.init();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('has method', () => {
    it('should return true if localStorageInstance.get method returns valid result', () => {
      jest.spyOn(localStorageInstance, 'get').mockReturnValue(42);

      let result = localStorageInstance.has('testName');

      expect(result).toBe(true);
    });

    it('should return false if localStorageInstance.get method returns invalid result', () => {
      jest.spyOn(localStorageInstance, 'get').mockReturnValue(undefined);

      let result = localStorageInstance.has('testName');

      expect(result).toBe(false);
    });

    it('should return true for boolean value', () => {
      jest.spyOn(localStorageInstance, 'get').mockReturnValue(false);

      let result = localStorageInstance.has('testName');

      expect(result).toBe(true);
    });

    it('should return true for null', () => {
      jest.spyOn(localStorageInstance, 'get').mockReturnValue(null);

      let result = localStorageInstance.has('testName');

      expect(result).toBe(true);
    });
  });

  describe('get method', () => {
    it("should return undefined if localStorageInstance instance wasn't initialized yet", () => {
      localStorageInstance._initialized = false;

      let result = localStorageInstance.get('testName');

      expect(result).toBeUndefined();
    });

    it('should call localStorageInstance.get method', () => {
      jest.spyOn(localStorageInstance, 'get').mockImplementation(() => {});

      localStorageInstance.get('testName');

      expect(localStorageInstance.get).toHaveBeenCalled();
    });

    it('should return correct value', () => {
      jest
        .spyOn(localStorage, 'getItem')
        .mockReturnValue({ value: 'testValue' });

      let result = localStorageInstance.get('testName');

      expect(result).toBe('testValue');
    });

    it('should return correct value boolean', () => {
      jest.spyOn(localStorage, 'getItem').mockReturnValue({ value: false });

      let result = localStorageInstance.get('testName');

      expect(result).toBe(false);
    });

    it('should return correct value for undefined', () => {
      jest.spyOn(localStorage, 'getItem').mockReturnValue({ value: undefined });

      let result = localStorageInstance.get('testName');

      expect(result).toBeUndefined();
    });

    it('should return correct value for null', () => {
      jest.spyOn(localStorage, 'getItem').mockReturnValue({ value: null });

      let result = localStorageInstance.get('testName');

      expect(result).toBeNull();
    });

    it('should return undefined and call localStorageInstance.delete method if item is expired', () => {
      jest.spyOn(localStorage, 'getItem').mockReturnValue({
        value: 'testValue',
        expires: Date.now(),
      });
      jest.spyOn(localStorageInstance, 'delete').mockImplementation(() => {});

      let result = localStorageInstance.get('testName');

      expect(result).toBeUndefined();
      expect(localStorageInstance.delete).toHaveBeenCalled();
    });

    it('should return item if item has no value', () => {
      jest.spyOn(localStorageInstance, 'get').mockReturnValue({
        testKey: 'testValue',
      });

      let result = localStorageInstance.get('testName');

      expect(result).toEqual({ testKey: 'testValue' });
    });

    it('should return undefined if item is not defined', () => {
      jest.spyOn(localStorage, 'getItem').mockReturnValue(null);

      let result = localStorageInstance.get('testName');

      expect(result).toBeUndefined();
    });
  });

  describe('set method', () => {
    it('should call localStorage.setItem method', () => {
      jest.spyOn(localStorage, 'setItem').mockImplementation(() => {});
      jest
        .spyOn(localStorageInstance, '_getExpires')
        .mockImplementation(() => {});

      localStorageInstance.set('testKey', 'testValue');

      expect(localStorage.setItem).toHaveBeenCalledWith(
        'testKey',
        '{"value":"testValue"}'
      );
      expect(localStorageInstance._getExpires).toHaveBeenCalled();
    });

    it('should call localStorageInstance.delete method if value is undefined', () => {
      jest.spyOn(localStorageInstance, 'delete').mockImplementation(() => {});

      let result = localStorageInstance.set('testName', undefined);

      expect(localStorageInstance._initialized).toBe(true);
      expect(result).toEqual(localStorageInstance);
      expect(localStorageInstance.delete).toHaveBeenCalled();
    });

    it("should return localStorageInstance instance if localStorageInstance wasn't initialized yet", () => {
      localStorageInstance._initialized = false;

      let result = localStorageInstance.set('testName', 'testValue');

      expect(result).toEqual(localStorageInstance);
    });

    it('should correctly set global options if provided', () => {
      jest.spyOn(localStorageInstance, '_getExpires').mockReturnValue(10);
      jest.spyOn(localStorage, 'setItem').mockImplementation(() => {});

      localStorageInstance._options = { expires: 10 };
      localStorageInstance.set('testKey', 'testValue');

      expect(localStorageInstance._getExpires).toHaveBeenCalledWith({
        expires: 10,
      });
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'testKey',
        '{"value":"testValue","expires":10}'
      );
    });

    it('should correctly override global options if local options provided', () => {
      jest.spyOn(localStorageInstance, '_getExpires').mockReturnValue(5);
      jest.spyOn(localStorage, 'setItem').mockImplementation(() => {});

      localStorageInstance._options = { expires: 10 };
      localStorageInstance.set('testKey', 'testValue', { expires: 5 });

      expect(localStorageInstance._getExpires).toHaveBeenCalledWith({
        expires: 5,
      });
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'testKey',
        '{"value":"testValue","expires":5}'
      );
    });
  });

  describe('delete method', () => {
    it("should return localStorageInstance instance if localStorageInstance wasn't initialized yet", () => {
      localStorageInstance._initialized = false;

      let result = localStorageInstance.delete('testName');

      expect(result).toEqual(localStorageInstance);
    });

    it('should return localStorageInstance instance', () => {
      localStorageInstance._initialized = false;

      let result = localStorageInstance.delete('testName');

      expect(result).toEqual(localStorageInstance);
    });

    it('should call localStorage.removeItem method', () => {
      jest.spyOn(localStorage, 'removeItem').mockImplementation(() => {});

      localStorageInstance.delete('testName', 'testValue');

      expect(localStorage.removeItem).toHaveBeenCalled();
    });
  });

  describe('clear method', () => {
    it("should return localStorageInstance instance if localStorageInstance wasn't initialized yet", () => {
      localStorageInstance._initialized = false;

      let result = localStorageInstance.clear('testName');

      expect(result).toEqual(localStorageInstance);
    });

    it('should return localStorageInstance instance', () => {
      let result = localStorageInstance.clear('testName');

      expect(result).toEqual(localStorageInstance);
    });

    it('should call localStorage.clear method', () => {
      jest.spyOn(localStorage, 'clear').mockImplementation(() => {});

      localStorageInstance.clear();

      expect(localStorage.clear).toHaveBeenCalled();
    });
  });

  describe('keys method', () => {
    it("should return empty iterator if localStorageInstance wasn't initialized yet", () => {
      localStorageInstance._initialized = false;

      let result = localStorageInstance.keys();

      expect(result).toEqual([][Symbol.iterator]());
    });

    it('should return keys iterator', () => {
      jest.spyOn(localStorageInstance, 'get').mockReturnValue(true);

      let result = localStorageInstance.keys();

      expect(typeof result).toBe('object');

      let i = 0;
      for (let key of result) {
        expect(key).toEqual(localStorage.key(i++));
      }
    });
  });

  describe('size method', () => {
    it("should return localStorageInstance instance if localStorageInstance wasn't initialized yet", () => {
      localStorageInstance._initialized = false;

      let result = localStorageInstance.size();

      expect(result).toEqual(localStorageInstance);
    });

    it('should return localStorage.length', () => {
      let result = localStorageInstance.size();

      expect(result).toBe(4);
    });
  });

  describe('isSupported method', () => {
    let jsonMock = {
      stringify() {},
    };

    beforeEach(() => {
      global.JSON = jsonMock;
    });

    it("should return false if we're not on client", () => {
      jest
        .spyOn(localStorageInstance._window, 'isClient')
        .mockReturnValue(false);

      let result = localStorageInstance.isSupported();

      expect(result).toBe(false);
      expect(localStorageInstance._window.isClient).toHaveBeenCalled();
    });

    it('should return false if localStorage is not accessible', () => {
      // eslint-disable-next-line no-global-assign
      localStorage = undefined;

      let result = localStorageInstance.isSupported();

      expect(result).toBe(false);
    });

    it('should return false if JSON object is not available', () => {
      // eslint-disable-next-line no-global-assign
      JSON = undefined;

      let result = localStorageInstance.isSupported();

      expect(result).toBe(false);
    });

    it('should return false if setting localStorage item fails', () => {
      jest
        .spyOn(localStorageInstance._window, 'isClient')
        .mockReturnValue(true);
      jest
        .spyOn(localStorageInstance, '_isLocalStorageReady')
        .mockReturnValue(false);

      let result = localStorageInstance.isSupported();

      expect(result).toBe(false);
      expect(localStorageInstance._isLocalStorageReady).toHaveBeenCalled();
    });

    it('should return true if all prerequisites met', () => {
      expect(localStorageInstance._isLocalStorageReady()).toBe(true);
      expect(localStorageInstance._window.isClient()).toBe(true);
      expect(localStorage !== undefined).toBe(true);
      expect(JSON !== undefined).toBe(true);
      expect(localStorageInstance.isSupported()).toBe(true);
    });
  });

  describe('_isLocalStorageReady', () => {
    it('should return false if localStorage.setItem throws an error', () => {
      jest.spyOn(localStorage, 'setItem').mockImplementation(() => {
        throw new Error('error');
      });

      let result = localStorageInstance._isLocalStorageReady();

      expect(localStorage.setItem).toThrow('error');
      expect(result).toBe(false);
    });

    it('should return true if there was no error', () => {
      jest.spyOn(localStorage, 'setItem').mockImplementation(() => {});
      jest.spyOn(localStorage, 'removeItem').mockImplementation(() => {});

      let result = localStorageInstance._isLocalStorageReady();

      expect(localStorage.setItem).toHaveBeenCalled();
      expect(localStorage.removeItem).toHaveBeenCalled();
      expect(result).toBe(true);
    });
  });

  describe('_getExpires method', () => {
    it('should return undefined if invalid or no options were passed', () => {
      expect(localStorageInstance._getExpires()).toBeUndefined();
      expect(localStorageInstance._getExpires('')).toBeUndefined();
      expect(localStorageInstance._getExpires([1, 2, 3])).toBeUndefined();
      expect(localStorageInstance._getExpires(undefined)).toBeUndefined();
    });

    it('should return date as a number if value was provided as Date object', () => {
      const date = new Date();
      let result = localStorageInstance._getExpires({ expires: date });

      expect(result).toEqual(date.valueOf());
    });

    it('should return shifted date as a number if value was provided as number in seconds', () => {
      jest.spyOn(Date, 'now').mockReturnValue(10000);
      let result = localStorageInstance._getExpires({ expires: 1500 });

      expect(result).toBe(1510000);
    });
  });
});
