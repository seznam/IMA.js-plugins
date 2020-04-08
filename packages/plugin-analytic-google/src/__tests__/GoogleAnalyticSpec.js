import { Dispatcher, Window } from '@ima/core';
import GoogleAnalytic from '../GoogleAnalytic';
import { toMockedInstance } from 'to-mock';
import { ScriptLoaderPlugin } from '@ima/plugin-script-loader';

const settings = {
  service: 'UA-XXXXXXX-X',
  settings: {},
};

const mockGa = {
  ga() {},
};

describe('GoogleAnalytic', () => {
  const scriptLoader = toMockedInstance(ScriptLoaderPlugin);
  const dispatcher = toMockedInstance(Dispatcher);
  const window = toMockedInstance(Window, {
    getWindow() {
      return mockGa;
    },
  });
  let googleAnalytic = null;

  beforeEach(() => {
    googleAnalytic = new GoogleAnalytic(
      scriptLoader,
      window,
      dispatcher,
      settings
    );
  });

  describe('hitPageView method', () => {
    it('should set custom dimensions into ga', () => {
      spyOn(googleAnalytic, 'isEnabled').and.returnValue(true);
      spyOn(mockGa, 'ga');

      const customDimensions = {
        dimension1: 'value1',
        dimension2: 'value2',
      };

      global.document = {};

      googleAnalytic.hitPageView({}, customDimensions);

      expect(mockGa.ga).toHaveBeenCalledWith('set', 'dimension1', 'value1');
      expect(mockGa.ga).toHaveBeenCalledWith('set', 'dimension2', 'value2');
    });
  });
});
