import { Window, Dispatcher } from '@ima/core';
import ScriptLoaderPlugin from '../ScriptLoaderPlugin';
import Events from '../Events';
import { ResourceLoader } from 'ima-plugin-resource-loader';
import { toMockedInstance } from 'to-mock';

describe('ScriptLoaderPlugin', () => {
  let scriptLoaderPlugin = null;
  let element = null;

  const url = '//example.com/some.js';
  const template = 'some js code';

  const window = toMockedInstance(Window, {
    isClient() {
      return true;
    }
  });
  const dispatcher = toMockedInstance(Dispatcher);
  const resourceLoader = toMockedInstance(ResourceLoader);

  beforeEach(() => {
    scriptLoaderPlugin = new ScriptLoaderPlugin(
      window,
      dispatcher,
      resourceLoader
    );
    element = {
      onload() {},
      onerror() {},
      onabort() {}
    };

    global.$Debug = true;
  });

  afterEach(() => {
    delete global.$Debug;
  });

  describe('load method', () => {
    beforeEach(() => {
      spyOn(scriptLoaderPlugin, '_createScriptElement').and.returnValue(
        element
      );
    });

    it('should throw an error at server side', () => {
      spyOn(window, 'isClient').and.returnValue(false);

      expect(() => {
        scriptLoaderPlugin.load(url);
      }).toThrow();
    });

    it('should return value from cache', done => {
      scriptLoaderPlugin._loadedScripts[url] = Promise.resolve({ url });

      scriptLoaderPlugin
        .load(url)
        .then(value => {
          expect(value.url).toEqual(url);
          done();
        })
        .catch(error => {
          done(error);
        });
    });

    it('the dispatcher fire loaded event for scripts loaded by template', done => {
      spyOn(dispatcher, 'fire');
      spyOn(resourceLoader, 'promisify').and.returnValue(Promise.resolve());

      scriptLoaderPlugin
        .load(url, template)
        .then(() => {
          expect(dispatcher.fire).toHaveBeenCalledWith(
            Events.LOADED,
            { url },
            true
          );
          done();
        })
        .catch(done);
    });

    it('the dispatcher fire loaded event for scripts loaded by url', done => {
      spyOn(dispatcher, 'fire');
      spyOn(resourceLoader, 'promisify').and.returnValue(Promise.resolve());

      scriptLoaderPlugin
        .load(url)
        .then(() => {
          expect(dispatcher.fire).toHaveBeenCalledWith(
            Events.LOADED,
            { url },
            true
          );
          done();
        })
        .catch(done);
    });

    it('the dispatcher fire loaded event with errors', done => {
      spyOn(dispatcher, 'fire');
      spyOn(resourceLoader, 'promisify').and.returnValue(
        Promise.reject(new Error('message'))
      );

      scriptLoaderPlugin.load(url).catch(error => {
        expect(dispatcher.fire).toHaveBeenCalledWith(
          Events.LOADED,
          { url, error },
          true
        );
        done();
      });
    });
  });
});
