import type { RestResourceSettings } from './rest/AbstractResource';

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
