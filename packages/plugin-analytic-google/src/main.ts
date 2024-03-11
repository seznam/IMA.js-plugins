import { pluginLoader } from '@ima/core';

import GoogleAnalytics4 from './GoogleAnalytics4.js';

const googleAnalytics4DefaultDependencies = GoogleAnalytics4.$dependencies;

pluginLoader.register('@ima/plugin-analytic-google', () => ({
  initSettings: () => ({
    prod: {
      plugin: {
        analytic: {
          google4: {
            consentSettings: {
              ad_storage: 'denied',
              analytics_storage: 'denied',
              personalization_storage: 'denied',
            },
            service: 'G-XXXXXXXXXX',
            waitForUpdateTimeout: 5000,
          },
        },
      },
    },
  }),
}));

export { PluginAnalyticGoogleSettings } from './types';
export { GoogleAnalytics4, googleAnalytics4DefaultDependencies };
