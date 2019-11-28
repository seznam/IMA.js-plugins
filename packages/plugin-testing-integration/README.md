# @ima/plugin-testing-integration

This is a plugin for integration testing of any IMA.js based application.

## Installation

```javascript

npm install @ima/plugin-testing-integration --save-dev

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
- `Promise<object>` IMA.js application instance

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

Before the test run, you need to load `@ima/core/test.js` file from IMA.js-core. You can simply import it at the beginning of the test file.

```javascript
require('@ima/core/test.js');

describe('Integration', () => {
	// your tests ...
});
```

Most test runners have option to load the `@ima/core/test.js` file as part of their setup. For example jest allows you to specify `setupFiles`.

```json
{
	"testEnvironment": "node",
	"setupFiles": ["@ima/core/test.js"]
}
```

Depending on your application setup, you may need to update some default configuration values. You can do that by running following code before the tests run or add it as part of your test runner setup as mentioned above.

```javascript
import { setConfig } from '@ima/plugin-testing-integration';

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

`Default: () => Promise.resolve()`

This script is executed right before the IMA.js boot config is initialized, but jsdom and vendor linker is already loaded. You can make any kind of modifications, that are needed to boot the ima application into the jsdom.

## Usage

This is Jest example of simple integration test, that loads the IMA.js app homepage and mocks all http get requests.

```javascript
import { initImaApp, clearImaApp } from '@ima/plugin-testing-integration';

describe('Integration tests', () => {
	const response = {
		// Response mock
	};
	let app;
	let router;
	let http;

	beforeEach(async () => {
		app = await initImaApp({
			initBindApp: (ns, oc) => {
				http = oc.get('$Http');

				// Mock http.get method so the application
				// wont make any external requests
				// and return mocked response
				http.get = jest.fn().mockReturnValue(
					Promise.resolve(response)
				);
			},
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
				// Check that a http get method has been called
				expect(http.get).toHaveBeenCalled();
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
