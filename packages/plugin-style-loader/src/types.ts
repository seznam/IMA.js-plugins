import type { Events } from './Events';
import type { StyleLoader } from './StyleLoader';

declare module '@ima/core' {
  interface DispatcherEventsMap {
    [Events.LOADED]: {
      url: string;
      error?: Error;
    };
  }

  interface Utils {
    StyleLoader: StyleLoader;
    // @deprecated - backwards compatibility
    ScriptLoaderPlugin: StyleLoader;
  }
}

export {};
