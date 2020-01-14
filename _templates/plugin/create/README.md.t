---
to: packages/<%= h.changeCase.paramCase(name) %>/README.md
---
<%
  pluginName = h.changeCase.paramCase(name)
%>
# @ima/<%= pluginName %>

The [IMA](https://imajs.io) plugin selects extra props from page state to your component.
It uses [HOC](https://reactjs.org/docs/higher-order-components.html) at the background.
It can be very useful for example some analytical data.

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

