import { getConfig } from './configuration';
import initBindApp from './extensions/bind';

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
    }
  };
}
