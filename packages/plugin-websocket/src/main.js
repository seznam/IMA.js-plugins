import { pluginLoader } from '@ima/core';
import WebSocket from './WebSocket';

const $registerImaPlugin = () => {};

const initSettings = () => {
  return {
    prod: {
      plugin: {
        websocket: {
          url: 'ws://localhost:5888',
          debug: false
        }
      }
    }
  };
};

const initServices = (ns, oc) => {
  oc.get(WebSocket).init();
};

pluginLoader.register('@ima/plugin-websocket', () => {
  $registerImaPlugin();

  return {
    initSettings,
    initServices
  };
});

export { initServices, initSettings, $registerImaPlugin, WebSocket };
