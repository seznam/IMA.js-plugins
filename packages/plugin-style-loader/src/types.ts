import { Events } from './Events';
import StyleLoader from './StyleLoader';

declare module '@ima/core' {
  interface DispatcherEventsMap {
    [Events.LOADED]: {
      url: string;
      error?: Error;
    };
  }

  interface Utils {
    StyleLoader: StyleLoader;
  }
}

export {};
