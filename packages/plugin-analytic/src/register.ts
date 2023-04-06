/* eslint-disable @typescript-eslint/no-empty-interface */

declare module '@ima/core' {
  interface PluginAnalyticSettings {}
  interface PluginSettings {}

  interface Settings {
    plugin: PluginSettings;
  }

  interface PluginSettings {
    analytic: PluginAnalyticSettings;
  }
}

export {};
