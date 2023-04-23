# @ima/plugin-websocket

The [IMA](https://imajs.io) plugin allow creating socket server and connected clients can send broadcast message. The plugin is used by default in [@ima/gulp-tasks](https://github.com/seznam/ima/tree/master/packages/gulp-tasks) which creates one socket server.

## Installation

```javascript

npm install @ima/plugin-websocket --save

```

```javascript
// /app/build.js

// For only dev environment
if (
  process.env.NODE_ENV === 'dev' ||
  process.env.NODE_ENV === 'development' ||
  process.env.NODE_ENV === undefined
) {
  vendors.common.push('@ima/plugin-websocket');
}

// or for all environments
// let vendors = {
//     common: [
//         '@ima/plugin-websocket'
//     ]
// };

/*
The websocket plugin is now available.

import { WebSocket } from '@ima/plugin-websocket';
*/
```

## Usage

### Creating client

The below example is for client side usage.

```javascript
// /some/extra/Logic.js
import { WebSocket } from '@ima/plugin-websocket';

class Logic {
  /** @type {import('@ima/core').Dependencies} */
  static get $dependencies() {
    return [WebSocket];
  }

  constructor(webSocket) {
    this._webSocket = webSocket;

    this._listener = (data) => {
      if (data.sentinel === 'some-ID') {
        console.log(data.payload);
      }
    };
  }

  sendMessageToAllClients() {
    this._webSocket.send({
      sentinel: 'some-ID',
      payload: {}
    });
  }

  listenOnMessageFromServer() {
    this._webSocket.subscribe(this._listener);
  }

  unlistenOnMessageFromServer() {
    this._webSocket.unsubscribe(this._listener);
  }
}

```

The below example is for server side usage. The plugin use [ws](https://www.npmjs.com/package/ws) module on the server side so you can use his API.

```javascript
// /server.js

const { createClient } = require('@ima/plugin-websocket/lib');

// default value for url is 'ws://localhost:5888'
const socket = createClient({ url: 'ws://localhost:5888' });


socket.on('open', () => {
  socket.send(JSON.stringify({ sentinel: 'some-ID', payload: {} }));
});

socket.on('message', (data) => {
  console.log(data);
});

```

### Creating own server

The below example is for creating new broadcast socket server. The plugin use [ws](https://www.npmjs.com/package/ws) module on the server side so you can use his API.

```javascript
// /server.js
const { createServer } = require('@ima/plugin-websocket/lib');

// you can use ws module options and API
// default value for port is 5888
const socket = createServer({ port: 5888 });

```

## Configuration

The plugin has got only two options. The url option is for address of socket server and debug option is for turn on debug messages from plugin.

```javascript
// /app/settings.js

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
```

## IMA.js

The [IMA.js](https://imajs.io) is an application development stack for developing
isomorphic applications written in pure JavaScript.
You can find the [IMA.js](https://imajs.io) skeleton application at <https://github.com/seznam/ima>.
