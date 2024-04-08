import { pluginLoader } from '@ima/core';

import {
  GoogleAnalytics4,
  type AnalyticGoogleSettings,
} from './GoogleAnalytics4';

pluginLoader.register('@ima/plugin-analytic-google', () => ({
  initSettings: () => ({
    prod: {
      plugin: {
        analytic: {
          google4: {
            consentSettings: {
              ad_storage: 'denied',
              analytics_storage: 'denied',
              functionality_storage: 'denied',
              personalization_storage: 'denied',
              security_storage: 'denied',
              ad_user_data: 'denied',
            },
            service: 'G-XXXXXXXXXX',
            waitForUpdateTimeout: 5000,
          },
        },
      },
    },
  }),
}));

export type { PluginAnalyticGoogleSettings } from './types';
export { GoogleAnalytics4, type AnalyticGoogleSettings };
