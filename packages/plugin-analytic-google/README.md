# @ima/plugin-analytic-google

This is the Google analytic plugin for the IMA.js application. You can visit our site <https://imajs.io>.
The plugin currently implements GA4 analytics.

## Installation

```console
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

ns.ima.plugin.analytic.google.GoogleAnalytics4;
ns.ima.plugin.analytic.google.googleAnalytics4DefaultDependencies;

import { GoogleAnalytics4, googleAnalytics4DefaultDependencies } from '@ima/plugin-analytic-google';
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
            google4: { //for GA4
                service: 'G-XXXXXXXXXX'
            }
		}
	}
}
```

```javascript
// /app/config/services.js
import { GoogleAnalytics4 } from '@ima/plugin-analytic-google';
import { RouterEvents } from '@ima/core';

var $window = oc.get('$Window');
var $dispatcher = oc.get('$Dispatcher');
var googleAnalytics4 = oc.get(GoogleAnalytics4);


if ($window.isClient()) {
    
    // get info about purpose consents of your user, see part Handling user's purposeConsents
    const purposeConsents = getPurposeConsents();

	// insert analytic script to page and initialization analytic
	googleAnalytics4.init(purposeConsents);


	// Since version 1.0 you need to additionally call a `load()` method. The later you call this method the better.
	// If you don't have a specific point in your app where you know that the page has finished loading you can call the `load()` method immediatelly after `init()` method
	googleAnalytics4.load();

	//set hit page view to analytic
	$dispatcher.listen(RouterEvents.AFTER_HANDLE_ROUTE, (pageData) => {

		if (pageData &&
				pageData.response &&
				(pageData.response.status >= 200 &&
				pageData.response.status < 300)) {

            googleAnalytics4.hitPageView(pageData);

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

### Handling user's purpose consents in GA 4
By default, this plugin sets Google analytic that user didn't grant any purpose consent.
In Google Analytics 4 this leads to **hidden all analytics data from GA user interface**. Therefore, **handling user's purpose consents in GA 4 is crucial**.
You can set user's purpose consents in init method by passing object with Purpose Consents structure of TCModel, see: https://www.npmjs.com/package/@iabtcf/core#tcmodel.
Now it looks just for purpose 1, therefore the minimal `purposeConsents` object with permission granted is `{ '1': true }`.
GA4 comes with possibility to change purpose consents at any time after initialisation by method `updateConsent`.

## Dependencies
If you are looking more details, you should
follow this links:
[https://github.com/seznam/IMA.js-plugins/tree/master/packages/plugin-analytic](https://github.com/seznam/IMA.js-plugins/tree/master/packages/plugin-analytic),
[https://github.com/seznam/IMA.js-plugins/tree/master/packages/plugin-script-loader](https://github.com/seznam/IMA.js-plugins/tree/master/packages/plugin-script-loader)
