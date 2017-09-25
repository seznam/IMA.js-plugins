# ima-plugin-xhr

[![Build Status](https://travis-ci.org/seznam/IMA.js-plugin-xhr.svg?branch=master)](https://travis-ci.org/seznam/IMA.js-plugin-xhr)
[![npm](http://img.shields.io/npm/v/ima-plugin-xhr.svg)](https://www.npmjs.com/package/ima-plugin-xhr)
[![License](https://img.shields.io/npm/l/ima-plugin-xhr.svg)](LICENSE)

Helper plugin simplifying the usage of the XMLHttpRequest API. This plugin is
meant to be used only at the client side and only where the fetch API is
insufficient at the moment.

You can find the IMA.js skeleton application at
<https://github.com/seznam/IMA.js-skeleton> or follow this link:
<https://imajs.io>.

## Installation

```
npm install ima-plugin-xhr --save
```

```javascript
// /app/build.js

var vendors = {
	common: [
		'ima-plugin-xhr'
	]
};

/*
The XHR plugin is now available like this:

import { XHR, defaultDependencies } from 'ima-plugin-xhr';
*/
```

```javascript
// /app/config/bind.js
import { XHR, defaultDependencies } from 'ima-plugin-xhr';

oc.inject(XHR, defaultDependencies);
```

## Usage

The API is **mostly** compatible with the IMA's HTTP Agent. For details, please
see the API documentation.
