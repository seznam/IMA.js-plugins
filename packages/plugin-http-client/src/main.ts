import { pluginLoader } from '@ima/core';

export type {
  ProcessorParams,
  Operation,
  Processor,
} from './AbstractProcessor';

export type {
  HttpClientRequestOptions,
  HttpClientRequestMethod,
  HttpClientRequest,
} from './HttpClient';

export { AbstractProcessor } from './AbstractProcessor';
export { HttpClient, OPTION_TRANSFORM_PROCESSORS } from './HttpClient';

import { RestResourceSettings } from './rest/AbstractResource';

export interface PluginHttpClientSettings {
  rest?: RestResourceSettings;
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
