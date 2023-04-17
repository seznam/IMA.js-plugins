jest.mock('@ima/core');
jest.mock('@ima/server', () => ({
  __esModule: true,
  createIMAServer: () => ({
    serverApp: { requestHandler: () => ({ content: '' }) },
  }),
}));
jest.mock('../helpers.js');
jest.mock('../localization.js');
jest.mock('../configuration.js');
jest.mock('../bootConfigExtensions.js');

// @FIXME Update import from @ima/cli once it exports resolveImaConfig function
import * as imaCliUtils from '@ima/cli/dist/webpack/utils';
import * as ima from '@ima/core';

import { initImaApp, clearImaApp } from '../app';
import * as bootConfigExtensions from '../bootConfigExtensions';
import * as configuration from '../configuration';
import * as helpers from '../helpers';
import * as localization from '../localization';

describe('Integration', () => {
  it('can init ima app', async () => {
    const router = {
      listen: jest.fn(),
    };
    const app = {
      oc: {
        get: jest.fn(key => {
          if (key === '$Router') {
            return router;
          }
        }),
      },
    };
    const config = {
      appMainPath: 'appMainPath',
      masterElementId: 'masterElementId',
      protocol: 'http:',
      host: 'www.example.com',
      environment: 'environment',
      locale: 'fr',
      prebootScript: jest.fn().mockReturnValue(Promise.resolve()),
      features: { popupWindow: false },
    };
    let configExtensions = {
      initSettings: jest.fn(),
      initBindApp: jest.fn(),
      initServicesApp: jest.fn(),
      initRoutes: jest.fn(),
      getAppExtension: jest.fn(),
    };
    let initBindApp = jest.fn();
    let initServicesApp = jest.fn();
    let initRoutes = jest.fn();
    let initSettings = jest.fn();
    let getInitialAppConfigFunctions = jest.fn().mockReturnValue({
      initBindApp,
      initServicesApp,
      initRoutes,
      initSettings,
    });
    let languages = {
      en: [],
      fr: [],
    };

    jest
      .spyOn(imaCliUtils, 'resolveImaConfig')
      .mockResolvedValue({ languages });
    jest
      .spyOn(helpers, 'requireFromProject')
      .mockReturnValueOnce({ getInitialAppConfigFunctions });
    jest.spyOn(localization, 'generateDictionary');
    jest.spyOn(configuration, 'getConfig').mockReturnValue(config);
    jest.spyOn(ima, 'createImaApp').mockReturnValue(app);
    jest.spyOn(ima, 'getClientBootConfig').mockImplementation(bootConfig => {
      Object.values(bootConfig).forEach(method => method('ns', 'oc', 'config'));

      return 'bootConfig';
    });
    jest.spyOn(ima, 'onLoad').mockReturnValue(Promise.resolve());
    jest.spyOn(ima, 'bootClientApp');
    jest.spyOn(ima, 'bootClientApp');
    jest
      .spyOn(bootConfigExtensions, 'getBootConfigExtensions')
      .mockReturnValue(configExtensions);

    global.$IMA = {};

    let application = await initImaApp();

    expect(application).toEqual(app);
    expect(localization.generateDictionary).toHaveBeenCalledWith(
      languages,
      'fr'
    );
    expect(config.prebootScript).toHaveBeenCalled();
    expect(ima.createImaApp).toHaveBeenCalled();
    expect(ima.getClientBootConfig).toHaveBeenCalledWith({
      initServicesApp: expect.any(Function),
      initBindApp: expect.any(Function),
      initRoutes: expect.any(Function),
      initSettings: expect.any(Function),
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
