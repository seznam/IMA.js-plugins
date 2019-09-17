# ima-plugin-testing-integration

This is a plugin for integration testing of any IMA.js based application.

## Installation

```javascript

npm install ima-plugin-testing-integration --save-dev

```

## API

Following methods are exposed by this plugin.

### initImaApp
Params:
- `object` bootConfigMethods
  - `Function` initServicesApp
  - `Function` initBindApp
  - `Function` initRoutes
  - `Function` initSettings

Returns:
- `object` IMA.js application instance

Initializes IMA.js application into JSDOM. You can extend default boot config methods.

### clearImaApp
Params:
- `object` app IMA.js application instance

Clears IMA.js application from JSDOM.

### setConfig
Params:
- `object` config

Overrides default configuration. See [config section](#config) for more info.

## Setup

Depending on your application setup, you may need to update some default configuration values. You can do that by running following code before the tests run. Some test runners provide option to run some scripts at the beginning of the test run. For example jest allows you to specify `setupFiles`, you can create this setup file with following content and add it to the list of jest `setupFiles` to update default config options.

```javascript
import { setConfig } from 'ima-plugin-testing-integration';

setConfig({
  host: 'imajs.io'
});
```

## Config

Following configuration options are available.

### appMainPath
`<string>`

`Default: 'app/main.js'`

Path to your main.js file exporting `getInitialAppConfigFunctions` method. You can override this option with path to a testing main.js file containing some boot config overrides if you are not able to use your production configuration.

### appBuildPath
`<string>`

`Default: 'app/build.js'`

Path to your build.js file exporting `js` and `vendors` objects, which are used to load your application javascript components into namespace and vendors.

### masterElementId
`<string>`

`Default: 'page'`

Master element id used by IMA to render a page view.

### protocol
`<string>`

`Default: 'https:'`

Protocol used for the jsdom navigation and IMA application.

### host
`<string>`

`Default: 'imajs.io'`

Host used for the jsdom navigation and IMA application. If you do some service matching in your environment.js, there is a good chance, that you will need to update this to the expected host of your application.

### environment
`<string>`

`Default: 'test'`

IMA.js environment, that should be used.

### prebootScript
`<Function>`

`Default: () => {}`

This script is executed right before the IMA.js boot config is initialized, but jsdom and vendor linker is already loaded. You can make any kind of modifications, that are needed to boot the ima application.

## Usage

This is Jest example of simple integration test, that loads the IMA.js app homepage.

```javascript
import { initImaApp, clearImaApp } from 'ima-plugin-testing-integration';

describe('Integration tests', () => {
	let app;
	let router;

	beforeEach(() => {
		app = initImaApp({
			initRoutes: (ns, oc) => {
        // Expose router so we can use it for navigation
        // You can expose any object from Object Container
				router = oc.get('$Router');
			}
		});
	});

	afterEach(() => {
		clearImaApp(app);
	});

	it('can load homepage', done => {
		router
			.route('/')
			.then(response => {
        expect(response.status).toEqual(200);
        // You can use document, or window to
        // make some validation of dom content
        expect(document.title).toEqual('IMA.js-core');
				done();
			})
			.catch(error => {
				done(error);
			});
	});
});
```
