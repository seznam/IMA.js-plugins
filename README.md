# ima.js-module-analytic

If you are looking more details, you should
follow this link:
[https://gitlab.kancelar.seznam.cz/IMA.js/module-analytic](https://gitlab.kancelar.seznam.cz/IMA.js/module-analytic).

## Installation

```javascript

npm install ima.js-module-analytic --save

```

```javascript
// /app/vendor.js

var moduleAnalytic = require('ima.js-module-analytic');
.
.
.
vendorApp.set('ModuleAnalytic', moduleAnalytic);

/*
Now is ModuleAnalytic available from:

ns.Module.Analytic.EVENTS
ns.Module.Analytic.Abstract

import { EVENTS, Abstract } from 'module/analytic';
import { ModuleAnalytic } from 'app/vendor';
*/

```
