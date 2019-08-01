# ima-plugin-local-storage

This is the local-storage plugin for the IMA.js application. 
You can find the IMA.js skeleton application at
<https://github.com/seznam/IMA.js-skeleton> or visit our site
[imajs.io](https://imajs.io).

## Installation

```bash
npm install ima-plugin-local-storage --save
```

```javascript
// /app/build.js

var vendors = {
	common: [
        'ima-plugin-local-storage'
	]
};
```
```javascript
import { LocalStorage } from 'ima-plugin-local-storage';

oc.bind('LocalStorage', LocalStorage);
```
```javascript
const localStorage = oc.get('LocalStorage');

if ($window.isClient()) {
	...
	// initializes local storage
	LocalStorage.init();
	...
}
```