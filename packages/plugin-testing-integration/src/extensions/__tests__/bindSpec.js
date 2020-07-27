import initBindApp from '../bind';

describe('Bind', () => {
  it('can override router.route method to propagate route navigation to jsdom', () => {
    const baseUrl = 'https://www.example.com';
    const routeSpy = jest.fn();
    class Router {
      getBaseUrl() {
        return baseUrl;
      }

      route(...args) {
        return routeSpy(...args);
      }
    }
    const path = '/my/test/path';
    const $Router = new Router();
    const $PageManager = { _managedPage: {} };
    const objects = { $Router, $PageManager };
    const oc = {
      get: jest.fn(key => objects[key])
    };
    global.jsdom = {
      reconfigure: jest.fn()
    };

    initBindApp(undefined, oc);

    $Router.route(path);

    /* eslint-disable-next-line no-undef */
    expect(jsdom.reconfigure).toHaveBeenCalledWith({ url: baseUrl + path });
    expect(routeSpy).toHaveBeenCalledWith(path);

    delete global.jsdom;
  });
});
