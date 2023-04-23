import { Events } from './Events';
import ScriptLoaderPlugin from './ScriptLoaderPlugin';

declare module '@ima/core' {
  interface DispatcherEventsMap {
    [Events.LOADED]: {
      url: string;
      error?: Error;
    };
  }
}

const defaultDependencies = ScriptLoaderPlugin.$dependencies;

export { Events, ScriptLoaderPlugin, defaultDependencies };
