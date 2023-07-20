# @ima/plugin-resource-loader

This is the base plugin for loading scripts and styles for the IMA.js application.
You can find the IMA.js skeleton application at <https://github.com/seznam/IMA.js-skeleton>
or follow link <https://imajs.io>.

## Installation

```javascript

npm install @ima/plugin-resource-loader --save

```

```javascript
// /app/build.js

var vendors = {
	common: [
		'@ima/plugin-resource-loader'
	]
};

/*
Now is script loader plugin available as:

import { ResourceLoader } from '@ima/plugin-resource-loader';
*/

```
