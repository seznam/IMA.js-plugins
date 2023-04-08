import { Events } from './Events';
import StyleLoaderPlugin from './StyleLoaderPlugin';

declare module '@ima/core' {
  interface DispatcherEventsMap {
    [Events.LOADED]: {
      url: string;
      error?: Error;
    };
  }
}

const defaultDependencies = StyleLoaderPlugin.$dependencies;

export { StyleLoaderPlugin, Events, defaultDependencies };
