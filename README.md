# ima.js-module-analytic

If you are looking more details, you should
follow this link:
[https://gitlab.kancelar.seznam.cz/IMA.js/module-analytic](https://gitlab.kancelar.seznam.cz/IMA.js/module-analytic).

## Installation

```javascript

npm install ima.js-module-analytic --save

```

```javascript
// /app/vendor.js

var moduleAnalytic = require('ima.js-module-analytic');
.
.
.
vendorApp.set('ModuleAnalytic', moduleAnalytic);

/*
Now is ModuleAnalytic available from:

ns.Module.Analytic.Dot
ns.Module.Analytic.Google
ns.Module.Analytic.Gemius
ns.Module.Analytic.EVENTS
ns.Module.Analytic.Abstract

import { Dot, Google, Gemius, EVENTS, Abstract } from 'module/analytic';
import { ModuleAnalytic } from 'app/vendor';
*/

```


```javascript
// /app/config/settings.js

prod: {
	$Http: { ... },
	$Cache: { ... },
	$Page:{ ... },
	Module : {
		Analytic: {
			Dot: {
				service: 'seznam-service'
			},
			Google: {
				service: 'UA-XXXXXXX-X',
				settings: {}
			},
			Gemius: {
				routes: {
					home:{
						identifier: 'xxx',
						parameters: 'yyy'
					},
					detail: {
						identifier: 'xxx',
						parameters: 'yyy'
					}
				}
			}
		}
	}
}
```

```javascript
// /app/config/bind.js

oc.constant('DOT_ANALYTIC_CONFIG', config.Module.Analytic.Dot);
oc.constant('GOOGLE_ANALYTIC_CONFIG', config.Module.Analytic.Google);
oc.constant('GEMIUS_ANALYTIC_CONFIG', config.Module.Analytic.Gemius);

oc.bind('DotAnalytic', ns.Module.Analytic.Dot, ['$Window', '$Dispatcher', ns.Module.Analytic.EVENTS, 'DOT_ANALYTIC_CONFIG']);
oc.bind('GoogleAnalytic', ns.Module.Analytic.Google, ['$Window', '$Dispatcher', ns.Module.Analytic.EVENTS, 'GOOGLE_ANALYTIC_CONFIG']);
oc.bind('GemiusAnalytic', ns.Module.Analytic.Gemius, ['$Window', '$Dispatcher', ns.Module.Analytic.EVENTS, 'GEMIUS_ANALYTIC_CONFIG']);
```

```javascript
// /app/config/services.js

var $window = oc.get('$Window');
var $dispatcher = oc.get('$Dispatcher');
var dotAnalytic = oc.get('DotAnalytic');
var googleAnalytic = oc.get('GoogleAnalytic');
var gemiusAnalytic = oc.get('GemiusAnalytic');


if ($window.isClient()) {

	// insert analytic scripts to page and initialization analytic
	dotAnalytic.init();
	googleAnalytic.init();
	gemiusAnalytic.init();

	//set hitting page view to analytics
	$dispatcher.listen(ns.Core.Router.EVENTS.AFTER_HANDLE_ROUTE, (pageData) => {

		if (pageData &&
				pageData.response &&
				(pageData.response.status >= 200 &&
				pageData.response.status < 300)) {

			dotAnalytic.hitPageView(pageData);
			googleAnalytic.hitPageView(pageData);
			gemiusAnalytic.hitPageView(pageData);

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
