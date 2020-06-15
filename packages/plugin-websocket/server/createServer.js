'use strict';

var WebSocket = require('ws');

const DEFAULT_OPTIONS = {
  port: 5888,
};

function createServer(options = {}) {
  let server = null;
  options = Object.assign({}, DEFAULT_OPTIONS, options);

  try {
    server = new WebSocket.Server(options);

    server.on('connection', function connection(ws) {
      ws.on('message', function incoming(data) {
        server.clients.forEach(function each(client) {
          if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(data);
          }
        });
      });
    });
  } catch (error) {
    console.error(error);
  }

  return server;
}

module.exports = createServer;
