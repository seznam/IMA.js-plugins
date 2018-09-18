import Events from '../Events';
import StyleLoaderPlugin from '../StyleLoaderPlugin';
import Window from 'ima/window/Window';
import Dispatcher from 'ima/event/Dispatcher';
import { ResourceLoader } from 'ima-plugin-resource-loader';
import { toMockedInstance } from 'to-mock';

describe('StyleLoaderPlugin', () => {
  let styleLoaderPlugin = null;
  let url = '//example.com/some.css';
  let template = 'some css code';
  let element = null;
  let attributes = null;

  const window = toMockedInstance(Window, {
    isClient() {
      return true;
    }
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
      onabort() {}
    };
    attributes = {
      media: 'screen',
      type: 'text/css',
      onunload() {}
    };

    global.$Debug = true;
  });

  afterEach(() => {
    delete global.$Debug;
  });

  describe('load method', () => {
    beforeEach(() => {
      spyOn(styleLoaderPlugin, '_createStyleElement').and.returnValue(element);
    });

    it('should throw an error at server side', () => {
      spyOn(window, 'isClient').and.returnValue(false);

      expect(() => {
        styleLoaderPlugin.load(url);
      }).toThrow();
    });

    it('should return value from cache', done => {
      styleLoaderPlugin._loadedStyles[url] = Promise.resolve({ url });

      styleLoaderPlugin
        .load(url)
        .then(value => {
          expect(value.url).toEqual(url);
          done();
        })
        .catch(error => {
          done(error);
        });
    });

    it('should append custom attributes to link element, if provided', done => {
      spyOn(dispatcher, 'fire');
      spyOn(resourceLoader, 'promisify').and.returnValue(Promise.resolve());
      spyOn(styleLoaderPlugin._resourceLoader, 'injectToPage');

      styleLoaderPlugin
        .load(url, '', attributes)
        .then(() => {
          expect(dispatcher.fire).toHaveBeenCalledWith(
            Events.LOADED,
            { url },
            true
          );

          expect(
            styleLoaderPlugin._resourceLoader.injectToPage
          ).toHaveBeenCalledWith(Object.assign({}, element, attributes));

          done();
        })
        .catch(done);
    });

    it('should append custom attributes to custom template, if provided', done => {
      spyOn(dispatcher, 'fire');
      spyOn(resourceLoader, 'promisify').and.returnValue(Promise.resolve());
      spyOn(styleLoaderPlugin._resourceLoader, 'injectToPage');

      styleLoaderPlugin
        .load(url, template, attributes)
        .then(() => {
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

          done();
        })
        .catch(done);
    });

    it('the dispatcher fire loaded event for styles loaded by template', done => {
      spyOn(dispatcher, 'fire');
      spyOn(resourceLoader, 'promisify').and.returnValue(Promise.resolve());

      styleLoaderPlugin
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

    it('the dispatcher fire loaded event for styles loaded by url', done => {
      spyOn(dispatcher, 'fire');
      spyOn(resourceLoader, 'promisify').and.returnValue(Promise.resolve());

      styleLoaderPlugin
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

      styleLoaderPlugin.load(url).catch(error => {
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
