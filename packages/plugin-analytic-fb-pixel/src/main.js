import { pluginLoader } from '@ima/core';
import FacebookPixelAnalytic from './FacebookPixelAnalytic';

const defaultDependencies = FacebookPixelAnalytic.$dependencies;

pluginLoader.register('@ima/plugin-analytic-google', () => ({
  initSettings: () => ({
    prod: {
      plugin: {
        analytic: {
          fbPixel: {
            id: null
          }
        }
      }
    },

    test: {},

    dev: {}
  })
}));

export { FacebookPixelAnalytic, defaultDependencies };
