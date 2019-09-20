jest.mock('ima/build');
jest.mock('ima/main');
jest.mock('ima/vendorLinker');

import * as ima from 'ima/main';
import vendorLinker from 'ima/vendorLinker';
import build from 'ima/build';
import * as helpers from '../helpers';
import * as configuration from '../configuration';
import { initImaApp, clearImaApp } from '../app';

describe('Integration', () => {
  it('can init ima app', async () => {
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
    ima.createImaApp = jest.fn().mockReturnValue('app');
    ima.getClientBootConfig = jest.fn(bootConfig => {
      Object.values(bootConfig).forEach(method => method('ns', 'oc', 'config'));

      return 'bootConfig';
    });
    ima.onLoad = jest.fn().mockReturnValue(Promise.resolve());
    ima.bootClientApp = jest.fn();

    let app = await initImaApp();

    expect(app).toEqual('app');
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
    expect(ima.bootClientApp).toHaveBeenCalledWith('app', 'bootConfig');
  });

  it('can clear ima app', () => {
    let app = { oc: { clear: jest.fn() } };
    vendorLinker.clear = jest.fn();

    clearImaApp(app);

    expect(vendorLinker.clear).toHaveBeenCalled();
    expect(app.oc.clear).toHaveBeenCalled();
  });
});
