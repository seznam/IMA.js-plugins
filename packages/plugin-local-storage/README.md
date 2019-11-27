# @ima/plugin-local-storage

This is the local-storage plugin for the IMA.js application. 
You can find the IMA.js skeleton application at
<https://github.com/seznam/IMA.js-skeleton> or visit our site
[imajs.io](https://imajs.io).

## Installation

```bash
npm install @ima/plugin-local-storage --save
```

```javascript
// /app/build.js

var vendors = {
	common: [
        '@ima/plugin-local-storage'
	]
};
```
```javascript
// /app/config/bind.js

import { LocalStorage } from '@ima/plugin-local-storage';

oc.bind('LocalStorage', LocalStorage);
```
```javascript
// /app/config/service.js

const localStorage = oc.get('LocalStorage');

if ($window.isClient()) {
	...
	// initializes local storage
	localStorage.init();
	...
}
```

## Usage

The localStorage class extends [ima storage interface](https://github.com/seznam/IMA.js-core/blob/master/storage/Storage.js). You can easy use common storage methods like [has](https://github.com/seznam/IMA.js-core/blob/master/storage/Storage.js#L28), [get](https://github.com/seznam/IMA.js-core/blob/master/storage/Storage.js#L40), [set](https://github.com/seznam/IMA.js-core/blob/master/storage/Storage.js#L50), [delete](https://github.com/seznam/IMA.js-core/blob/master/storage/Storage.js#L58), [clear](https://github.com/seznam/IMA.js-core/blob/master/storage/Storage.js#L65), etc.

```javascript
const exist = localStorage.has('key');

if (!exist) {
  localStorage.set('key', { some: 'value' }, { expired: 24 * 60 * 60 });
}

const value = localStorage.get('key');
// some logic
localStorage.delete('key');
```
