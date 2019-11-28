# @ima/plugin-analytic-fb-pixel

This is the Facebook Pixel analytic plugin for the IMA.js application. You can visit our site <https://imajs.io>.

## Installation

```javascript

npm install @ima/plugin-analytic-fb-pixel @ima/plugin-script-loader --save

```

```javascript
// /app/build.js

var vendors = {
	common: [
		'@ima/plugin-analytic-fb-pixel',
		'@ima/plugin-analytic',
		'@ima/plugin-script-loader'
	]
};

/*
Now is FB Pixel analytic plugin available from:

import { FacebookPixelAnalytic, defaultDependencies } from '@ima/plugin-analytic-fb-pixel';
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
			fbPixel: {
				id: 'XXX'
			}
		}
	}
}
```

```javascript
// /app/config/services.js
import { FacebookPixelAnalytic } from '@ima/plugin-analytic-fb-pixel'

var $window = oc.get('$Window');
var $dispatcher = oc.get('$Dispatcher');
var fbPixelAnalytic = oc.get(FacebookPixelAnalytic);


if ($window.isClient()) {

	// initialize analytic
	fbPixelAnalytic.init();

	//set hit page view to analytic
	$dispatcher.listen(ns.ima.router.Events.AFTER_HANDLE_ROUTE, (pageData) => {

		if (pageData &&
				pageData.response &&
				(pageData.response.status >= 200 &&
				pageData.response.status < 300)) {

			fbPixelAnalytic.hitPageView(pageData);
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
	fbPixelAnalytic.init();
	fbPixelAnalytic.load();

	// ...
```

## Dependencies
If you are looking more details, you should
follow this links:
[https://github.com/seznam/IMA.js-plugin-analytic](https://github.com/seznam/IMA.js-plugin-analytic),
[https://github.com/seznam/IMA.js-plugin-script-loader](https://github.com/seznam/IMA.js-plugin-script-loader)
