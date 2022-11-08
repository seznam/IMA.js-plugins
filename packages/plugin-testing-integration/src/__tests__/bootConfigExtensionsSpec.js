jest.mock('../extensions/bind.js', () => jest.fn());
jest.mock('../configuration.js', () => ({
  getConfig: jest.fn().mockReturnValue({}),
}));

import { getBootConfigExtensions } from '../bootConfigExtensions';
import * as configuration from '../configuration';
import initBindApp from '../extensions/bind';

describe('BootConfigExtensions', () => {
  describe('getBootConfigExtensions', () => {
    it('it can initialize settings', () => {
      const config = {
        initSettings: jest.fn().mockReturnValue('initSettings'),
      };

      jest.spyOn(configuration, 'getConfig').mockReturnValue(config);
      let results = getBootConfigExtensions().initSettings(
        'ns',
        'oc',
        'config'
      );

      expect(results).toBe('initSettings');
      expect(config.initSettings).toHaveBeenCalledWith('ns', 'oc', 'config');
    });

    it('it can initialize bind app', () => {
      const config = {
        initBindApp: jest.fn().mockReturnValue('initBindApp'),
      };

      jest.spyOn(configuration, 'getConfig').mockReturnValue(config);
      let results = getBootConfigExtensions().initBindApp('ns', 'oc', 'config');

      expect(results).toBe('initBindApp');
      expect(initBindApp).toHaveBeenCalledWith('ns', 'oc', 'config');
      expect(config.initBindApp).toHaveBeenCalledWith('ns', 'oc', 'config');
    });

    it('it can initialize bind app with TestPageRenderer', () => {
      const TestPageRenderer = {
        initTestPageRenderer: jest.fn(),
      };
      const config = {
        initBindApp: jest.fn().mockReturnValue('initBindApp'),
        TestPageRenderer,
      };

      jest.spyOn(configuration, 'getConfig').mockReturnValue(config);
      let results = getBootConfigExtensions().initBindApp('ns', 'oc', 'config');

      expect(results).toBe('initBindApp');
      expect(TestPageRenderer.initTestPageRenderer).toHaveBeenCalledWith(
        'ns',
        'oc',
        'config'
      );
      expect(config.initBindApp).toHaveBeenCalledWith('ns', 'oc', 'config');
    });

    it('it can initialize services app', () => {
      const config = {
        initServicesApp: jest.fn().mockReturnValue('initServicesApp'),
      };

      jest.spyOn(configuration, 'getConfig').mockReturnValue(config);
      let results = getBootConfigExtensions().initServicesApp(
        'ns',
        'oc',
        'config'
      );

      expect(results).toBe('initServicesApp');
      expect(config.initServicesApp).toHaveBeenCalledWith('ns', 'oc', 'config');
    });

    it('it can initialize routes', () => {
      const config = {
        initRoutes: jest.fn().mockReturnValue('initRoutes'),
      };

      jest.spyOn(configuration, 'getConfig').mockReturnValue(config);
      let results = getBootConfigExtensions().initRoutes('ns', 'oc', 'config');

      expect(results).toBe('initRoutes');
      expect(config.initRoutes).toHaveBeenCalledWith('ns', 'oc', 'config');
    });

    it('it can get app extension', () => {
      const extension = { a: 'b' };
      const config = {
        extendAppObject: jest.fn().mockReturnValue(extension),
      };

      jest.spyOn(configuration, 'getConfig').mockReturnValue(config);
      let results = getBootConfigExtensions().getAppExtension('app');

      expect(results.a).toEqual(extension.a);
      expect(config.extendAppObject).toHaveBeenCalledWith('app');
    });
  });
});
