# ima.js-module-scriptloader

If you are looking more details, you should
follow this link:
[https://gitlab.kancelar.seznam.cz/IMA.js/module-scriptloader](https://gitlab.kancelar.seznam.cz/IMA.js/module-scriptloader).

## Installation

```javascript

npm install ima.js-module-scriptloader --save

```

```javascript
// /app/vendor.js

var moduleScriptLoader = require('ima.js-module-scriptloader');
.
.
.
vendorApp.set('ModuleScriptLoader', moduleScriptLoader);

/*
Now is ModuleScriptLoader available from:

ns.Module.ScriptLoader.Service
ns.Module.ScriptLoader.EVENTS

import { Service, EVENTS } from 'module/scriptloader';
import { ModuleScriptLoader } from 'app/vendor';
*/

```

```javascript
// /app/config/bind.js

oc.constant('DOT_ANALYTIC_CONFIG', config.Module.Analytic.Dot);
oc.constant('GOOGLE_ANALYTIC_CONFIG', config.Module.Analytic.Google);
oc.constant('GEMIUS_ANALYTIC_CONFIG', config.Module.Analytic.Gemius);

oc.bind('ScriptLoader', ns.Module.ScriptLoader.Service, ['$Window', '$Dispatcher', ns.Module.ScriptLoader.EVENTS]);

```

## Usage

```javascript
// /app/config/services.js

oc
	.get('ScriptLoader')
	.load('//www.example.com/script.js')
	.then((response) => {
		console.log('Script is loaded.', response.url);
	})
	.catch((response) => {
		console.log('Script is not loaded.', response.url, response.error);
	});

oc
	.get('$Dispatcher')
	.listen(ns.Module.ScriptLoader.EVENTS.LOADED, (response) => {
		if (response.error) {
			console.log('Script is not loaded.', response.url);
		} else {
			console.log('Script is loaded.', response.url);
		}
	});

```
