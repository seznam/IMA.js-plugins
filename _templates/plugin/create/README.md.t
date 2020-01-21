---
to: packages/<%= h.changeCase.paramCase(name) %>/README.md
---
<% pluginName = h.changeCase.paramCase(name) -%>
# @ima/<%= pluginName %>

# @TODO: Add plugin description

## Installation

```javascript

npm install @ima/<%= pluginName %> --save

```

```javascript
// /app/build.js

var vendors = {
    common: [
      '@ima/<%= pluginName %>'
    ]
};

/*
The components are now available within the namespace:

ns.plugin.<%= pluginName %>
...

import {
  ...
} from '@ima/<%= pluginName %>';
*/
```

## API

You can describe plugin API here.

## IMA.js

The [IMA.js](https://imajs.io) is an application development stack for developing
isomorphic applications written in pure JavaScript.
You can find the [IMA.js](https://imajs.io) skeleton application at <https://github.com/seznam/IMA.js-skeleton>.

