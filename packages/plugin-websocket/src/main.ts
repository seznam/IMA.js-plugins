/* eslint-disable @typescript-eslint/no-empty-interface */
import { pluginLoader } from '@ima/core';

import WebSocket from './WebSocket';

declare module '@ima/core' {
  interface PluginSettings {
    websocket?: {
      url?: string;
      debug?: boolean;
    };
  }

  interface Settings {
    plugin: PluginSettings;
  }
}

pluginLoader.register('@ima/plugin-websocket', () => ({
  initSettings: () => ({
    prod: {
      plugin: {
        websocket: {
          url: 'ws://localhost:5888',
          debug: false,
        },
      },
    },
  }),
  initServices: (ns, oc) => {
    oc.get(WebSocket).init();
  },
}));

export { WebSocket };
