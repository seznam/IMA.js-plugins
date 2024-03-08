/* eslint-disable @typescript-eslint/no-empty-interface */
import { pluginLoader } from '@ima/core';

import {
  GoogleAnalytics4,
  type AnalyticGoogleSettings,
} from './GoogleAnalytics4.js';

declare global {
  interface Window {
    gtag: Gtag.Gtag;
    dataLayer: unknown[];
  }
}

export interface PluginAnalyticGoogleSettings {
  google4: AnalyticGoogleSettings;
}

declare module '@ima/core' {
  interface PluginAnalyticSettings extends PluginAnalyticGoogleSettings {}

  interface PluginSettings {
    analytic: PluginAnalyticSettings;
  }

  interface Settings {
    plugin: PluginSettings;
  }

  interface OCAliasMap {
    '$Settings.plugin.analytic.google4': AnalyticGoogleSettings;
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

export { GoogleAnalytics4 };

export type { AnalyticGoogleSettings };
