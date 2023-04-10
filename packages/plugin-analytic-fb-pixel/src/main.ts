import { pluginLoader } from '@ima/core';

import FacebookPixelAnalytic from './FacebookPixelAnalytic';

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
}

const defaultDependencies = FacebookPixelAnalytic.$dependencies;

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

export { FacebookPixelAnalytic, defaultDependencies };
