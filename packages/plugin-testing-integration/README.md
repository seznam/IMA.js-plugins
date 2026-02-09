# @ima/plugin-testing-integration

This is a plugin for integration testing of any IMA.js based application.

**Note:** This plugin now relies on [@ima/testing-library](https://github.com/seznam/ima/tree/master/packages/testing-library) for JSDOM initialization and test infrastructure. Make sure to use `@ima/testing-library` jest preset in your tests.

## Installation

```bash
npm install @ima/plugin-testing-integration @ima/testing-library @testing-library/react --save-dev
```

## Setup

### Jest Configuration

First, configure your jest to use `@ima/testing-library` preset which handles JSDOM initialization:

```javascript
// jest.config.js
module.exports = {
  preset: '@ima/testing-library/jest-preset',
  // ... your other jest config
};
```

### Environment Configuration

To ensure tests always use the 'test' environment (instead of deriving from NODE_ENV), call `setupImaTestingIntegration()` in your jest setup file:

```javascript
// setupTests.js
import { setupImaTestingIntegration } from '@ima/plugin-testing-integration';

setupImaTestingIntegration();
```

Then reference this file in your jest config:

```javascript
// jest.config.js
module.exports = {
  preset: '@ima/testing-library/jest-preset',
  setupFiles: ['<rootDir>/setupTests.js'],
  // ... your other jest config
};
```

### Configuration Override

You can override default configuration values using `setConfig`:

```javascript
import { setConfig } from '@ima/plugin-testing-integration';

setConfig({
  appMainPath: 'app/main.js',
  rootDir: process.cwd()
});
```

## API

### initImaApp
Params:
- `object` bootConfigMethods (optional)
  - `Function` initSettings
  - `Function` initBindApp
  - `Function` initServicesApp
  - `Function` initRoutes

Returns:
- `Promise<object>` IMA.js application instance

Initializes IMA.js application into JSDOM. You can extend default boot config methods.

### clearImaApp
Params:
- `object` app - IMA.js application instance

Clears IMA.js application from JSDOM with all unfinished timer functions.

### setupImaTestingIntegration
Configures `@ima/testing-library` to use plugin-testing-integration configuration. This should be called in jest setupFiles before any tests run to ensure the environment is always set to 'test'.

### setConfig
Params:
- `object` config

Overrides default configuration. See [config section](#config) for more info.

### getConfig
Returns:
- `object` Plugin configuration object

Returns the current plugin configuration.

### React Testing Library Exports

The plugin re-exports utilities from `@ima/testing-library` for convenience:

- `renderWithContext` - Render a component with IMA context
- `renderHookWithContext` - Render a hook with IMA context  
- `getContextValue` - Get IMA context value
- `screen` - RTL screen queries
- `waitFor` - Wait for async operations
- `waitForElementToBeRemoved` - Wait for element removal
- `within` - Scoped queries
- `fireEvent` - Fire DOM events
- `act` - Batch updates

## Config

Following configuration options are available.

### appMainPath
`<string>`

`Default: 'app/main.js'`

Path to your main.js file exporting `getInitialAppConfigFunctions` method.

### rootDir
`<string>`

`Default: process.cwd()`

Root directory of your IMA.js application.

### environment
`<string>`

`Default: 'test'`

IMA.js environment that should be used. This is always set to 'test' and takes precedence over NODE_ENV.

### TestPageRenderer
`<Class>`

`Default: null`

This allows you to use custom PageRenderer. The TestPageRenderer has to define static method `initTestPageRenderer(ns, oc, config)`, which should provide the PageRenderer into the Object Container (oc).

### initSettings
`<Function>`

`Default: () => {}`

By defining this method, you can extend default bootConfigMethod `initSettings`. This method receives namespace, Object Container and application config as arguments.

### initBindApp
`<Function>`

`Default: () => {}`

By defining this method, you can extend default bootConfigMethod `initBindApp`. This method receives namespace, Object Container and application config as arguments.

### initServicesApp
`<Function>`

`Default: () => {}`

By defining this method, you can extend default bootConfigMethod `initServicesApp`. This method receives namespace, Object Container and application config as arguments.

### initRoutes
`<Function>`

`Default: () => {}`

By defining this method, you can extend default bootConfigMethod `initRoutes`. This method receives namespace, Object Container and application config as arguments.

### extendAppObject
`<Function>`

`Default: () => {}`

By defining this method, you can extend the app object (return value of initImaApp) with some custom values. This method receives the app object as an argument and should return an object with new values.

### prebootScript
`<Function>`

`Default: () => Promise.resolve()`

This script is executed right before the IMA.js boot config is initialized. You can make any modifications needed to boot the ima application.

## Usage

This is Jest example of simple integration test that loads the IMA.js app homepage and mocks all http get requests.

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
				// won't make any external requests
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
		expect(document.title).toEqual('IMA.js');
	});
});
```

### Using React Testing Library

You can use React Testing Library to render and test components in the context of your IMA.js application:

```javascript
import { initImaApp, clearImaApp, renderWithContext, screen, waitFor } from '@ima/plugin-testing-integration';
import MyComponent from './MyComponent';

describe('Component tests', () => {
	let app;

	beforeEach(async () => {
		app = await initImaApp();
	});

	afterEach(() => {
		clearImaApp(app);
	});

	it('can render component with IMA context', async () => {
		const { container } = await renderWithContext(
			<MyComponent />,
			{ app }
		);

		// Use RTL queries
		expect(screen.getByText('Hello World')).toBeInTheDocument();
		
		// Wait for async operations
		await waitFor(() => {
			expect(screen.getByRole('button')).toBeEnabled();
		});
	});
});
```

## Usage with Enzyme (Legacy)

**Note:** Enzyme support is maintained for backward compatibility but using React Testing Library (see above) is recommended for new tests.

You can boost the integration tests by using [Enzyme mount](https://enzymejs.github.io/enzyme/docs/api/mount.html) method to render the IMA.js application.

*Note that Enzyme PageRenderer extends default IMA PageRenderer. If you choose to override PageRenderer in your tests, it may cause some unexpected behavior.*

### API

EnzymePageRenderer extends the app object returned by initImaApp method with following values.

#### wrapper
Returns:
- `enzyme.ReactWrapper|enzyme.ReactWrapper[]` Return value of enzyme.mount()

Function returning Enzyme ReactWrapper, or array of Enzyme ReactWrappers (in case that there are multiple ReactDOM.render and ReactDOM.hydrate calls inside PageRenderer, but this should not happen in current setup).

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

		// Check that component props are updated
		expect(input.props.value).toEqual(value);
	});
});
```

## Migration from older versions

### Breaking Changes in v7.0.0

- **Removed JSDOM initialization logic** - The plugin now relies on `@ima/testing-library` for JSDOM setup. You must use `@ima/testing-library/jest-preset` in your jest configuration.
- **Removed dependencies**: `jsdom`, `@messageformat/core`, `globby` - These are now handled by `@ima/testing-library`.
- **Environment configuration** - The environment is now always set from the plugin's configuration (`environment: 'test'`) instead of being derived from `NODE_ENV`. Use `setupImaTestingIntegration()` in your jest setup to configure this.
- **Removed configuration options**: 
  - `masterElementId` - Use `@ima/testing-library` configuration instead
  - `protocol` / `host` - Use `@ima/testing-library` server configuration instead
  - `locale` - Dictionary generation is handled by `@ima/testing-library`
  - `beforeCreateIMAServer` / `afterCreateIMAServer` - Use `@ima/testing-library` server configuration hooks
  - `pageScriptEvalFn` - No longer needed with `@ima/testing-library`
  - `processEnvironment` - Use `setupImaTestingIntegration()` or configure `@ima/testing-library` directly
  - `applicationFolder` - Use `@ima/testing-library` server configuration instead

### Migration steps

1. Install required dependencies:
   ```bash
   npm install @ima/testing-library @testing-library/react --save-dev
   ```

2. Update jest configuration to use `@ima/testing-library/jest-preset`:
   ```javascript
   // jest.config.js
   module.exports = {
     preset: '@ima/testing-library/jest-preset',
     // ... rest of config
   };
   ```

3. Create a setup file and call `setupImaTestingIntegration()`:
   ```javascript
   // setupTests.js
   import { setupImaTestingIntegration } from '@ima/plugin-testing-integration';
   setupImaTestingIntegration();
   ```

4. Update your jest config to use the setup file:
   ```javascript
   module.exports = {
     preset: '@ima/testing-library/jest-preset',
     setupFiles: ['<rootDir>/setupTests.js'],
   };
   ```

5. Remove any manual JSDOM initialization from your tests - it's now handled automatically.

6. Update configuration calls - remove unsupported options listed above.

## How it works

## How it works

The plugin leverages `@ima/testing-library` for most of the heavy lifting including JSDOM setup, dictionary generation, and server configuration. The main responsibilities of this plugin are:

### [configuration.js](https://github.com/seznam/IMA.js-plugins/blob/master/packages/plugin-testing-integration/src/configuration.js)

Contains basic IMA config which can be overridden by the argument of `setConfig` function.

### [bootConfigExtensions.js](https://github.com/seznam/IMA.js-plugins/blob/master/packages/plugin-testing-integration/src/bootConfigExtensions.js)

Resolves boot components to extend native [init methods](https://imajs.io/docs/configuration) `initSettings`, `initBindApp`, `initServicesApp`, `initRoutes`, `getAppExtension`. These overrides can be defined in `configuration.js`.

### [app.js](https://github.com/seznam/IMA.js-plugins/blob/master/packages/plugin-testing-integration/src/app.js)

There are two main methods:

#### initImaApp

This main method performs the following steps to initialize the app:
- Validates that JSDOM environment is available (set up by `@ima/testing-library`)
- Configures `@ima/testing-library` with plugin settings
- Generates dictionary using `@ima/testing-library`
- Overrides native timer functions to save timers into internal storage
- Runs `prebootScript` from config if defined
- Creates IMA app object using extended boot config methods
- Boots IMA client app
- Initializes IMA router inside JSDOM environment

#### clearImaApp

This method sets back all native timer functions, clears all pending timers used in integration test run, calls `unAop` on all `aop` components, and clears the IMA Object Container.

### [setup.js](https://github.com/seznam/IMA.js-plugins/blob/master/packages/plugin-testing-integration/src/setup.js)

Provides `setupImaTestingIntegration()` helper that configures `@ima/testing-library` to use the plugin's environment configuration, ensuring consistent test behavior regardless of NODE_ENV.
