# @ima/plugin-halson-rest-client

HAL+JSON REST API client for IMA applications.

Based on [@ima/plugin-rest-client](https://github.com/seznam/IMA.js-plugins/tree/master/packages/plugin-rest-client)


### HAL specification:

http://stateless.co/hal_specification.html or
https://tools.ietf.org/html/draft-kelly-json-hal-07 (already expired).


## Installation

```bash
npm install --save @ima/plugin-halson-rest-client
```

```javascript
// /app/build.js

var vendors = {
	common: [
		'@ima/plugin-halson-rest-client'
	]
};

/*
Now is the halson-rest-client plugin available as:

import {
  AbstractHalsonEntity,         // The base class for typed REST API HALSON entities
  HalsonConfigurator,           // Configurator for the HAL+JSON REST API client configurator.
  HalsonLinkGenerator,          // URI generator for the HAL+JSON REST API client.
  HalsonResponsePostProcessor,  // REST API response post-processor
  HalsonRestClient,             // The REST API client for the HAL+JSON REST API.

  // decorators:
  embedName,
  idParameterName,
  inlineEmbeds
 } from '@ima/plugin-halson-rest-client';
*/

```