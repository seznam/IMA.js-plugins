import initBindApp from '../bind';

describe('Bind', () => {
  it('can override router.route method to propagate route navigation to jsdom', () => {
    const baseUrl = 'https://www.example.com';
    const path = '/my/test/path';
    const route = jest.fn();
    const router = {
      route,
      getBaseUrl: jest.fn().mockReturnValue(baseUrl),
      _pageManager: {
        _managedPage: {}
      }
    };
    const oc = {
      get: jest.fn(() => router)
    };
    global.jsdom = {
      reconfigure: jest.fn()
    };

    initBindApp(undefined, oc);

    router.route(path);

    expect(jsdom.reconfigure).toHaveBeenCalledWith({ url: baseUrl + path });
    expect(router.route).not.toEqual(route);
    expect(route).toHaveBeenCalled();

    delete global.jsdom;
  });
});
