/* eslint-disable @typescript-eslint/no-empty-interface */
import AbstractAnalytic from './AbstractAnalytic';
import { Events } from './Events';

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

  interface DispatcherEventsMap {
    [Events.LOADED]: {
      type: string;
    };
  }
}

export { Events, AbstractAnalytic, defaultDependencies };
