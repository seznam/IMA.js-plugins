import { Window, Dispatcher } from '@ima/core';
import ScriptLoaderPlugin from '../ScriptLoaderPlugin';
import Events from '../Events';
import { ResourceLoader } from '@ima/plugin-resource-loader';
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
      jest.spyOn(window, 'isClient').mockReturnValue(true);
      jest
        .spyOn(scriptLoaderPlugin, '_createScriptElement')
        .mockReturnValue(element);
    });

    it('should throw an error at server side', () => {
      jest.spyOn(window, 'isClient').mockReturnValue(false);

      expect(() => {
        scriptLoaderPlugin.load(url);
      }).toThrow();
    });

    it('should return value from cache', async () => {
      scriptLoaderPlugin._loadedScripts[url] = Promise.resolve({ url });
      const value = await scriptLoaderPlugin.load(url);

      expect(value.url).toEqual(url);
    });

    it('the dispatcher fire loaded event for scripts loaded by template', async () => {
      jest.spyOn(dispatcher, 'fire').mockImplementation(() => {});
      jest
        .spyOn(resourceLoader, 'promisify')
        .mockReturnValue(Promise.resolve());

      await scriptLoaderPlugin.load(url, template);

      expect(dispatcher.fire).toHaveBeenCalledWith(
        Events.LOADED,
        { url },
        true
      );
    });

    it('the dispatcher fire loaded event for scripts loaded by url', async () => {
      jest.spyOn(dispatcher, 'fire').mockImplementation(() => {});
      jest
        .spyOn(resourceLoader, 'promisify')
        .mockReturnValue(Promise.resolve());

      await scriptLoaderPlugin.load(url);

      expect(dispatcher.fire).toHaveBeenCalledWith(
        Events.LOADED,
        { url },
        true
      );
    });

    it('the dispatcher fire loaded event with errors', async () => {
      jest.spyOn(dispatcher, 'fire').mockImplementation(() => {});
      jest
        .spyOn(resourceLoader, 'promisify')
        .mockReturnValue(Promise.reject(new Error('message')));

      scriptLoaderPlugin.load(url).catch(error => {
        expect(dispatcher.fire).toHaveBeenCalledWith(
          Events.LOADED,
          { url, error },
          true
        );
      });
    });
  });
});
