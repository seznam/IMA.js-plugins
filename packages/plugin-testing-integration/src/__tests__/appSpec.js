jest.mock('@ima/core/build');
jest.mock('@ima/core');

import * as ima from '@ima/core';
import * as build from '@ima/core/build';
import * as helpers from '../helpers';
import * as configuration from '../configuration';
import { initImaApp, clearImaApp } from '../app';

describe('Integration', () => {
  it('can init ima app', async () => {
    const router = {
      listen: jest.fn()
    };
    const app = {
      oc: {
        get: jest.fn(key => {
          if (key === '$Router') {
            return router;
          }
        })
      }
    };
    const config = {
      appBuildPath: 'appBuildPath',
      appMainPath: 'appMainPath',
      masterElementId: 'masterElementId',
      protocol: 'http:',
      host: 'www.example.com',
      environment: 'environment',
      prebootScript: jest.fn().mockReturnValue(Promise.resolve())
    };
    let initBindApp = jest.fn();
    let initServicesApp = jest.fn();
    let initRoutes = jest.fn();
    let initSettings = jest.fn();
    let getInitialAppConfigFunctions = jest.fn().mockReturnValue({
      initBindApp,
      initServicesApp,
      initRoutes,
      initSettings
    });
    build.vendors = {
      common: [],
      client: [],
      server: []
    };
    helpers.requireFromProject = jest
      .fn()
      .mockReturnValueOnce({ js: ['js'], vendors: {} })
      .mockReturnValueOnce({ getInitialAppConfigFunctions });
    helpers.loadFiles = jest.fn();
    configuration.getConfig = jest.fn().mockReturnValue(config);
    ima.createImaApp = jest.fn().mockReturnValue(app);
    ima.getClientBootConfig = jest.fn(bootConfig => {
      Object.values(bootConfig).forEach(method => method('ns', 'oc', 'config'));

      return 'bootConfig';
    });
    ima.onLoad = jest.fn().mockReturnValue(Promise.resolve());
    ima.bootClientApp = jest.fn();

    let application = await initImaApp();

    expect(application).toEqual(app);
    expect(helpers.loadFiles).toHaveBeenCalledWith(['js']);
    expect(config.prebootScript).toHaveBeenCalled();
    expect(ima.createImaApp).toHaveBeenCalled();
    expect(ima.getClientBootConfig).toHaveBeenCalledWith({
      initServicesApp: jasmine.any(Function),
      initBindApp: jasmine.any(Function),
      initRoutes: jasmine.any(Function),
      initSettings: jasmine.any(Function)
    });
    expect(initServicesApp).toHaveBeenCalledWith('ns', 'oc', 'config');
    expect(initBindApp).toHaveBeenCalledWith('ns', 'oc', 'config');
    expect(initRoutes).toHaveBeenCalledWith('ns', 'oc', 'config');
    expect(initSettings).toHaveBeenCalledWith('ns', 'oc', 'config');
    expect(ima.onLoad).toHaveBeenCalled();
    expect(ima.bootClientApp).toHaveBeenCalledWith(app, 'bootConfig');
    expect(app.oc.get).toHaveBeenCalledWith('$Router');
    expect(router.listen).toHaveBeenCalled();
  });

  it('can clear ima app', () => {
    let app = { oc: { clear: jest.fn() } };
    ima.vendorLinker.clear = jest.fn();

    clearImaApp(app);

    expect(ima.vendorLinker.clear).toHaveBeenCalled();
    expect(app.oc.clear).toHaveBeenCalled();
  });
});
