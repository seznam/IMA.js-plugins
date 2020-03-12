import * as configuration from '../configuration';
import { getBootConfigExtensions } from '../bootConfigExtensions';

describe('BootConfigExtensions', () => {
  describe('getBootConfigExtensions', () => {
    it('it can initialize settings', () => {
      const config = {
        initSettings: jest.fn().mockReturnValue('initSettings')
      };
      configuration.getConfig = jest.fn().mockReturnValue(config);

      let results = getBootConfigExtensions().initSettings(
        'ns',
        'oc',
        'config'
      );

      expect(results).toEqual('initSettings');
      expect(config.initSettings).toHaveBeenCalledWith('ns', 'oc', 'config');
    });

    it('it can initialize bind app', () => {
      const config = {
        initBindApp: jest.fn().mockReturnValue('initBindApp')
      };
      configuration.getConfig = jest.fn().mockReturnValue(config);

      let results = getBootConfigExtensions().initBindApp('ns', 'oc', 'config');

      expect(results).toEqual('initBindApp');
      expect(config.initBindApp).toHaveBeenCalledWith('ns', 'oc', 'config');
    });

    it('it can initialize bind app with TestPageRenderer', () => {
      const TestPageRenderer = {
        initTestRenderer: jest.fn()
      };
      const config = {
        initBindApp: jest.fn().mockReturnValue('initBindApp'),
        TestPageRenderer
      };
      configuration.getConfig = jest.fn().mockReturnValue(config);

      let results = getBootConfigExtensions().initBindApp('ns', 'oc', 'config');

      expect(results).toEqual('initBindApp');
      expect(TestPageRenderer.initTestRenderer).toHaveBeenCalledWith(
        'ns',
        'oc',
        'config'
      );
      expect(config.initBindApp).toHaveBeenCalledWith('ns', 'oc', 'config');
    });

    it('it can initialize services app', () => {
      const config = {
        initServicesApp: jest.fn().mockReturnValue('initServicesApp')
      };
      configuration.getConfig = jest.fn().mockReturnValue(config);

      let results = getBootConfigExtensions().initServicesApp(
        'ns',
        'oc',
        'config'
      );

      expect(results).toEqual('initServicesApp');
      expect(config.initServicesApp).toHaveBeenCalledWith('ns', 'oc', 'config');
    });

    it('it can initialize routes', () => {
      const config = {
        initRoutes: jest.fn().mockReturnValue('initRoutes')
      };
      configuration.getConfig = jest.fn().mockReturnValue(config);

      let results = getBootConfigExtensions().initRoutes('ns', 'oc', 'config');

      expect(results).toEqual('initRoutes');
      expect(config.initRoutes).toHaveBeenCalledWith('ns', 'oc', 'config');
    });

    it('it can get app extension', () => {
      const extension = { a: 'b' };
      const config = {
        extendAppObject: jest.fn().mockReturnValue(extension)
      };
      configuration.getConfig = jest.fn().mockReturnValue(config);

      let results = getBootConfigExtensions().getAppExtension('app');

      expect(results.a).toEqual(extension.a);
      expect(config.extendAppObject).toHaveBeenCalledWith('app');
    });
  });
});
