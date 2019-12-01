# @ima/plugin-hotreload

The [IMA](https://imajs.io) plugin automatically hot reload [ima](https://imajs.io) application after changing "*.js" or "*.css" files. The plugin use under hood [@ima/plugin-websocket](https://github.com/seznam/IMA.js-plugins/tree/master/packages/plugin-websocket).

## Installation

```javascript

npm install @ima/plugin-hotreload --save

```

```javascript
// /app/build.js

// For only dev environment
if (
  process.env.NODE_ENV === 'dev' ||
  process.env.NODE_ENV === 'development' ||
  process.env.NODE_ENV === undefined
) {
  vendors.common.push('@ima/plugin-hotreload');
}

```

After installing plugin @ima/plugin-hotreload install [@ima/plugin-websocket](https://github.com/seznam/IMA.js-plugins/tree/master/packages/plugin-websocket).

## IMA.js

The [IMA.js](https://imajs.io) is an application development stack for developing
isomorphic applications written in pure JavaScript.
You can find the [IMA.js](https://imajs.io) skeleton application at <https://github.com/seznam/ima>.
