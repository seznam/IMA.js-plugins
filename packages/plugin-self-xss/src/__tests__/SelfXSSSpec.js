import { Window, Dictionary } from '@ima/core';
import SelfXSS from '../SelfXSS';
import { toMockedInstance } from 'to-mock';

describe('SelfXSS', () => {
  let selfXSS = null;

  const window = toMockedInstance(Window, {
    isClient() {
      return true;
    },
    getWindow() {
      return { console: 'defined' };
    },
  });
  const dictionary = toMockedInstance(Dictionary);

  beforeEach(() => {
    selfXSS = new SelfXSS(window, dictionary);
    global.$Debug = true;
  });

  afterEach(() => {
    delete global.$Debug;
  });

  describe('init method', () => {
    it('should do nothing for server side', () => {
      spyOn(dictionary, 'has');
      spyOn(window, 'isClient').and.returnValue(false);

      selfXSS.init();

      expect(dictionary.has).not.toHaveBeenCalled();
    });

    it('should do nothing for missing console', () => {
      spyOn(dictionary, 'has');
      spyOn(window, 'getWindow').and.returnValue({});

      selfXSS.init();

      expect(dictionary.has).not.toHaveBeenCalled();
    });

    it('should throw error for bad configurated dictionary', () => {
      spyOn(dictionary, 'has').and.returnValue(false);

      expect(() => selfXSS.init()).toThrow();
    });

    it('should log self XSS message to console', () => {
      spyOn(dictionary, 'has').and.returnValue(true);
      spyOn(dictionary, 'get').and.returnValue('string');
      spyOn(console, 'log');

      selfXSS.init();

      expect(console.log).toHaveBeenCalled(); // eslint-disable-line no-console
    });
  });
});
