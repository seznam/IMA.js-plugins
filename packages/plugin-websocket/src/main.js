import { pluginLoader } from '@ima/core';
import WebSocket from './WebSocket';

pluginLoader.register('@ima/plugin-websocket', () => ({
  initSettings: () => ({
    prod: {
      plugin: {
        websocket: {
          url: 'ws://localhost:5888',
          debug: false
        }
      }
    }
  }),
  initServices: (ns, oc) => {
    oc.get(WebSocket).init();
  }
}));

export { WebSocket };
