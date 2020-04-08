import { Window, Dispatcher } from '@ima/core';
import AbstractAnalytic from '../AbstractAnalytic';
import AnalyticEvents from '../Events';
import { ScriptLoaderPlugin } from '@ima/plugin-script-loader';
import { toMockedInstance } from 'to-mock';

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
  });

  describe('init() method', () => {
    it('should call abstracted `_createGlobalDefinition` method.', () => {
      spyOn(abstractAnalytic, '_createGlobalDefinition').and.stub();

      abstractAnalytic.init();
      expect(abstractAnalytic._createGlobalDefinition).toHaveBeenCalled();
    });

    it('should fire initialized event.', () => {
      spyOn(abstractAnalytic, '_createGlobalDefinition').and.stub();
      spyOn(dispatcher, 'fire').and.stub();

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
      spyOn(scriptLoader, 'load').and.callThrough();
      spyOn(abstractAnalytic, '_configuration').and.stub();
      spyOn(dispatcher, 'fire').and.stub();
    });

    it('should do nothing on server side.', (done) => {
      spyOn(_windowMock, 'isClient').and.returnValue(false);

      abstractAnalytic
        .load()
        .then(() => {
          expect(scriptLoader.load).not.toHaveBeenCalled();
          done();
        })
        .catch((error) => {
          done(error);
        });
    });

    it('should load analytic script, call configuration method and fire loaded event.', (done) => {
      abstractAnalytic
        .load()
        .then(() => {
          expect(scriptLoader.load).toHaveBeenCalled();
          expect(abstractAnalytic._configuration).toHaveBeenCalled();
          expect(dispatcher.fire).toHaveBeenCalledWith(
            AnalyticEvents.LOADED,
            { type: 'dummy' },
            true
          );
          done();
        })
        .catch((error) => {
          done(error);
        });
    });

    it('should load analytic script, call configuration method and fire loaded event only once.', async () => {
      await abstractAnalytic.load();
      await abstractAnalytic.load();

      expect(scriptLoader.load.calls.count()).toEqual(1);
      expect(abstractAnalytic._configuration.calls.count()).toEqual(1);
      expect(dispatcher.fire).toHaveBeenCalledWith(
        AnalyticEvents.LOADED,
        { type: 'dummy' },
        true
      );
      expect(dispatcher.fire.calls.count()).toEqual(1);
    });
  });
});
