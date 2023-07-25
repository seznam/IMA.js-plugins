/* eslint-disable @typescript-eslint/no-empty-interface */
import { pluginLoader } from '@ima/core';

import GoogleAnalytics4 from './GoogleAnalytics4.js';

const googleAnalytics4DefaultDependencies = GoogleAnalytics4.$dependencies;

export interface PluginAnalyticGoogleSettings {
  google4: {
    consentSettings?: {
      ad_storage?: 'denied' | 'granted';
      analytics_storage?: 'denied' | 'granted';
      personalization_storage?: 'denied' | 'granted';
    };
    service: string;
    waitForUpdateTimeout?: number;
  };
}

declare module '@ima/core' {
  interface PluginAnalyticSettings extends PluginAnalyticGoogleSettings {}

  interface PluginSettings {
    analytic: PluginAnalyticSettings;
  }

  interface Settings {
    plugin: PluginSettings;
  }
}

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

export { GoogleAnalytics4, googleAnalytics4DefaultDependencies };
