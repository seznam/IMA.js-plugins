import { Window, Dispatcher } from '@ima/core';
import { ResourceLoader } from '@ima/plugin-resource-loader';
import { toMockedInstance } from 'to-mock';

import { Events } from '../Events';
import { ScriptLoader } from '../ScriptLoader';

describe('ScriptLoader', () => {
  let scriptLoaderPlugin = null;
  let element = null;

  const url = '//example.com/some.js';
  const template = 'some js code';

  const window = toMockedInstance(Window, {
    isClient() {
      return true;
    },
  });
  const dispatcher = toMockedInstance(Dispatcher);
  const resourceLoader = toMockedInstance(ResourceLoader);

  beforeEach(() => {
    scriptLoaderPlugin = new ScriptLoader(window, dispatcher, resourceLoader);
    element = {
      onload() {},
      onerror() {},
      onabort() {},
      async: undefined,
      type: undefined,
      setAttribute: jest.fn(),
    };

    global.$Debug = true;
  });

  afterEach(() => {
    delete global.$Debug;
  });

  describe('load method', () => {
    beforeEach(() => {
      jest.spyOn(window, 'isClient').mockReturnValue(true);

      // Mock document.createElement instead of _createScriptElement
      // so that our implementation actually runs
      global.document = {
        createElement: jest.fn().mockReturnValue(element),
      };

      // Reset mock properties for each test
      element.async = undefined;
      element.type = undefined;
      element.setAttribute.mockReset();
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

      expect(dispatcher.fire).toHaveBeenCalledWith(Events.LOADED, { url });
    });

    it('the dispatcher fire loaded event for scripts loaded by url', async () => {
      jest.spyOn(dispatcher, 'fire').mockImplementation(() => {});
      jest
        .spyOn(resourceLoader, 'promisify')
        .mockReturnValue(Promise.resolve());

      await scriptLoaderPlugin.load(url);

      expect(dispatcher.fire).toHaveBeenCalledWith(Events.LOADED, { url });
    });

    it('the dispatcher fire loaded event with errors', async () => {
      jest.spyOn(dispatcher, 'fire').mockImplementation(() => {});
      jest
        .spyOn(resourceLoader, 'promisify')
        .mockReturnValue(Promise.reject(new Error('message')));

      await expect(scriptLoaderPlugin.load(url)).rejects.toThrow();

      expect(dispatcher.fire).toHaveBeenCalledWith(
        Events.LOADED,
        expect.objectContaining({
          url,
          error: expect.any(Error),
        })
      );
    });

    it('should load script multiple times with force option', async () => {
      jest.spyOn(dispatcher, 'fire').mockImplementation(() => {});
      jest
        .spyOn(resourceLoader, 'promisify')
        .mockReturnValue(Promise.resolve());

      await scriptLoaderPlugin.load(url);

      expect(dispatcher.fire).toHaveBeenCalledWith(Events.LOADED, { url });

      jest.clearAllMocks();
      await scriptLoaderPlugin.load(url);

      expect(dispatcher.fire).not.toHaveBeenCalled();

      await scriptLoaderPlugin.load(url, null, true);

      expect(dispatcher.fire).toHaveBeenCalledWith(Events.LOADED, { url });
    });

    it('should set type="module" for ESM scripts', async () => {
      jest.spyOn(dispatcher, 'fire').mockImplementation(() => {});
      jest
        .spyOn(resourceLoader, 'promisify')
        .mockReturnValue(Promise.resolve());

      await scriptLoaderPlugin.load(url, null, false, { module: true });

      expect(element.type).toBe('module');
      expect(element.async).toBe(true);
    });

    it('should set custom attributes when provided', async () => {
      jest.spyOn(dispatcher, 'fire').mockImplementation(() => {});
      jest
        .spyOn(resourceLoader, 'promisify')
        .mockReturnValue(Promise.resolve());

      const attributes = {
        'data-test': 'value',
        crossorigin: 'anonymous',
      };

      await scriptLoaderPlugin.load(url, null, false, { attributes });

      expect(element.setAttribute).toHaveBeenCalledWith('data-test', 'value');
      expect(element.setAttribute).toHaveBeenCalledWith(
        'crossorigin',
        'anonymous'
      );
    });

    it('should respect async=false option', async () => {
      jest.spyOn(dispatcher, 'fire').mockImplementation(() => {});
      jest
        .spyOn(resourceLoader, 'promisify')
        .mockReturnValue(Promise.resolve());

      await scriptLoaderPlugin.load(url, null, false, { async: false });

      expect(element.async).toBe(false);
    });

    it('should combine module and custom attributes', async () => {
      jest.spyOn(dispatcher, 'fire').mockImplementation(() => {});
      jest
        .spyOn(resourceLoader, 'promisify')
        .mockReturnValue(Promise.resolve());

      await scriptLoaderPlugin.load(url, null, false, {
        module: true,
        attributes: { defer: 'true' },
      });

      expect(element.type).toBe('module');
      expect(element.setAttribute).toHaveBeenCalledWith('defer', 'true');
    });
  });
});
