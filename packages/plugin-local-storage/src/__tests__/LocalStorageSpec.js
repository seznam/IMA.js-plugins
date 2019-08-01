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
      let keys = ['a', 'b', 'c', 'd'];
      return keys[index];
    },
    length: 4
  };

  let localStorageHelper = null;

  beforeEach(() => {
    localStorageHelper = new LocalStorage(dummyWindow);
    localStorageHelper.init();
    global.localStorage = localStorageMock;
  });

  describe('set method', () => {
    it('should call localStorage.setItem method', () => {
      spyOn(localStorage, 'setItem');

      localStorageHelper.set('testName', 'testValue');

      expect(localStorage.setItem).toHaveBeenCalled();
    });

    it('should call localStorageHelper.delete method if value is undefined', () => {
      spyOn(localStorageHelper, 'delete');

      localStorageHelper.set('testName', undefined);

      expect(localStorageHelper.delete).toHaveBeenCalled();
    });

    it('should return localStorageHelper instance if localStorageHelper wasnt inited yet', () => {
      localStorageHelper._init = false;

      let result = localStorageHelper.set('testName', 'testValue');

      expect(result).toEqual(localStorageHelper);
    });
  });

  describe('get method', () => {
    it('should return undefined if localStorageHelper wasnt inited yet', () => {
      localStorageHelper._init = false;

      let result = localStorageHelper.get('testName');

      expect(result).toEqual(undefined);
    });

    it('should call localStorage.getItem method', () => {
      spyOn(localStorage, 'getItem');

      localStorageHelper.get('testName');

      expect(localStorage.getItem).toHaveBeenCalled();
    });

    it('should return correct value', () => {
      spyOn(localStorage, 'getItem').and.returnValue({ value: 'testValue' });

      let result = localStorageHelper.get('testName');

      expect(result).toEqual('testValue');
    });

    it('should return undefined and call localStorageHelper.delete method if item is expired', () => {
      spyOn(localStorage, 'getItem').and.returnValue({
        value: 'testValue',
        expires: Date.now()
      });
      spyOn(localStorageHelper, 'delete');

      let result = localStorageHelper.get('testName');

      expect(result).toEqual(undefined);
      expect(localStorageHelper.delete).toHaveBeenCalled();
    });

    it('should return item if item has no value', () => {
      spyOn(localStorage, 'getItem').and.returnValue({ testKey: 'testValue' });

      let result = localStorageHelper.get('testName');

      expect(result).toEqual({ testKey: 'testValue' });
    });

    it('should return undefined if item is not defined', () => {
      spyOn(localStorage, 'getItem').and.returnValue(null);

      let result = localStorageHelper.get('testName');

      expect(result).toEqual(undefined);
    });
  });

  describe('has method', () => {
    it('should return true if localStorageHelper.get method returns valid result', () => {
      spyOn(localStorageHelper, 'get').and.returnValue(42);

      let result = localStorageHelper.has('testName');

      expect(result).toEqual(true);
    });

    it('should return false if localStorageHelper.get method returns unvalid result', () => {
      spyOn(localStorageHelper, 'get').and.returnValue(undefined);

      let result = localStorageHelper.has('testName');

      expect(result).toEqual(false);
    });
  });

  describe('delete method', () => {
    it('should return localStorageHelper instance if localStorageHelper wasnt inited yet', () => {
      localStorageHelper._init = false;

      let result = localStorageHelper.delete('testName');

      expect(result).toEqual(localStorageHelper);
    });

    it('should return localStorageHelper instance', () => {
      let result = localStorageHelper.delete('testName');

      expect(result).toEqual(localStorageHelper);
    });

    it('should call localStorage.removeItem method', () => {
      spyOn(localStorage, 'removeItem');

      localStorageHelper.delete('testName', 'testValue');

      expect(localStorage.removeItem).toHaveBeenCalled();
    });
  });

  describe('clear method', () => {
    it('should return localStorageHelper instance if localStorageHelper wasnt inited yet', () => {
      localStorageHelper._init = false;

      let result = localStorageHelper.clear('testName');

      expect(result).toEqual(localStorageHelper);
    });

    it('should return localStorageHelper instance', () => {
      let result = localStorageHelper.clear('testName');

      expect(result).toEqual(localStorageHelper);
    });

    it('should call localStorage.removeItem method', () => {
      spyOn(localStorage, 'clear');

      localStorageHelper.clear();

      expect(localStorage.clear).toHaveBeenCalled();
    });
  });

  describe('size method', () => {
    it('should return localStorageHelper instance if localStorageHelper wasnt inited yet', () => {
      localStorageHelper._inited = false;

      let result = localStorageHelper.size();

      expect(result).toEqual(localStorageHelper);
    });

    it('should return localStorage.lenght', () => {
      let result = localStorageHelper.size();

      expect(result).toEqual(4);
    });

    it('should call localStorage.keys method', () => {
      spyOn(localStorageHelper, 'keys');

      localStorageHelper.size();

      expect(localStorageHelper.keys).toHaveBeenCalled();
    });
  });
});
