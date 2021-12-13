import { Dispatcher, Window } from '@ima/core';
import GoogleAnalytic from '../GoogleAnalytic';
import { toMockedInstance } from 'to-mock';
import { ScriptLoaderPlugin } from '@ima/plugin-script-loader';

const settings = {
  service: 'UA-XXXXXXX-X',
  settings: {}
};

const mockGa = {
  ga() {}
};

describe('GoogleAnalytic', () => {
  const scriptLoader = toMockedInstance(ScriptLoaderPlugin);
  const dispatcher = toMockedInstance(Dispatcher);
  const window = toMockedInstance(Window, {
    getWindow() {
      return mockGa;
    }
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
        dimension2: 'value2'
      };

      global.document = {};

      googleAnalytic.hitPageView({}, customDimensions);

      expect(mockGa.ga).toHaveBeenCalledWith('set', 'dimension1', 'value1');
      expect(mockGa.ga).toHaveBeenCalledWith('set', 'dimension2', 'value2');
    });
  });

  describe('_setSetter method', () => {
    it('should do nothing when argument is null', () => {
      spyOn(googleAnalytic, 'isEnabled').and.returnValue(true);
      spyOn(mockGa, 'ga');

      const setterObj = null;

      googleAnalytic._setSetter(setterObj);

      expect(mockGa.ga).not.toHaveBeenCalled();
    });

    it('should do nothing when argument is not an object', () => {
      spyOn(googleAnalytic, 'isEnabled').and.returnValue(true);
      spyOn(mockGa, 'ga');

      const setterObj = () => {};

      googleAnalytic._setSetter(setterObj);

      expect(mockGa.ga).not.toHaveBeenCalled();
    });

    it('should set object properties into ga', () => {
      spyOn(googleAnalytic, 'isEnabled').and.returnValue(true);
      spyOn(mockGa, 'ga');

      const setterObj = {
        prop1: 'value1',
        prop2: 'value2'
      };

      googleAnalytic._setSetter(setterObj);

      expect(mockGa.ga).toHaveBeenCalledWith('set', 'prop1', 'value1');
      expect(mockGa.ga).toHaveBeenCalledWith('set', 'prop2', 'value2');
    });
  });

  describe('_applyPurposeConsents method', () => {
    it('should remove clientId and storage from settings when purpose 1 is set', () => {
      spyOn(googleAnalytic, 'isEnabled').and.returnValue(true);
      spyOn(mockGa, 'ga');

      settings.settings = {
        clientId: 'abcde12345',
        storage: 'none'
      };

      googleAnalytic._applyPurposeConsents({ 1: true });

      expect(settings.settings).toEqual({});
    });

    it('should leave settings as it is when purpose 1 is not set', () => {
      spyOn(googleAnalytic, 'isEnabled').and.returnValue(true);
      spyOn(mockGa, 'ga');

      settings.settings = {
        clientId: 'abcde123445',
        storage: 'none'
      };

      const expectedSettings = Object.assign({}, settings.settings);

      googleAnalytic._applyPurposeConsents({ 1: false });

      expect(settings.settings).toEqual(expectedSettings);
    });
  });
});
