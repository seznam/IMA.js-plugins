/* eslint-disable @typescript-eslint/no-empty-interface */
import AbstractAnalytic from './AbstractAnalytic';

const defaultDependencies = AbstractAnalytic.$dependencies;

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

export { Events } from './Events';
export { AbstractAnalytic, defaultDependencies };
