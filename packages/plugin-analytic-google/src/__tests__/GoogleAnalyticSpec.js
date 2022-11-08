import { Dispatcher, Window } from '@ima/core';
import { ScriptLoaderPlugin } from '@ima/plugin-script-loader';
import { toMockedInstance } from 'to-mock';

import GoogleAnalytic from '../GoogleAnalytic';

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

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('hitPageView method', () => {
    it('should set custom dimensions into ga', () => {
      jest.spyOn(googleAnalytic, 'isEnabled').mockReturnValue(true);
      jest.spyOn(mockGa, 'ga').mockImplementation(() => {});

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

  describe('_setSetter method', () => {
    it('should do nothing when argument is null', () => {
      jest.spyOn(googleAnalytic, 'isEnabled').mockReturnValue(true);
      jest.spyOn(mockGa, 'ga').mockImplementation(() => {});

      const setterObj = null;

      googleAnalytic._setSetter(setterObj);

      expect(mockGa.ga).not.toHaveBeenCalled();
    });

    it('should do nothing when argument is not an object', () => {
      jest.spyOn(googleAnalytic, 'isEnabled').mockReturnValue(true);
      jest.spyOn(mockGa, 'ga').mockImplementation(() => {});

      const setterObj = () => {};

      googleAnalytic._setSetter(setterObj);

      expect(mockGa.ga).not.toHaveBeenCalled();
    });

    it('should set object properties into ga', () => {
      jest.spyOn(googleAnalytic, 'isEnabled').mockReturnValue(true);
      jest.spyOn(mockGa, 'ga').mockImplementation(() => {});

      const setterObj = {
        prop1: 'value1',
        prop2: 'value2',
      };

      googleAnalytic._setSetter(setterObj);

      expect(mockGa.ga).toHaveBeenCalledWith('set', 'prop1', 'value1');
      expect(mockGa.ga).toHaveBeenCalledWith('set', 'prop2', 'value2');
    });
  });

  describe('_applyPurposeConsents method', () => {
    it('should remove clientId and storage from settings when purpose 1 is set', () => {
      jest.spyOn(googleAnalytic, 'isEnabled').mockReturnValue(true);
      jest.spyOn(mockGa, 'ga').mockImplementation(() => {});

      settings.settings = {
        clientId: 'abcde12345',
        storage: 'none',
      };

      googleAnalytic._applyPurposeConsents({ 1: true });

      expect(settings.settings).toEqual({});
    });

    it('should leave settings as it is when purpose 1 is not set', () => {
      jest.spyOn(googleAnalytic, 'isEnabled').mockReturnValue(true);
      jest.spyOn(mockGa, 'ga').mockImplementation(() => {});

      settings.settings = {
        clientId: 'abcde123445',
        storage: 'none',
      };

      const expectedSettings = Object.assign({}, settings.settings);

      googleAnalytic._applyPurposeConsents({ 1: false });

      expect(settings.settings).toEqual(expectedSettings);
    });
  });
});
