# @ima/plugin-self-xss

The [IMA](https://imajs.io) plugin is trying to mitigate Self-XSS security attack by sending simple
 message into console.

## Installation

```console
npm install @ima/plugin-self-xss --save
```

Add language paths to `ima.config.js` using the `languages` config settings. Follwing settings should cover all `@ima/` plugins:

```javascript
// ./ima.config.js
module.exports = {
  languages: {
    cs: [
      './node_modules/@ima/**/*CS.json',
      './app/**/*CS.json',
    ],
    en: [
      './node_modules/@ima/**/*EN.json',
      './app/**/*EN.json',
    ],
  },
};

```

```js
// ./app/config/services.js
import SelfXSS from '@ima/plugin-self-xss';

export default (ns, oc, config) => {
	// ...
	oc.get(SelfXSS).init();
};

```
