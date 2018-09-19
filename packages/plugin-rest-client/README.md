# ima-plugin-rest-client

Generic REST API client plugin for the IMA application framework. You may find
the IMA application skeleton at
[https://github.com/seznam/IMA.js-skeleton](https://github.com/seznam/IMA.js-skeleton).

## Installation

You may install the IMA REST client plugin using the following command:

```
npm install ima-plugin-rest-client --save
```

## Usage

While it is possible to use this plugin on its own within an IMA application,
it is recommended to use it in a combination with a more specialized
REST client implementation extending this plugin.

In order to use the plugin directly in an IMA.js application, add the following
items to the `vendor.common` array in the `app/build.js` configuration file:

```javascript
'ima-plugin-rest-client/AbstractEntity',
'ima-plugin-rest-client/AbstractRestClient',
'ima-plugin-rest-client/Configurator',
'ima-plugin-rest-client/LinkGenerator',
'ima-plugin-rest-client/Request',
'ima-plugin-rest-client/RequestPreProcessor',
'ima-plugin-rest-client/Response',
'ima-plugin-rest-client/ResponsePostProcessor'
```

For information about implementing a custom REST API client based on this
plugin, please see the following sections.

## Architecture overview

The main entry point is the `AbstractRestClient` class, the basic abstract
implementation of the `RestClient` interface.

The `AbstractRestClient` provides methods for performing REST API requests,
which are defined in the aforementioned interface.

The Abstract REST client can be configured using the following:

* `Configurator` - interface defining the API for fetching server-provided
  configuration for other tools that can be used to configure the REST client.
* `LinkGenerator` - interface defining the API for generating URLs for
  accessing the resources and entities of the REST API.
* `RequestPreProcessor` - interface defining the API for pre-processing the
  requests before they are sent to the REST API server. The pre-processor may
  also turn the request into a response, if no actual request to the server is
  necessary.
* `ResponsePostProcessor` - interface defining the API for post-processing all
  responses, regardless whether they were received from the server or generated
  by a request pre-processor.
* `AbstractEntity` - base class for typed approach of identifying REST
  resources. The class also provides various helper method for easier
  manipulation of entities in the REST API.

## Implementing a minimal working REST API client

This sections covers the basics of implementing a REST API client based on this
plugin that does uses string-based instead of class-typed identification of
resources in the REST API, does not require loading server-provided
configuration, nor manipulating the requests or responses.

First step is creating a no-op configurator:

```javascript
import Configurator from 'ima-plugin-rest-client/Configurator';

export default class NoopConfigurator extends Configurator {
  getConfiguration() {
    return Promise.resolve();
  }
}
```

Next we'll need a simple link generator:

```javascript
import LinkGenerator from 'ima-plugin-rest-client/LinkGenerator';

export default class SimpleLinkGenerator extends LinkGenerator {
  constructor(baseUrl) {
    super();

    this._baseUrl = baseUrl;
  }

  createLink(parentEntity, resource, id, parameters, serverConfiguration) {
    // We assume a shallow REST API, therefore the parentEntity is always null.
    // Also, we can ignore the serverConfiguration since our NoopConfigurator
    // does not fetch any configuration provided by the server.

    let linkUrl = `${this._baseUrl}/${resource}`;
    if (['number', 'string'].indexOf(typeof id) > -1) {
      linkUrl += `/${id}`;
    }

    if (Object.keys(parameters).length) {
      linkUrl += '?' + LinkGenerator.encodeQuery(parameters);
    }

    return linkUrl;
  }
}
```

All that remains is wiring everything up:

```javascript
import AbstractRestClient from 'ima-plugin-rest-client/AbstractRestClient';
import NoopConfigurator from './NoopConfigurator';
import SimpleLinkGenerator from './SimpleLinkGenerator';

export default class SimpleRestClient extends AbstractRestClient {
  constructor(httpAgent, baseUrl) {
    super(
      httpAgent,
      new NoopConfigurator(),
      new SimpleLinkGenerator,
      [],
      []
    );
  }
}
```
