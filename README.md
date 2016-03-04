# ima-plugin-script-loader

If you are looking more details, you should
follow this link:
[https://github.com/seznam/IMA.js-plugin-script-loader](https://github.com/seznam/IMA.js-plugin-script-loader).

## Installation

```javascript

npm install ima-plugin-script-loader --save

```

```javascript
// /app/build.js

var vendors = {
	common: [
		'ima-plugin-script-loader'
	]
};

/*
Now is script loader plugin available from:

ns.ima.plugin.script.loader.ScriptLoaderPlugin
ns.ima.plugin.script.loader.Events
ns.ima.plugin.script.loader.defaultDependencies

import { ScriptLoaderPlugin, Events, defaultDependencies } from 'ima-plugin-script-loader';
*/

```

```javascript
// /app/config/bind.js

oc.inject(ns.ima.plugin.script.loader.ScriptLoaderPlugin, ns.ima.plugin.script.loader.defaultDependencies);

```

## Usage

```javascript

oc
	.get(ns.ima.plugin.script.loader.ScriptLoaderPlugin)
	.load('//www.example.com/script.js')
	.then((response) => {
		console.log('Script is loaded.', response.url);
	})
	.catch((response) => {
		console.log('Script is not loaded.', response.url, response.error);
	});

oc
	.get('$Dispatcher')
	.listen(ns.ima.plugin.script.loader.Events.LOADED, (response) => {
		if (response.error) {
			console.log('Script is not loaded.', response.url);
		} else {
			console.log('Script is loaded.', response.url);
		}
	});

```
