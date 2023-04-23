# @ima/plugin-logger

A logging tool for [IMA.js](https://imajs.io/) framework.

## Installation

```javascript

npm install @ima/plugin-logger --save

```

```javascript
// /app/build.js

var vendors = {
    common: [
		'@ima/plugin-logger'
    ]
};

/*
import {
	...
} from '@ima/plugin-logger';
*/
```

## Functions

- `configureLogger(option)`: It configures the plugin. The parameter `options`
  must be an `object` with some plugin's [options](#options) as properties.
- `beSilent()`: It sets [`silentMode` option](#silentmode) to `true`.
- `isSilent()`: Returns [`silentMode` option](#silentmode)'s value.
- `debug(message)`: Outputs a debug message.
- `error(message)`: Outputs an error message.
- `info(message)`: Outputs an informational message.
- `log(message)`: Outputs a message.
- `warn(message)`: Outputs a warning message.
- `debugIf(message)`: Outputs a debug message if a condition is met.
- `errorIf(message)`: Outputs an error message if a condition is met.
- `infoIf(message)`: Outputs an informational message if a condition is met.
- `logIf(message)`: Outputs a message if a condition is met.
- `warnIf(message)`: Outputs a warning message if a condition is met.
- `throwIf(condition, expression)`: Throws a user-defined exception if a
  condition is met.
- `rejectIf(condition, reason)`: Returns a rejected promise if a condition is
  met.

## Options

### `silentMode`

`boolean`, defaults to `false`

If it's set to `false`, the plugin outputs messages. If it's set to `true`,
the plugin doesn't output anything.
