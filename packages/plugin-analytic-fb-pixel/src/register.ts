import { pluginLoader } from '@ima/core';

declare module '@ima/core' {
  interface PluginAnalyticSettings {
    fbPixel: {
      id: string | null;
    };
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
