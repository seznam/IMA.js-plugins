import { pluginLoader } from '@ima/core';
import uid from 'easy-uid';

import GoogleAnalytic from './GoogleAnalytic.js';

const defaultDependencies = GoogleAnalytic.$dependencies;

pluginLoader.register('@ima/plugin-analytic-google', () => ({
  initSettings: () => ({
    prod: {
      plugin: {
        analytic: {
          google: {
            service: 'UA-XXXXXXX-X',
            settings: {
              clientId: uid(),
              storage: 'none',
            },
            settingsSetter: {
              allowAdFeatures: false,
              anonymizeIp: true,
              allowAdPersonalizationSignals: false,
            },
          },
        },
      },
    },

    test: {},

    dev: {},
  }),
}));

export { GoogleAnalytic, defaultDependencies };
