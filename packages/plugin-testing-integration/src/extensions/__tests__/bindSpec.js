import initBindApp from '../bind';

describe('Bind', () => {
  it('can override router.route method to propagate route navigation to jsdom', () => {
    const baseUrl = 'https://www.example.com';
    const path = '/my/test/path';
    const route = jest.fn();
    const $Router = {
      route,
      getBaseUrl: jest.fn().mockReturnValue(baseUrl)
    };
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

    expect(jsdom.reconfigure).toHaveBeenCalledWith({ url: baseUrl + path });
    expect($Router.route).not.toEqual(route);
    expect(route).toHaveBeenCalled();

    delete global.jsdom;
  });
});
