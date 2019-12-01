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

export { initServices, initSettings, $registerImaPlugin, WebSocket };
