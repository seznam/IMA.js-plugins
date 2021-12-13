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

export {
  GoogleAnalytic,
  defaultDependencies,
  $registerImaPlugin,
  initSettings
};
