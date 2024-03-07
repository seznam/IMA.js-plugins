import { Window, Dispatcher } from '@ima/core';
import { ScriptLoaderPlugin } from '@ima/plugin-script-loader';
import { toMockedInstance } from 'to-mock';

import { AbstractAnalytic } from '../AbstractAnalytic';
import { Events as AnalyticEvents } from '../Events';

describe('AbstractAnalytic', () => {
  let abstractAnalytic = null;

  const _windowMock = toMockedInstance(Window, {
    isClient() {
      return true;
    },
  });
  const dispatcher = toMockedInstance(Dispatcher);
  const scriptLoader = toMockedInstance(ScriptLoaderPlugin, {
    load() {
      return Promise.resolve(null);
    },
  });

  beforeEach(() => {
    abstractAnalytic = new AbstractAnalytic(
      scriptLoader,
      _windowMock,
      dispatcher
    );

    abstractAnalytic._analyticScriptName = 'dummy';
    abstractAnalytic._analyticScriptUrl = 'http://example.net/script.js';

    global.$Debug = true;
  });

  afterEach(() => {
    delete global.$Debug;
    jest.clearAllMocks();
  });

  describe('init() method', () => {
    it('should not call abstracted `_applyPurposeConsents` method, when no purposeConsents is in initConfig argument', () => {
      jest.spyOn(abstractAnalytic, '_applyPurposeConsents').mockReturnThis();
      jest.spyOn(abstractAnalytic, '_createGlobalDefinition').mockReturnThis();
      const initConfig = {};

      abstractAnalytic.init(initConfig);
      expect(abstractAnalytic._applyPurposeConsents).not.toHaveBeenCalled();
    });
    it('should call abstracted `_applyPurposeConsents` method.', () => {
      jest.spyOn(abstractAnalytic, '_applyPurposeConsents').mockReturnThis();
      jest.spyOn(abstractAnalytic, '_createGlobalDefinition').mockReturnThis();
      const initConfig = { purposeConsents: { 1: true } };

      abstractAnalytic.init(initConfig);
      expect(abstractAnalytic._applyPurposeConsents).toHaveBeenCalledWith(
        initConfig.purposeConsents
      );
    });
    it('should call abstracted `_createGlobalDefinition` method.', () => {
      jest.spyOn(abstractAnalytic, '_createGlobalDefinition').mockReturnThis();

      abstractAnalytic.init();
      expect(abstractAnalytic._createGlobalDefinition).toHaveBeenCalled();
    });

    it('should fire initialized event.', () => {
      jest.spyOn(abstractAnalytic, '_createGlobalDefinition').mockReturnThis();
      jest.spyOn(dispatcher, 'fire');

      abstractAnalytic.init();
      expect(dispatcher.fire).toHaveBeenCalledWith(
        AnalyticEvents.INITIALIZED,
        { type: 'dummy' },
        true
      );
    });
  });

  describe('load() method', () => {
    beforeEach(() => {
      jest.spyOn(_windowMock, 'isClient').mockReturnValue(true);
      jest.spyOn(abstractAnalytic, '_configuration').mockReturnThis();
      jest.spyOn(scriptLoader, 'load').mockResolvedValue(true);
      jest.spyOn(abstractAnalytic, '_configuration');
      jest.spyOn(dispatcher, 'fire');
    });

    it('should do nothing on server side.', async () => {
      jest.spyOn(_windowMock, 'isClient').mockReturnValue(false);

      await abstractAnalytic.load();

      expect(scriptLoader.load).not.toHaveBeenCalled();
    });

    it('should load analytic script, call configuration method and fire loaded event.', async () => {
      await abstractAnalytic.load();

      expect(scriptLoader.load).toHaveBeenCalled();
      expect(abstractAnalytic._configuration).toHaveBeenCalled();
      expect(dispatcher.fire).toHaveBeenCalledWith(
        AnalyticEvents.LOADED,
        { type: 'dummy' },
        true
      );
    });

    it('should load analytic script, call configuration method and fire loaded event only once.', async () => {
      await abstractAnalytic.load();
      await abstractAnalytic.load();

      expect(scriptLoader.load.mock.calls).toHaveLength(1);
      expect(abstractAnalytic._configuration.mock.calls).toHaveLength(1);
      expect(dispatcher.fire).toHaveBeenCalledWith(
        AnalyticEvents.LOADED,
        { type: 'dummy' },
        true
      );
      expect(dispatcher.fire.mock.calls).toHaveLength(1);
    });
  });
});
