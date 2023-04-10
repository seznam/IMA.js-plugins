import AbstractAnalytic from './AbstractAnalytic';
import { Events } from './Events';

const defaultDependencies = AbstractAnalytic.$dependencies;

declare module '@ima/core' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
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

export { Events, AbstractAnalytic, defaultDependencies };
