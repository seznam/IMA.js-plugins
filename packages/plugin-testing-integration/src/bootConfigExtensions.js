import { getConfig } from './configuration';

export function getBootConfigExtensions() {
  const { TestPageRenderer, ...config } = getConfig();
  let results = [];

  return {
    initSettings: (...args) => {
      return config.initSettings(...args);
    },
    initBindApp: (...args) => {
      if (TestPageRenderer) {
        results.push(TestPageRenderer.initTestRenderer(...args));
      }

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
