import type { Events } from './Events';
import type { ScriptLoader } from './ScriptLoader';

declare module '@ima/core' {
  interface DispatcherEventsMap {
    [Events.LOADED]: {
      url: string;
      error?: Error;
    };
  }

  interface Utils {
    ScriptLoader: ScriptLoader;
    // @deprecated - backwards compatibility
    ScriptLoaderPlugin: ScriptLoader;
  }
}

export {};
