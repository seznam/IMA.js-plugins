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
  - `Function` initSettings
  - `Function` initBindApp
  - `Function` initServicesApp
  - `Function` initRoutes

Returns:
- `Promise<object>` IMA.js application instance

Initializes IMA.js application into JSDOM. You can extend default boot config methods.

### clearImaApp
Params:
- `object` app IMA.js application instance

Clears IMA.js application from JSDOM with all unfinished timer functions.

### setConfig
Params:
- `object` config

Overrides default configuration. See [config section](#config) for more info.

### getConfig
Returns:
- `object` Plugin configuration object

This method can be used to extend `prebootScript`, instead of just overriding it.

## Setup

Before the test run, you need to load `@ima/core/setupFile.js` file from IMA.js-core. You can simply import it 
at the beginning of the test file.

```javascript
require('@ima/core/setupFile.js');

describe('Integration', () => {
	// your tests ...
});
```

Most test runners have option to load the `@ima/core/setupFile.js` file as part of their setup. For example jest allows you to specify `setupFiles`.

```json
{
	"testEnvironment": "node",
	"setupFiles": ["@ima/core/setupFile.js"]
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

### rootDir
`<string>`

`Default: process.cwd()`

Root directory of your IMA.js application.

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

### locale
`<string>`

`Default: 'en'`

What locale to use when generating the localization dictionary.

### TestPageRenderer
`<Class>`

`Default: null`

This allows you to use custom PageRenderer. The TestPageRenderer has to define static method `initTestPageRenderer(ns, oc, config)`, which should provide the PageRenderer into the Object Container (oc).

### initSettings
`<Function>`

`Default: () => {}`

By defining this method, you can extend default bootConfigMethod `initSettings`. This method recieves namespace, Object Container and application config as arguments.

### initBindApp
`<Function>`

`Default: () => {}`

By defining this method, you can extend default bootConfigMethod `initBindApp`. This method recieves namespace, Object Container and application config as arguments.

### initServicesApp
`<Function>`

`Default: () => {}`

By defining this method, you can extend default bootConfigMethod `initServicesApp`. This method recieves namespace, Object Container and application config as arguments.

### initRoutes
`<Function>`

`Default: () => {}`

By defining this method, you can extend default bootConfigMethod `initRoutes`. This method recieves namespace, Object Container and application config as arguments.

### extendAppObject
`<Function>`

`Default: () => {}`

By defining this method, you can extend the app object (return value of initImaApp) with some custom values. This method recieves the app object as an argument and should return an object with new values. These values will be available as part of app object returned from `initImaApp` calls in your tests.

This can be useful to make frequently used functions available directly from the app object.

### prebootScript
`<Function>`

`Default: () => Promise.resolve()`

This script is executed right before the IMA.js boot config is initialized, but jsdom and vendor linker is already loaded. You can make any kind of modifications, that are needed to boot the ima application into the jsdom.

### pageScriptEvalFn
`<Function>`

`Default: script => script && script.text && script.id !== 'ima-runner' && window.eval(script.text)`

Function to run on each HTML script element of generated JSDOM page. By default the runner script is not evaluated.

### processEnvironment
`<Function>`

`Default: env => env`

Function to modify currently resolved environment.

### applicationFolder
`<string>`

`Default:undefined`

Config applicationFolder as root to resolve environment file (used for genereate spa resonse content).


## Usage

This is Jest example of simple integration test, that loads the IMA.js app homepage and mocks all http get requests.

```javascript
import { initImaApp, clearImaApp } from '@ima/plugin-testing-integration';

describe('Integration tests', () => {
	const response = {
		// Response mock
	};
	let app;
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
			}
		});

		// Load some specific application page
		await app.oc.get('$Router').route('/');
	});

	afterEach(() => {
		clearImaApp(app);
	});

	it('can load homepage', () => {
		// Check that a http get method has been called
		expect(http.get).toHaveBeenCalled();
		// You can use document, or window to
		// make some validation of dom content
		expect(document.title).toEqual('IMA.js-core');
	});
});
```

## Usage with Enzyme

You can boost the integration tests by using [Enzyme mount](https://enzymejs.github.io/enzyme/docs/api/mount.html) method to render the IMA.js application.

*Note, that Enzyme PageRenderer extends default IMA PageRenderer. If you choose to override PageRenderer in your tests, it may cause some unexpected behavior.*

## API

EnzymePageRenderer extends the app object returned by initImaApp method with following values.

### wrapper
Returns:
- `enzyme.ReactWrapper|enzyme.ReactWrapper[]` Return value of enzyme.mount()

Function returning Enzyme ReactWrapper, or array of Enzyme ReactWrappers (in case, that there are multiple ReactDOM.render and ReactDOM.hydrate calls inside PageRenderer, but this should not happen in current setup).

### Setup

Use `setConfig` function to setup integration test page renderer:

```javascript
const { setConfig } = require('@ima/plugin-testing-integration');
const EnzymePageRenderer = require('@ima/plugin-testing-integration/EnzymePageRenderer');

setConfig({
    TestPageRenderer: EnzymePageRenderer
});
```

For example with jest test runner you can use [jest setupFiles](https://jestjs.io/docs/configuration#setupfiles-array).


### Usage

```javascript
describe('Home page', () => {
	let app;

	beforeEach(async () => {
		app = await initImaApp();

		// Load some specific application page
		await app.oc.get('$Router').route('/');
	});

	afterEach(() => {
		clearImaApp(app);
	});

	it('can update input value', () => {
		const value = 'Input edited by enzyme';
		// Get the Enzyme ReactWrapper
		const wrapper = app.wrapper();
		// Find some input on the page using Enzyme find method
		const input = wrapper.find('input').at(0);

		// Simulate value change using Enzyme simulate method
		input.simulate('change', { target: { value } });

		// Check, that component props are updated
		expect(input.props.value).toEqual(value);
	});
});
```

## Integration tests described

Integration test needs to run IMA application to test complex logic across app components in real applicattion runtime. For example [Create IMA.js App](https://github.com/seznam/ima/tree/master/packages/create-ima-app)

This plugin contains all necesary functionality to run IMA app:

### [configuration.js](https://github.com/seznam/IMA.js-plugins/blob/master/packages/plugin-testing-integration/src/configuration.js)

Contains basic IMA config, which can be overriden by argument of `setConfig` function mentioned above


### [bootConfigExtensions.js](https://github.com/seznam/IMA.js-plugins/blob/master/packages/plugin-testing-integration/src/bootConfigExtensions.js)

Resolves boot components to extend native [init methods](https://imajs.io/docs/configuration) `initSettings`, `initBindApp`, `initServicesApp`, `initRoutes`, `getAppExtension`. These overrides can be defined in `configuration.js`

## [app.js](https://github.com/seznam/IMA.js-plugins/blob/master/packages/plugin-testing-integration/src/app.js)

There are two main methods described in [api](#api) section

### initImaApp

This main method performs following steps to initializes app to be as close as possibe to real IMA app inside real browser:
  - resolves final [app config](https://imajs.io/docs/configuration)
  - prepare JSDom environment to run IMA app and sets all necessary global variables
  - overrides all native timer functions to save timers into internal storage (so these can be cleared on app exit)
  - runs `prebootScript` from config if defined and awaits its completion
  - creates [IMA app object](https://github.com/seznam/ima/blob/master/packages/core/src/main.js#L119)
  - resolves [IMA app boot config](https://github.com/seznam/ima/blob/master/packages/core/src/main.js#L126)
  - awaits for [load state of client app](https://github.com/seznam/ima/blob/master/packages/core/src/main.js#L230)
  - [boots IMA client app](https://github.com/seznam/ima/blob/master/packages/core/src/main.js#L186)
  - initializes IMA router inside JSDom environment


### clearImaApp

This method sets back all native timer functions, clears all pending timers used in integration test run, also calls `unAop` on all `aop` components and clears [IMA Object container](https://imajs.io/docs/object-container)




