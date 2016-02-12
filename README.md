# ima.js-module-analytic-google

If you are looking more details, you should
follow this link:
[https://gitlab.kancelar.seznam.cz/IMA.js/module-analytic-google](https://gitlab.kancelar.seznam.cz/IMA.js/module-analytic-google).

## Installation

```javascript

npm install ima.js-module-analytic-google --save

```

```javascript
// /app/vendor.js

var moduleAnalyticGoogle = require('ima.js-module-analytic-google');
.
.
.
vendorApp.set('ModuleAnalyticGoogle', moduleAnalyticGoogle);

/*
Now is ModuleAnalyticGoogle available from:

ns.Module.Analytic.Google

import { Google } from 'module/analytic/google';
import { ModuleAnalyticGoogle } from 'app/vendor';
*/

```

You have also installed modules [ima.js-module-analytic](https://gitlab.kancelar.seznam.cz/IMA.js/module-analytic) and
[ima.js-module-scriptloader](https://gitlab.kancelar.seznam.cz/IMA.js/module-scriptloader](ima.js-module-scriptloader).


```javascript
// /app/config/settings.js

prod: {
	$Http: { ... },
	$Cache: { ... },
	$Page:{ ... },
	Module : {
		Analytic: {
			Google: {
				service: 'UA-XXXXXXX-X',
				settings: {}
			}
		}
	}
}
```

```javascript
// /app/config/bind.js

oc.constant('GOOGLE_ANALYTIC_CONFIG', config.Module.Analytic.Google);

oc.bind('GoogleAnalytic', ns.Module.Analytic.Google, [ns.Module.ScriptLoader.Service, '$Window', '$Dispatcher', ns.Module.Analytic.EVENTS, 'GOOGLE_ANALYTIC_CONFIG']);
```

```javascript
// /app/config/services.js

var $window = oc.get('$Window');
var $dispatcher = oc.get('$Dispatcher');
var googleAnalytic = oc.get('GoogleAnalytic');


if ($window.isClient()) {

	// insert analytic script to page and initialization analytic
	googleAnalytic.init();

	//set hitting page view to analytic
	$dispatcher.listen(ns.Core.Router.EVENTS.AFTER_HANDLE_ROUTE, (pageData) => {

		if (pageData &&
				pageData.response &&
				(pageData.response.status >= 200 &&
				pageData.response.status < 300)) {

			googleAnalytic.hitPageView(pageData);

		} else {

			// hit error to google analytic
			var label = pageData.params.error ? pageData.params.error.toString() : undefined;
			var value = pageData.response.status ? pageData.response.status : undefined;

			googleAnalytic.hit({
				category: 'error',
				action: 'render',
				label,
				value
			});
		}
	});
}
```
