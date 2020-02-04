import LocalStorage from '../LocalStorage';

describe('LocalStorageHelper', () => {
  let dummyWindow = {
    isClient() {
      return true;
    }
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
    _keys: ['a', 'b', 'c', 'd']
  };

  let localStorageInstance = null;

  beforeEach(() => {
    global.localStorage = localStorageMock;
    localStorageInstance = new LocalStorage(dummyWindow);
    localStorageInstance.init();
  });

  describe('has method', () => {
    it('should return true if localStorageInstance.get method returns valid result', () => {
      spyOn(localStorageInstance, 'get').and.returnValue(42);

      let result = localStorageInstance.has('testName');

      expect(result).toEqual(true);
    });

    it('should return false if localStorageInstance.get method returns invalid result', () => {
      spyOn(localStorageInstance, 'get').and.returnValue(undefined);

      let result = localStorageInstance.has('testName');

      expect(result).toEqual(false);
    });
  });

  describe('get method', () => {
    it("should return undefined if localStorageInstance instance wasn't initialized yet", () => {
      localStorageInstance._initialized = false;

      let result = localStorageInstance.get('testName');

      expect(result).toEqual(undefined);
    });

    it('should call localStorageInstance.get method', () => {
      spyOn(localStorageInstance, 'get');

      localStorageInstance.get('testName');

      expect(localStorageInstance.get).toHaveBeenCalled();
    });

    it('should return correct value', () => {
      spyOn(localStorage, 'getItem').and.returnValue({ value: 'testValue' });

      let result = localStorageInstance.get('testName');

      expect(result).toEqual('testValue');
    });

    it('should return correct value boolean', () => {
      spyOn(localStorage, 'getItem').and.returnValue({ value: false });

      let result = localStorageInstance.get('testName');

      expect(result).toEqual(false);
    });

    it('should return correct value for undefined', () => {
      spyOn(localStorage, 'getItem').and.returnValue({ value: undefined });

      let result = localStorageInstance.get('testName');

      expect(result).toEqual(undefined);
    });

    it('should return correct value for null', () => {
      spyOn(localStorage, 'getItem').and.returnValue({ value: null });

      let result = localStorageInstance.get('testName');

      expect(result).toEqual(null);
    });

    it('should return undefined and call localStorageInstance.delete method if item is expired', () => {
      spyOn(localStorage, 'getItem').and.returnValue({
        value: 'testValue',
        expires: Date.now()
      });
      spyOn(localStorageInstance, 'delete');

      let result = localStorageInstance.get('testName');

      expect(result).toEqual(undefined);
      expect(localStorageInstance.delete).toHaveBeenCalled();
    });

    it('should return item if item has no value', () => {
      spyOn(localStorageInstance, 'get').and.returnValue({
        testKey: 'testValue'
      });

      let result = localStorageInstance.get('testName');

      expect(result).toEqual({ testKey: 'testValue' });
    });

    it('should return undefined if item is not defined', () => {
      spyOn(localStorage, 'getItem').and.returnValue(null);

      let result = localStorageInstance.get('testName');

      expect(result).toEqual(undefined);
    });
  });

  describe('set method', () => {
    it('should call localStorage.setItem method', () => {
      spyOn(localStorage, 'setItem');
      spyOn(localStorageInstance, '_getExpires');

      localStorageInstance.set('testKey', 'testValue');

      expect(localStorage.setItem).toHaveBeenCalledWith(
        'testKey',
        '{"value":"testValue"}'
      );
      expect(localStorageInstance._getExpires).toHaveBeenCalled();
    });

    it('should call localStorageInstance.delete method if value is undefined', () => {
      spyOn(localStorageInstance, 'delete');

      let result = localStorageInstance.set('testName', undefined);

      expect(localStorageInstance._initialized).toEqual(true);
      expect(result).toEqual(localStorageInstance);
      expect(localStorageInstance.delete).toHaveBeenCalled();
    });

    it("should return localStorageInstance instance if localStorageInstance wasn't initialized yet", () => {
      localStorageInstance._initialized = false;

      let result = localStorageInstance.set('testName', 'testValue');

      expect(result).toEqual(localStorageInstance);
    });

    it('should correctly set global options if provided', () => {
      spyOn(localStorageInstance, '_getExpires').and.returnValue(10);
      spyOn(localStorage, 'setItem');

      localStorageInstance._options = { expires: 10 };
      localStorageInstance.set('testKey', 'testValue');

      expect(localStorageInstance._getExpires).toHaveBeenCalledWith({
        expires: 10
      });
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'testKey',
        '{"value":"testValue","expires":10}'
      );
    });

    it('should correctly override global options if local options provided', () => {
      spyOn(localStorageInstance, '_getExpires').and.returnValue(5);
      spyOn(localStorage, 'setItem');

      localStorageInstance._options = { expires: 10 };
      localStorageInstance.set('testKey', 'testValue', { expires: 5 });

      expect(localStorageInstance._getExpires).toHaveBeenCalledWith({
        expires: 5
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
      spyOn(localStorage, 'removeItem');

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
      spyOn(localStorage, 'clear');

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
      spyOn(localStorageInstance, 'get').and.returnValue(true);

      let result = localStorageInstance.keys();

      expect(typeof result).toEqual('object');

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

      expect(result).toEqual(4);
    });
  });

  describe('isSupported method', () => {
    let jsonMock = {
      stringify() {}
    };

    beforeEach(() => {
      global.JSON = jsonMock;
    });

    it("should return false if we're not on client", () => {
      spyOn(localStorageInstance._window, 'isClient').and.returnValue(false);

      let result = localStorageInstance.isSupported();

      expect(result).toEqual(false);
      expect(localStorageInstance._window.isClient).toHaveBeenCalled();
    });

    it('should return false if localStorage is not accessible', () => {
      // eslint-disable-next-line no-global-assign
      localStorage = undefined;

      let result = localStorageInstance.isSupported();

      expect(result).toEqual(false);
    });

    it('should return false if JSON object is not available', () => {
      // eslint-disable-next-line no-global-assign
      JSON = undefined;

      let result = localStorageInstance.isSupported();

      expect(result).toEqual(false);
    });

    it('should return false if setting localStorage item fails', () => {
      spyOn(localStorageInstance, '_isLocalStorageReady').and.returnValue(
        false
      );

      let result = localStorageInstance.isSupported();

      expect(result).toEqual(false);
      expect(localStorageInstance._isLocalStorageReady).toHaveBeenCalled();
    });

    it('should return true if all prerequisites met', () => {
      expect(localStorageInstance._isLocalStorageReady()).toEqual(true);
      expect(localStorageInstance._window.isClient()).toEqual(true);
      expect(localStorage !== undefined).toEqual(true);
      expect(JSON !== undefined).toEqual(true);
      expect(localStorageInstance.isSupported()).toEqual(true);
    });
  });

  describe('_isLocalStorageReady', () => {
    it('should return false if localStorage.setItem throws an error', () => {
      spyOn(localStorage, 'setItem').and.throwError('error');

      let result = localStorageInstance._isLocalStorageReady();

      expect(localStorage.setItem).toThrow('error');
      expect(result).toEqual(false);
    });

    it('should return true if there was no error', () => {
      spyOn(localStorage, 'setItem');
      spyOn(localStorage, 'removeItem');

      let result = localStorageInstance._isLocalStorageReady();

      expect(localStorage.setItem).toHaveBeenCalled();
      expect(localStorage.removeItem).toHaveBeenCalled();
      expect(result).toEqual(true);
    });
  });

  describe('_getExpires method', () => {
    it('should return undefined if invalid or no options were passed', () => {
      expect(localStorageInstance._getExpires()).toEqual(undefined);
      expect(localStorageInstance._getExpires('')).toEqual(undefined);
      expect(localStorageInstance._getExpires([1, 2, 3])).toEqual(undefined);
      expect(localStorageInstance._getExpires(undefined)).toEqual(undefined);
    });

    it('should return date as a number if value was provided as Date object', () => {
      const date = new Date();
      let result = localStorageInstance._getExpires({ expires: date });

      expect(result).toEqual(date.valueOf());
    });

    it('should return shifted date as a number if value was provided as number in seconds', () => {
      spyOn(Date, 'now').and.returnValue(10000);
      let result = localStorageInstance._getExpires({ expires: 1500 });

      expect(result).toEqual(1510000);
    });
  });
});
