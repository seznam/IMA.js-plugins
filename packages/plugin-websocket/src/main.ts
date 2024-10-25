import { pluginLoader } from '@ima/core';

import WebSocket from './WebSocket';

export interface PluginWebsocketSettings {
  websocket?: {
    url?: string;
    debug?: boolean;
  };
}

declare module '@ima/core' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface PluginSettings extends PluginWebsocketSettings {}
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
