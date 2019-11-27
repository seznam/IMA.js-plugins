# babel-plugin-ima-logger

[babel-plugin-ima-logger](https://github.com/seznam/IMA.js-plugins/tree/master/packages/babel-plugin-ima-logger) removes call expressions and function names in import statements of
[@ima/plugin-logger](https://github.com/seznam/IMA.js-plugins/tree/master/packages/plugin-logger) plugin
when used in production or when the plugin's [`remove` option](#remove) is set to `true`.

## Installation

```javascript

npm install babel-plugin-ima-logger --save-dev

```

```javascript
// gulpConfig.js

var gulpConfig = require('../@ima/gulp-tasks/gulpConfig.js');

gulpConfig.babelConfig.esVendor.plugins.push('ima-logger');
gulpConfig.babelConfig.vendor.plugins.push('ima-logger');
gulpConfig.babelConfig.serverApp.plugins.push('ima-logger');
gulpConfig.babelConfig.esApp.plugins.push('ima-logger');
gulpConfig.babelConfig.app.plugins.push('ima-logger');
gulpConfig.babelConfig.server.plugins.push('ima-logger');

```

## What the plugin does

### It removes call expressions

The following call expressions will be removed:
- `debug(...)`
- `info(...)`
- `log(...)`
- `throwIf(...)`
- `warn(...)`

### It replaces call expressions with `0`

The following call expressions will be replaced by `0`:
- `debugIf(...)`
- `errorIf(...)`
- `infoIf(...)`
- `logIf(...)`
- `rejectIf(...)`,
- `warnIf(...)`

### Removes function names from import statements of @ima/plugin-logger

The following function names will be removed from the import statements:
- `debug`
- `debugIf`
- `errorIf`
- `info`
- `infoIf`
- `log`
- `logIf`
- `rejectIf`
- `throwIf`
- `warn`
- `warnIf`

Empty import statements of @ima/plugin-logger will be removed completely.

## Options

### `remove`

`boolean`, defaults to `false`

If it's set to `true`, the plugin removes the call expressions and the function
names from import statements regardless of `process.env.NODE_ENV` value. If
it's set to `false`, `process.env.NOD_ENV` must be `'prod'` or `'production'` so
that the plugin could remove something.
