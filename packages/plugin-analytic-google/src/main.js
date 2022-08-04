import { pluginLoader } from '@ima/core';
import uid from 'easy-uid';

import GoogleAnalytic from './GoogleAnalytic.js';

const defaultDependencies = GoogleAnalytic.$dependencies;

const $registerImaPlugin = () => {};

let initSettings = () => {
  return {
    prod: {
      plugin: {
        analytic: {
          google: {
            service: 'UA-XXXXXXX-X',
            settings: {
              clientId: uid(),
              storage: 'none'
            },
            settingsSetter: {
              allowAdFeatures: false,
              anonymizeIp: true,
              allowAdPersonalizationSignals: false
            }
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
  GoogleAnalytic,
  defaultDependencies,
  $registerImaPlugin,
  initSettings
};
