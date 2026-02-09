import { getConfig } from './configuration';
import initBindApp from './extensions/bind';

/**
 * Returns boot config extension methods that wrap the configuration defined
 * in plugin configuration with TestPageRenderer support.
 *
 * @returns {{
 *  initSettings: (...args: any[]) => any,
 *  initBindApp: (...args: any[]) => any,
 *  initServicesApp: (...args: any[]) => any,
 *  initRoutes: (...args: any[]) => any,
 *  getAppExtension: (app: import('@ima/core').ImaApp) => Record<string, any>
 * }} Boot config extension object
 */
export function getBootConfigExtensions() {
  const { TestPageRenderer, ...config } = getConfig();
  let results = [];

  return {
    initSettings: (...args) => {
      return config.initSettings(...args);
    },
    initBindApp: (...args) => {
      if (TestPageRenderer) {
        results.push(TestPageRenderer.initTestPageRenderer(...args));
      }

      initBindApp(...args);

      return config.initBindApp(...args);
    },
    initServicesApp: (...args) => {
      return config.initServicesApp(...args);
    },
    initRoutes: (...args) => {
      return config.initRoutes(...args);
    },
    getAppExtension: app => {
      return Object.assign({}, ...results, config.extendAppObject(app));
    },
  };
}
