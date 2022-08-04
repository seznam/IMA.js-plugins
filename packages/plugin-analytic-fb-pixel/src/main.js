import { pluginLoader } from '@ima/core';
import FacebookPixelAnalytic from './FacebookPixelAnalytic';

const defaultDependencies = FacebookPixelAnalytic.$dependencies;

const $registerImaPlugin = () => {};

const initSettings = () => {
  return {
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
  };
};

pluginLoader.register('@ima/plugin-analytic-google', () => {
  $registerImaPlugin();

  return { initSettings };
});

export {
  FacebookPixelAnalytic,
  defaultDependencies,
  $registerImaPlugin,
  initSettings
};
