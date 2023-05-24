import { pluginLoader } from '@ima/core';

export { AbstractProcessor } from './AbstractProcessor';
export { HttpClient, OPTION_TRANSFORM_PROCESSORS } from './HttpClient';

export interface PluginHttpClientSettings {
  rest?: {
    baseApiUrl: string | null;
  };
}

declare module '@ima/core' {
  interface PluginSettings {
    httpClient: PluginHttpClientSettings;
  }

  interface Settings {
    plugin: PluginSettings;
  }
}

pluginLoader.register('@ima/plugin-http-client', () => ({
  initSettings: () => ({
    prod: {
      plugin: {
        httpClient: {
          rest: {
            baseApiUrl: null,
          },
        },
      },
    },
  }),
}));
