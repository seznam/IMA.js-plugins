const WebSocket = require('ws');

/**
 *
 * @param {object} options
 * @returns {WebSocket}
 */
function createClient(options) {
  const client = new WebSocket(options.url || 'ws://localhost:5888');

  return client;
}

module.exports = createClient;
