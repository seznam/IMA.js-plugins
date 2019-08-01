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
    delete() {},
    clear() {},
    key(index) {
      let keys = ['a', 'b', 'c', 'd'];
      return keys[index];
    },
    length: 4
  };

  let localStorageInstance = null;

  beforeEach(() => {
    localStorageInstance = new LocalStorage(dummyWindow);
    localStorageInstance.init();
    global.localStorage = localStorageMock;
  });

  describe('set method', () => {
    it('should call localStorage.set method', () => {
      spyOn(localStorageInstance, 'set');

      localStorageInstance.set('testKey', 'testValue');

      expect(localStorageInstance.set).toHaveBeenCalled();
    });

    it('should call localStorage.delete method if value is undefined', () => {
      spyOn(localStorageInstance, 'delete');

      localStorageInstance.set('testName', undefined);

      expect(localStorageInstance.delete).toHaveBeenCalled();
    });

    it("should return localStorage instance if localStorage wasn't initialized yet", () => {
      localStorageInstance._initialized = false;

      let result = localStorageInstance.set('testName', 'testValue');

      expect(result).toEqual(localStorageInstance);
    });
  });

  describe('get method', () => {
    it("should return undefined if localStorage wasn't initialized yet", () => {
      localStorageInstance._initialized = false;

      let result = localStorageInstance.get('testName');

      expect(result).toEqual(undefined);
    });

    it('should call localStorage.get method', () => {
      spyOn(localStorageInstance, 'get');

      localStorageInstance.get('testName');

      expect(localStorageInstance.get).toHaveBeenCalled();
    });

    it('should return correct value', () => {
      spyOn(localStorage, 'getItem').and.returnValue({ value: 'testValue' });

      let result = localStorageInstance.get('testName');

      expect(result).toEqual('testValue');
    });

    it('should return undefined and call localStorage.delete method if item is expired', () => {
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
      spyOn(localStorageInstance, 'get').and.returnValue({ testKey: 'testValue' });

      let result = localStorageInstance.get('testName');

      expect(result).toEqual({ testKey: 'testValue' });
    });

    it('should return undefined if item is not defined', () => {
      spyOn(localStorage, 'getItem').and.returnValue(null);

      let result = localStorageInstance.get('testName');

      expect(result).toEqual(undefined);
    });
  });

  describe('has method', () => {
    it('should return true if localStorage.get method returns valid result', () => {
      spyOn(localStorageInstance, 'get').and.returnValue(42);

      let result = localStorageInstance.has('testName');

      expect(result).toEqual(true);
    });

    it('should return false if localStorage.get method returns unvalid result', () => {
      spyOn(localStorageInstance, 'get').and.returnValue(undefined);

      let result = localStorageInstance.has('testName');

      expect(result).toEqual(false);
    });
  });

  describe('delete method', () => {
    it("should return localStorage instance if localStorage wasn't initialized yet", () => {
      localStorageInstance._initialized = false;

      let result = localStorageInstance.delete('testName');

      expect(result).toEqual(localStorageInstance);
    });

    it('should return localStorage instance', () => {
      localStorageInstance._initialized = false;

      let result = localStorageInstance.delete('testName');

      expect(result).toEqual(localStorageInstance);
    });

    it('should call localStorage.delete method', () => {
      spyOn(localStorageInstance, 'delete');

      localStorageInstance.delete('testName', 'testValue');

      expect(localStorageInstance.delete).toHaveBeenCalled();
    });
  });

  describe('clear method', () => {
    it("should return localStorage instance if localStorage wasn't initialized yet", () => {
      localStorageInstance._initialized = false;

      let result = localStorageInstance.clear('testName');

      expect(result).toEqual(localStorageInstance);
    });

    it('should return localStorage instance', () => {
      let result = localStorageInstance.clear('testName');

      expect(result).toEqual(localStorageInstance);
    });

    it('should call localStorage.delete method', () => {
      spyOn(localStorageInstance, 'clear');

      localStorageInstance.clear();

      expect(localStorageInstance.clear).toHaveBeenCalled();
    });
  });

  describe('size method', () => {
    it("should return localStorage instance if localStorage wasn't initialized yet", () => {
      localStorageInstance._initialized = false;

      let result = localStorageInstance.size();

      expect(result).toEqual(localStorageInstance);
    });

    it('should return localStorage.length', () => {
      let result = localStorageInstance.size();

      expect(result).toEqual(4);
    });
  });
});
