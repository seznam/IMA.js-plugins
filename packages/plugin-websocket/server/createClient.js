const WebSocket = require('ws');

function createClient(options) {
  const client = new WebSocket(options.url || 'ws://localhost:5888');

  return client;
}

module.exports = createClient;
