# ima-plugin-analytic-google

This is the google analytic plugin for the IMA.js application. You can find the IMA.js skeleton application at <https://github.com/seznam/IMA.js-skeleton>
or follow link <https://imajs.io>.

## Installation

```javascript

npm install ima-plugin-analytic-google ima-plugin-script-loader --save

```

```javascript
// /app/build.js

var vendors = {
	common: [
		'ima-plugin-analytic-google',
		'ima-plugin-analytic',
		'ima-plugin-script-loader'
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
	plugin : {
		analytic: {
			google: {
				service: 'UA-XXXXXXX-X'
			}
		}
	}
}
```

```javascript
// /app/config/bind.js
import { GoogleAnalytic } from 'ima-plugin-analytic-google';

oc.bind('GoogleAnalytic', GoogleAnalytic);

```

```javascript
// /app/config/services.js

var $window = oc.get('$Window');
var $dispatcher = oc.get('$Dispatcher');
var googleAnalytic = oc.get('GoogleAnalytic');


if ($window.isClient()) {

	// insert analytic script to page and initialization analytic
	googleAnalytic.init();

	//set hit page view to analytic
	$dispatcher.listen(ns.ima.router.Events.AFTER_HANDLE_ROUTE, (pageData) => {

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

## Dependencies
If you are looking more details, you should
follow this links:
[https://github.com/seznam/IMA.js-plugin-analytic](https://github.com/seznam/IMA.js-plugin-analytic),
[https://github.com/seznam/IMA.js-plugin-script-loader](https://github.com/seznam/IMA.js-plugin-script-loader)
