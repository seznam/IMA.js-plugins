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
ns.Module.ScriptLoader.DefaultDependencies
ns.Module.ScriptLoader.EVENTS

import { Service, EVENTS, DefaultDependencies } from 'module/scriptloader';
import { ModuleScriptLoader } from 'app/vendor';
*/

```

```javascript
// /app/config/bind.js

oc.inject(ns.Module.ScriptLoader.Service, ns.Module.ScriptLoader.DefaultDependencies);

//or

```

## Usage

```javascript

oc
	.get(ns.Module.ScriptLoader.Service)
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
