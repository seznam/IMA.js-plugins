import { pluginLoader } from '@ima/core';
// @ts-expect-error missing types
import uid from 'easy-uid';

import GoogleAnalytic from './GoogleAnalytic.js';
import GoogleAnalytics4 from './GoogleAnalytics4.js';

const defaultDependencies = GoogleAnalytic.$dependencies;
const googleAnalytics4DefaultDependencies = GoogleAnalytics4.$dependencies;

declare module '@ima/core' {
  interface PluginAnalyticSettings {
    google?: {
      service: string | null;
      settings?: {
        clientId?: string;
        storage?: 'none';
      };
      settingsSetter?: {
        allowAdFeatures?: boolean;
        anonymizeIp?: boolean;
        allowAdPersonalizationSignals?: boolean;
      };
    };
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

  interface Settings {
    plugin: PluginSettings;
  }

  interface PluginSettings {
    analytic: PluginAnalyticSettings;
  }
}

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

export {
  GoogleAnalytic,
  GoogleAnalytics4,
  defaultDependencies,
  googleAnalytics4DefaultDependencies,
};
