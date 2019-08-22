# ima-plugin-analytic

This is the abstract analytic plugin for the IMA.js application.
You can find the IMA.js skeleton application at
<https://github.com/seznam/IMA.js-skeleton> or visit our site
[imajs.io](https://imajs.io).

## Installation

```bash
npm install ima-plugin-analytic --save
```

```javascript
// /app/build.js

var vendors = {
	common: [
		'ima-plugin-analytic'
	]
};

/*
Now is the analytic plugin available as:

import { events as AnalyticEvents, AbstractAnalytic } from 'ima-plugin-analytic';
*/

```

## Implementing analytics in v2.0

The createGlobalDefinition method is renamed to _createGlobalDefinition and set as protected. LOAD event is fired only once.

## Implementing analytics in v1.0

Since version 1.0 all analytics implement deferred loading of analytic scripts. Initialization was splitted into 2 methods.

- `init()` - initializes global variables that mock analytic before it's loaded. This method should be called as soon as possible in your loading sequace.
- `load()` - actually loads the analytic script and executes every hit that has been made until this method call. This method should be called at the end of your loading sequence.
