# @ima/plugin-script-loader

This is the plugin for loading 3rd party scripts for the IMA.js application.
You can visit our site <https://imajs.io>.

## Installation

```javascript

npm install @ima/plugin-script-loader --save

```

```javascript
// /app/build.js

var vendors = {
	common: [
		'@ima/plugin-script-loader'
	]
};

/*
Now is script loader plugin available as:

import { ScriptLoaderPlugin, Events, defaultDependencies } from '@ima/plugin-script-loader';
*/

```

## Usage

### Basic Usage

```javascript
import Dispatcher from 'ima/event/Dispatcher';
import { ScriptLoader, Events as ScriptLoaderEvents, ScriptLoaderOptions } from '@ima/plugin-script-loader';

oc
	.get(ScriptLoader)
	.load('//www.example.com/script.js')
	.then((result) => {
		console.log('Script is loaded.', result.url);
	})
	.catch((error) => {
		console.log('Script failed to load.', error);
	});

oc
	.get(Dispatcher)
	.listen(ScriptLoaderEvents.LOADED, (result) => {
		if (result.error) {
			console.log('Script is not loaded.', result.url);
		} else {
			console.log('Script is loaded.', result.url);
		}
	});

```

### Loading ES Modules

```javascript
import { ScriptLoader } from '@ima/plugin-script-loader';

// Load ES module with type="module"
oc
	.get(ScriptLoader)
	.load('//www.example.com/module.js', null, false, { module: true })
	.then((result) => {
		console.log('ES module is loaded.', result.url);
	});
```

### Advanced Configuration

```javascript
import { ScriptLoader } from '@ima/plugin-script-loader';

// Load script with custom attributes
oc
	.get(ScriptLoader)
	.load('//www.example.com/script.js', null, false, {
		module: true,  // Load as ES module
		async: false,  // Disable async loading
		attributes: {
			'crossorigin': 'anonymous',
			'data-version': '1.0.0'
		}
	});
```

### Configuration Options

The `load` method accepts an optional `options` parameter of type `ScriptLoaderOptions`:

- `module?: boolean` - Set to `true` to load the script as an ES module with `type="module"`
- `async?: boolean` - Set to `false` to disable async loading (default: `true`)
- `attributes?: Record<string, string>` - Custom attributes to set on the script element
