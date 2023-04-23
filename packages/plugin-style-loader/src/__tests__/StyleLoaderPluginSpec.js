import { Window, Dispatcher } from '@ima/core';
import { ResourceLoader } from '@ima/plugin-resource-loader';
import { toMockedInstance } from 'to-mock';

import { Events } from '../Events';
import StyleLoaderPlugin from '../StyleLoaderPlugin';

describe('StyleLoaderPlugin', () => {
  let styleLoaderPlugin = null;
  let url = '//example.com/some.css';
  let template = 'some css code';
  let element = null;
  let attributes = null;

  const window = toMockedInstance(Window, {
    isClient() {
      return true;
    },
  });
  const dispatcher = toMockedInstance(Dispatcher);
  const resourceLoader = toMockedInstance(ResourceLoader);

  beforeEach(() => {
    styleLoaderPlugin = new StyleLoaderPlugin(
      window,
      dispatcher,
      resourceLoader
    );
    element = {
      onload() {},
      onerror() {},
      onabort() {},
    };
    attributes = {
      media: 'screen',
      type: 'text/css',
      onunload() {},
    };

    global.$Debug = true;
  });

  afterEach(() => {
    delete global.$Debug;
    jest.clearAllMocks();
  });

  describe('load method', () => {
    beforeEach(() => {
      jest.spyOn(window, 'isClient').mockReturnValue(true);
      jest
        .spyOn(styleLoaderPlugin, '_createStyleElement')
        .mockReturnValue(element);
    });

    it('should throw an error at server side', () => {
      jest.spyOn(window, 'isClient').mockReturnValue(false);

      expect(() => {
        styleLoaderPlugin.load(url);
      }).toThrow();
    });

    it('should return value from cache', async () => {
      styleLoaderPlugin._loadedStyles[url] = Promise.resolve({ url });
      const value = await styleLoaderPlugin.load(url);

      expect(value.url).toEqual(url);
    });

    it('should append custom attributes to link element, if provided', async () => {
      jest.spyOn(dispatcher, 'fire').mockImplementation(() => {});
      jest
        .spyOn(resourceLoader, 'promisify')
        .mockReturnValue(Promise.resolve());
      jest
        .spyOn(styleLoaderPlugin._resourceLoader, 'injectToPage')
        .mockImplementation(() => {});

      await styleLoaderPlugin.load(url, '', attributes);

      expect(dispatcher.fire).toHaveBeenCalledWith(
        Events.LOADED,
        { url },
        true
      );
      expect(
        styleLoaderPlugin._resourceLoader.injectToPage
      ).toHaveBeenCalledWith(Object.assign({}, element, attributes));
    });

    it('should append custom attributes to custom template, if provided', async () => {
      jest.spyOn(dispatcher, 'fire').mockImplementation(() => {});
      jest
        .spyOn(resourceLoader, 'promisify')
        .mockReturnValue(Promise.resolve());
      jest
        .spyOn(styleLoaderPlugin._resourceLoader, 'injectToPage')
        .mockImplementation(() => {});

      await styleLoaderPlugin.load(url, template, attributes);

      expect(dispatcher.fire).toHaveBeenCalledWith(
        Events.LOADED,
        { url },
        true
      );

      expect(
        styleLoaderPlugin._resourceLoader.injectToPage
      ).toHaveBeenCalledWith(
        Object.assign({ innerHTML: template }, element, attributes)
      );
    });

    it('the dispatcher fire loaded event for styles loaded by template', async () => {
      jest.spyOn(dispatcher, 'fire').mockImplementation(() => {});
      jest
        .spyOn(resourceLoader, 'promisify')
        .mockReturnValue(Promise.resolve());

      await styleLoaderPlugin.load(url, template);

      expect(dispatcher.fire).toHaveBeenCalledWith(
        Events.LOADED,
        { url },
        true
      );
    });

    it('the dispatcher fire loaded event for styles loaded by url', async () => {
      jest.spyOn(dispatcher, 'fire').mockImplementation(() => {});
      jest
        .spyOn(resourceLoader, 'promisify')
        .mockReturnValue(Promise.resolve());

      await styleLoaderPlugin.load(url);

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

      await styleLoaderPlugin.load(url).catch(error => {
        expect(dispatcher.fire).toHaveBeenCalledWith(
          Events.LOADED,
          { url, error },
          true
        );
      });
    });
  });
});
