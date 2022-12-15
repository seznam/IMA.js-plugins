import { Dictionary } from '@ima/core';
import { toMockedInstance } from 'to-mock';

import { SelfXSS } from '../SelfXSS';

describe('SelfXSS', () => {
  let selfXSS = null;

  const dictionary = toMockedInstance(Dictionary);

  beforeEach(() => {
    selfXSS = new SelfXSS(dictionary);
    global.$Debug = true;
  });

  afterEach(() => {
    delete global.$Debug;
  });

  describe('init method', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should throw error for bad configured dictionary', () => {
      jest.spyOn(dictionary, 'has').mockReturnValue(false);

      expect(() => selfXSS.init()).toThrow();
    });

    it('should log self XSS message to console', () => {
      dictionary.has = jest.fn().mockReturnValue(true);
      dictionary.get = jest.fn().mockReturnValue('string');
      jest.spyOn(console, 'log').mockImplementation(() => {});

      selfXSS.init();

      expect(console.log).toHaveBeenCalled(); // eslint-disable-line no-console
    });
  });
});
