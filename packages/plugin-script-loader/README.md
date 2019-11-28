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

import { ScriptLoaderPlugin, events, defaultDependencies } from '@ima/plugin-script-loader';
*/

```

## Usage

```javascript
import Dispatcher from 'ima/event/Dispatcher';
import { ScriptLoaderPlugin, events as ScriptLoaderEvents } from '@ima/plugin-script-loader';

oc
	.get(ScriptLoaderPlugin)
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
