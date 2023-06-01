# @ima/cli-plugin-legacy-css

Adds ability to built another CSS bundle with `client` bundle with different `postcss-present-env` configuration. This allows you to build 2 bundles with different amount of CSS polyfillying (which results in larger file size) and serve the best version to targetted browser.

## Installation

```bash
npm install @ima/cli-plugin-legacy-css -D
```

## Usage

```js title=./ima.config.js
const { LegacyCSSPlugin } = require('@ima/cli-plugin-legacy-css');

/**
 * @type import('@ima/cli').ImaConfig
 */
module.exports = {
  plugins: [new LegacyCSSPlugin({
    /**
     * Browserslist configuration string for postcss-preset-env for legacy CSS.
     */
    cssBrowsersTarget: '>0.3%, not dead, not op_mini all',

    /**
     * Equivalent to postcss function but for legacy css,
     * when enabled with enableLegacyCss option. [optional]
     */
    postcss: (config) => config,
  })],
};
```

### Server hook

You need to define your own detector for the server hook. It accepts callback function which should return true for legacy CSS to be served.

```js title=./server/app.js
const { createIMAServer } = require('@ima/server');
const { createLegacyCssHook } = require('@ima/cli-plugin-legacy-css/server');

const imaServer = createIMAServer();
createLegacyCssHook((event) => {
  /**
   * You have access to server event object here, so you can do detection based
   * on multiple things. We recommend using new `Sec-CH-UA` headers. Return true
   * to server legacy CSS, otherwise return false.
   */
  return true;
}, imaServer);
```

### Dev testing
When running the application in development don't forget to run it with `--writeToDisk` and `--legacy` options.
