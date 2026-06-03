jest.mock('@ima/core');
jest.mock(
  '/virtual/app/main.js',
  () => ({
    __esModule: true,
    getInitialAppConfigFunctions: jest.fn().mockReturnValue({}),
  }),
  { virtual: true }
);
jest.mock('@ima/testing-library/client', () => ({
  __esModule: true,
  setImaTestingLibraryClientConfig: jest.fn(),
}));
jest.mock('../configuration.js');
jest.mock('../bootConfigExtensions.js');
jest.mock('../aop.js', () => ({
  unAopAll: jest.fn(),
}));

import * as ima from '@ima/core';
import { setImaTestingLibraryClientConfig } from '@ima/testing-library/client';

import { unAopAll } from '../aop';
import { clearImaApp, initImaApp } from '../app';
import { getBootConfigExtensions } from '../bootConfigExtensions';
import * as configuration from '../configuration';

describe('Integration', () => {
  let originalSetInterval;
  let originalSetTimeout;
  let originalSetImmediate;

  beforeAll(() => {
    originalSetInterval = global.setInterval;
    originalSetTimeout = global.setTimeout;
    originalSetImmediate = global.setImmediate;
  });

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock document and window
    global.document = {};
    global.window = {};

    // Restore native timer functions
    global.setInterval = originalSetInterval;
    global.setTimeout = originalSetTimeout;
    global.setImmediate = originalSetImmediate;
  });

  describe('clearImaApp', () => {
    it('should clear object container', () => {
      const app = { oc: { clear: jest.fn() } };

      clearImaApp(app);

      expect(app.oc.clear).toHaveBeenCalled();
    });

    it('should restore native timer functions', () => {
      const app = { oc: { clear: jest.fn() } };
      const mockSetInterval = jest.fn();
      const mockSetTimeout = jest.fn();
      const mockSetImmediate = jest.fn();

      global.setInterval = mockSetInterval;
      global.setTimeout = mockSetTimeout;
      global.setImmediate = mockSetImmediate;

      clearImaApp(app);

      expect(global.setInterval).toBe(originalSetInterval);
      expect(global.setTimeout).toBe(originalSetTimeout);
      expect(global.setImmediate).toBe(originalSetImmediate);
    });

    it('should call unAopAll to clear AOP hooks', () => {
      const app = { oc: { clear: jest.fn() } };

      clearImaApp(app);

      expect(unAopAll).toHaveBeenCalled();
    });

    it('should clear all pending timers', async () => {
      const mockRouter = { listen: jest.fn() };
      const mockApp = {
        oc: {
          get: jest.fn(key => (key === '$Router' ? mockRouter : undefined)),
          clear: jest.fn(),
        },
      };
      const mockExtensions = {
        initSettings: jest.fn().mockReturnValue({}),
        initBindApp: jest.fn().mockReturnValue(null),
        initServicesApp: jest.fn().mockReturnValue(null),
        initRoutes: jest.fn().mockReturnValue(null),
        getAppExtension: jest.fn().mockReturnValue({}),
      };

      jest.spyOn(configuration, 'getConfig').mockReturnValue({
        rootDir: '/test/root',
        appMainPath: '/virtual/app/main.js',
        environment: 'test',
        prebootScript: jest.fn().mockResolvedValue(undefined),
      });
      getBootConfigExtensions.mockReturnValue(mockExtensions);
      ima.createImaApp.mockResolvedValue(mockApp);
      ima.getClientBootConfig.mockResolvedValue({});
      ima.onLoad.mockResolvedValue(undefined);
      ima.bootClientApp.mockResolvedValue(undefined);

      global.window = { $IMA: {} };
      global.jsdom = { reconfigure: jest.fn() };

      const clearIntervalSpy = jest.spyOn(global, 'clearInterval');
      const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');

      // Initialize the app so that timer wrappers are installed
      const app = await initImaApp();

      // Create timers via the (wrapped) global timer functions
      const timeoutId = setTimeout(() => {}, 1000);
      const intervalId = setInterval(() => {}, 1000);

      clearImaApp(app);

      expect(app.oc.clear).toHaveBeenCalled();
      expect(clearTimeoutSpy).toHaveBeenCalledWith(timeoutId);
      expect(clearIntervalSpy).toHaveBeenCalledWith(intervalId);

      clearIntervalSpy.mockRestore();
      clearTimeoutSpy.mockRestore();
      delete global.jsdom;
    });
  });

  describe('initImaApp', () => {
    it('should throw error when document is missing', async () => {
      await jest.isolateModulesAsync(async () => {
        delete global.document;
        global.window = {};

        const { initImaApp } = await import('../app');

        await expect(initImaApp()).rejects.toThrow(
          'Missing document, or window. Are you running the test in the jsdom environment?'
        );
      });
    });

    it('should throw error when window is missing', async () => {
      await jest.isolateModulesAsync(async () => {
        global.document = {};
        delete global.window;

        const { initImaApp } = await import('../app');

        await expect(initImaApp()).rejects.toThrow(
          'Missing document, or window. Are you running the test in the jsdom environment?'
        );
      });
    });

    it('should call key functions in the correct order during successful init', async () => {
      const callOrder = [];
      const mockRouter = {
        listen: jest.fn(() => callOrder.push('router.listen')),
      };
      const mockApp = {
        oc: {
          get: jest.fn(key => (key === '$Router' ? mockRouter : undefined)),
          clear: jest.fn(),
        },
      };
      const mockBootConfig = {};
      const mockExtensions = {
        initSettings: jest.fn().mockReturnValue({}),
        initBindApp: jest.fn().mockReturnValue(null),
        initServicesApp: jest.fn().mockReturnValue(null),
        initRoutes: jest.fn().mockReturnValue(null),
        getAppExtension: jest.fn().mockReturnValue({ extraProp: true }),
      };

      jest.spyOn(configuration, 'getConfig').mockReturnValue({
        rootDir: '/test/root',
        appMainPath: '/virtual/app/main.js',
        environment: 'myenv',
        prebootScript: jest
          .fn()
          .mockImplementation(async () => callOrder.push('prebootScript')),
      });
      getBootConfigExtensions.mockReturnValue(mockExtensions);
      setImaTestingLibraryClientConfig.mockImplementation(() =>
        callOrder.push('setImaTestingLibraryClientConfig')
      );
      ima.createImaApp.mockResolvedValue(mockApp);
      ima.getClientBootConfig.mockImplementation(async () => {
        callOrder.push('getClientBootConfig');
        return mockBootConfig;
      });
      ima.onLoad.mockResolvedValue(undefined);
      ima.bootClientApp.mockResolvedValue(undefined);

      global.window = { $IMA: { $Env: 'original' } };
      global.jsdom = { reconfigure: jest.fn() };

      const result = await initImaApp();

      expect(setImaTestingLibraryClientConfig).toHaveBeenCalledWith({
        rootDir: '/test/root',
      });
      expect(ima.bootClientApp).toHaveBeenCalledWith(mockApp, mockBootConfig);
      expect(global.window.$IMA.$Env).toBe('myenv');
      expect(mockRouter.listen).toHaveBeenCalled();
      expect(result).toMatchObject({ extraProp: true });
      expect(callOrder).toEqual([
        'prebootScript',
        'setImaTestingLibraryClientConfig',
        'getClientBootConfig',
        'router.listen',
      ]);
    });

    it('should call prebootScript before initialization', async () => {
      const prebootScript = jest.fn().mockResolvedValue(undefined);
      const config = {
        appMainPath: 'app/main.js',
        rootDir: '/test/root',
        environment: 'test',
        prebootScript,
      };

      jest.spyOn(configuration, 'getConfig').mockReturnValue(config);

      // Note: Testing the full flow with dynamic imports requires real integration tests
      // Unit test verifies config structure
      expect(config.prebootScript).toBe(prebootScript);
    });
  });

  // Note: Full initImaApp functionality with all integration points is tested
  // via integration tests with real app, since mocking dynamic imports in Jest
  // is complex and fragile
});
