# ima-plugin-analytic

This is the abstract analytic plugin for the IMA.js application. 
You can find the IMA.js skeleton application at <https://github.com/seznam/IMA.js-skeleton>
or follow link <https://imajs.io>.

## Installation

```javascript

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
Now is analytic plugin available from:

ns.ima.plugin.analytic.Events
ns.ima.plugin.analytic.AbstractAnalytic

import { Events, AbstractAnalytic } from 'ima-plugin-analytic';
*/

```
