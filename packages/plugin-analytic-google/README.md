# @ima/plugin-analytic-google

This is the google analytic plugin for the IMA.js application. You can find the IMA.js skeleton application at <https://github.com/seznam/IMA.js-skeleton>
or follow link <https://imajs.io>.

## Installation

```javascript

npm install @ima/plugin-analytic-google @ima/plugin-script-loader --save

```

```javascript
// /app/build.js

var vendors = {
	common: [
		'@ima/plugin-analytic-google',
		'@ima/plugin-analytic',
		'@ima/plugin-script-loader'
	]
};

/*
Now is google analytic plugin available from:

ns.ima.plugin.analytic.google.GoogleAnalytic;
ns.ima.plugin.analytic.google.defaultDependencies;

import { GoogleAnalytic, defaultDependencies } from '@ima/plugin-analytic-google';
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
// /app/config/services.js
import { GoogleAnalytic } from '@ima/plugin-analytic-google';

var $window = oc.get('$Window');
var $dispatcher = oc.get('$Dispatcher');
var googleAnalytic = oc.get(GoogleAnalytic);


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

## Version 1.0 notice

Since version 1.0 you need to additionally call a `load()` method. The later you call this method the better.
If you don't have a specific point in your app where you know that the page has finished loading you can call the `load()` method immediatelly after `init()` method

```javascript
if ($window.isClient()) {

	// insert analytic script to page and initialization analytic
	googleAnalytic.init();
	googleAnalytic.load();

	// ...
```

## Dependencies
If you are looking more details, you should
follow this links:
[https://github.com/seznam/IMA.js-plugin-analytic](https://github.com/seznam/IMA.js-plugin-analytic),
[https://github.com/seznam/IMA.js-plugin-script-loader](https://github.com/seznam/IMA.js-plugin-script-loader)
