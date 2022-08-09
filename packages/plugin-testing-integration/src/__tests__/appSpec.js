jest.mock('@ima/core');

// @FIXME Update import from @ima/cli once it exports resolveImaConfig function
import * as imaCliUtils from '@ima/cli/dist/webpack/utils';
import * as ima from '@ima/core';
import * as helpers from '../helpers';
import * as localization from '../localization';
import * as configuration from '../configuration';
import * as bootConfigExtensions from '../bootConfigExtensions';
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
      appMainPath: 'appMainPath',
      masterElementId: 'masterElementId',
      protocol: 'http:',
      host: 'www.example.com',
      environment: 'environment',
      locale: 'fr',
      prebootScript: jest.fn().mockReturnValue(Promise.resolve())
    };
    let configExtensions = {
      initSettings: jest.fn(),
      initBindApp: jest.fn(),
      initServicesApp: jest.fn(),
      initRoutes: jest.fn(),
      getAppExtension: jest.fn()
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
    let languages = {
      en: [],
      fr: []
    };
    imaCliUtils.resolveImaConfig = jest.fn().mockResolvedValue({ languages });
    helpers.requireFromProject = jest
      .fn()
      .mockReturnValueOnce({ getInitialAppConfigFunctions });
    localization.generateDictionary = jest.fn();
    configuration.getConfig = jest.fn().mockReturnValue(config);
    ima.createImaApp = jest.fn().mockReturnValue(app);
    ima.getClientBootConfig = jest.fn(bootConfig => {
      Object.values(bootConfig).forEach(method => method('ns', 'oc', 'config'));

      return 'bootConfig';
    });
    ima.onLoad = jest.fn().mockReturnValue(Promise.resolve());
    ima.bootClientApp = jest.fn();
    bootConfigExtensions.getBootConfigExtensions = jest
      .fn()
      .mockReturnValue(configExtensions);

    let application = await initImaApp();

    expect(application).toEqual(app);
    expect(localization.generateDictionary).toHaveBeenCalledWith(
      languages,
      'fr'
    );
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
    expect(configExtensions.initServicesApp).toHaveBeenCalledWith(
      'ns',
      'oc',
      'config'
    );
    expect(configExtensions.initBindApp).toHaveBeenCalledWith(
      'ns',
      'oc',
      'config'
    );
    expect(configExtensions.initRoutes).toHaveBeenCalledWith(
      'ns',
      'oc',
      'config'
    );
    expect(configExtensions.initSettings).toHaveBeenCalledWith(
      'ns',
      'oc',
      'config'
    );
    expect(configExtensions.getAppExtension).toHaveBeenCalledWith(app);
    expect(ima.onLoad).toHaveBeenCalled();
    expect(ima.bootClientApp).toHaveBeenCalledWith(app, 'bootConfig');
    expect(app.oc.get).toHaveBeenCalledWith('$Router');
    expect(router.listen).toHaveBeenCalled();
  });

  it('can clear ima app', () => {
    let app = { oc: { clear: jest.fn() } };

    clearImaApp(app);

    expect(app.oc.clear).toHaveBeenCalled();
  });
});
