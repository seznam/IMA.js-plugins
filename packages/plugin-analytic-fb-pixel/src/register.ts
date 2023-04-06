/* eslint-disable @typescript-eslint/no-empty-interface */
import { pluginLoader } from '@ima/core';

declare module '@ima/core' {
  interface PluginSettings {}
  interface PluginAnalyticSettings {
    fbPixel: {
      id: string | null;
    };
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
          fbPixel: {
            id: null,
          },
        },
      },
    },
  }),
}));

export {};
