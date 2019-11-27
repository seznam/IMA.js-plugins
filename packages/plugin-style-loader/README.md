# @ima/plugin-style-loader

This is the plugin for loading 3rd party styles for the IMA.js application.
You can find the IMA.js skeleton application at <https://github.com/seznam/IMA.js-skeleton>
or follow link <https://imajs.io>.

## Installation

```javascript

npm install @ima/plugin-style-loader --save

```

```javascript
// /app/build.js

var vendors = {
	common: [
		'@ima/plugin-style-loader'
	]
};

/*
Now is script loader plugin available as:

import { StyleLoaderPlugin, events, defaultDependencies } from '@ima/plugin-style-loader';
*/

```

## Usage

```javascript
import Dispatcher from 'ima/event/Dispatcher';
import { StyleLoaderPlugin, events as StyleLoaderEvents } from '@ima/plugin-style-loader';

oc
	.get(StyleLoaderPlugin)
	.load('//www.example.com/style.css')
	.then((result) => {
		console.log('Style is loaded.', result.url);
	})
	.catch((error) => {
		console.log('Style failed to load.', error);
	});

oc
	.get(Dispatcher)
	.listen(StyleLoaderEvents.LOADED, (result) => {
		if (result.error) {
			console.log('Style is not loaded.', result.url);
		} else {
			console.log('Style is loaded.', result.url);
		}
	});

```
