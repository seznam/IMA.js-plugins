# ima-plugin-analytic-google

If you are looking more details, you should
follow this link:
[https://github.com/seznam/IMA.js-plugin-analytic-google](https://github.com/seznam/IMA.js-plugin-analytic-google).

## Installation

```javascript

npm install ima-plugin-analytic-google --save

```

```javascript
// /app/build.js

var vendors = {
	common: [
		'ima-plugin-analytic-google'
	]
};

/*
Now is google analytic plugin available from:

ns.ima.plugin.analytic.google.GoogleAnalytic;
ns.ima.plugin.analytic.google.defaultDependencies;

import { GoogleAnalytic, defaultDependencies } from 'ima-plugin-analytic-google';
*/

```

```javascript
// /app/config/settings.js

prod: {
	$Http: { ... },
	$Cache: { ... },
	$Page:{ ... },
	Plugin : {
		analytic: {
			google: {
				service: 'UA-XXXXXXX-X',
				settings: {}
			}
		}
	}
}
```

```javascript
// /app/config/bind.js

oc.bind('GoogleAnalytic', ns.ima.plugin.analytic.google.GoogleAnalytic, ns.ima.plugin.analytic.google.defaultDependencies);

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
	$dispatcher.listen(ns.Core.Router.Events.AFTER_HANDLE_ROUTE, (pageData) => {

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
