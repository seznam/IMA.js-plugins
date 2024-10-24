import type { Events } from './Events';

declare module '@ima/core' {
  interface PluginAnalyticSettings {}

  interface PluginSettings {
    analytic: PluginAnalyticSettings;
  }

  interface Settings {
    plugin: PluginSettings;
  }

  interface DispatcherEventsMap {
    [Events.LOADED]: {
      type: string;
    };
  }
}

export {};
