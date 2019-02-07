# ima-plugin-useragent

## Installation

```javascript

npm install ima-plugin-useragent --save

```

```javascript
// /app/build.js

var vendors = {
    common: [
        'ima-plugin-useragent'
    ]
};

/*
Now is plugin UserAgent available from:

ns.ima.plugin.userAgent.PlatformJS;
ns.ima.plugin.userAgent.ClientUserAgent;
ns.ima.plugin.userAgent.ServerUserAgent;
ns.ima.plugin.userAgent.UserAgent;

import { PlatformJS, ClientUserAgent, ServerUserAgent, UserAgent } from 'ima-plugin-useragent';
*/

```

```javascript
// /app/config/bind.js
import { UserAgent } from 'ima-plugin-useragent';

oc.bind('UserAgent', UserAgent);

```

##Usage

```javascript
// /app/config/bind.js
oc.bind('Foo', ns.App.Foo, ['UserAgent');

```

```javascript
// /app/foo.js
class Foo {
	constructor(userAgent) {
		...
		var os = userAgent.getOSFamily();

		var browser = userAgent.getName();

		var version = userAgent.getVersion();
		if (version !== 'unknown' ) {
			browser += version;
		}

		var os = userAgent.getOSFamily();
		...
	}
}
```
