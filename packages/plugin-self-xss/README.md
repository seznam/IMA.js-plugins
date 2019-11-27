# @ima/plugin-self-xss

The [IMA](https://imajs.io) plugin is trying to mitigate Self-XSS security attack by sending simple
 message into console.

## Installation

```javascript

npm install @ima/plugin-self-xss --save

```

```javascript
// /app/build.js

let vendors = {
    common: [
        '@ima/plugin-self-xss'
    ]
};

let languages = {
	cs: [
		'./node_modules/@ima/plugin-self-xss/dist/locales/*CS.json'
	],
	en : [
		'./node_modules/@ima/plugin-self-xss/dist/locales/*EN.json'
	]
};

/*
The atom components are now available within the namespace:

import SelfXSS from '@ima/plugin-self-xss';
*/
```

```
// /app/config/services.js
import SelfXSS from '@ima/plugin-self-xss';

...

let selfXSS = oc.get(SelfXSS);

...

selfXSS.init();

```

## IMA.js

The [IMA.js](https://imajs.io) is an application development stack for developing
isomorphic applications written in pure JavaScript.
You can find the [IMA.js](https://imajs.io) skeleton application at <https://github.com/seznam/IMA.js-skeleton>.
