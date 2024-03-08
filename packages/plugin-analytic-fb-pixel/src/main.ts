import { pluginLoader } from '@ima/core';

import {
  FacebookPixelAnalytic,
  type AnalyticFBPixelSettings,
} from './FacebookPixelAnalytic';

declare global {
  interface Window {
    fbq: facebook.Pixel.Event;
    _fbq: facebook.Pixel.Event;
  }
}

export interface PluginAnalyticFBPixelSettings {
  fbPixel: {
    id: string | null;
  };
}

declare module '@ima/core' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface PluginAnalyticSettings extends PluginAnalyticFBPixelSettings {}

  interface PluginSettings {
    analytic: PluginAnalyticSettings;
  }

  interface Settings {
    plugin: PluginSettings;
  }

  interface OCAliasMap {
    '$Settings.plugin.analytic.fbPixel': AnalyticFBPixelSettings;
  }
}

pluginLoader.register('@ima/plugin-analytic-google', () => ({
  initSettings: () => ({
    prod: {
      plugin: {
        analytic: {
          fbPixel: {
            id: null,
          },
        },
      },
    },
  }),
}));

export { FacebookPixelAnalytic };

export type { AnalyticFBPixelSettings };
