# ima-plugin-rest-client-shared-cache

Extension package for [`ima-plugin-rest-client`](https://github.com/seznam/IMA.js-plugins/tree/master/packages/plugin-rest-client#readme)
that utilizes data sharing across multiple Node processes. This is useful
if you have resouces that stay the same for every user. Therefore there's
no need to retrieve them again from an API.

### Installation

```console
npm install --save ima-plugin-rest-client-shared-cache
```

### Usage

Be carefull when using SharedCache pre-processor and post-processor with other rest client processors that might cache data. It's important that SharedCache processors are as close to the core of data fetching as possible.

```
OtherCachePreProcessors 
                        ⤷ SharedCachePreProcessor
                                                  ⤷ RestClient ( ImaHttpAgent )
                          SharedCachePostProcessor ⤶
OtherCachePostProcessors ⤶
```

```javascript
// app/config/bind.js
import {
  SharedCache as RestClientSharedCache,
  SharedCachePostProcessor,
  SharedCachePreProcessor
} from 'ima-plugin-rest-client-shared-cache';

export let init = (ns, oc, config) => {
  // ...
  oc.inject(RestClientSharedCache, [HttpAgent, config.$Http]);
  oc.inject(SharedCachePostProcessor, [RestClientSharedCache]);
  oc.inject(SharedCachePreProcessor, [RestClientSharedCache]);
  
  oc.constant('REST_API_CLIENT_PREPROCESSORS', [
    // ... other pre-processors that might cache data
    oc.get(SharedCachePreProcessor),
    // ... other pre-processors working with requests
  ]);

  oc.constant('REST_API_CLIENT_POSTPROCESSORS', [
    // ... other post-processors working with data
    oc.get(SharedCachePostProcessor),
    // ... other post-processors that might cache data
  ]);
  
  // inject RestClient as you'd normally do. 
  oc.inject(RestClient, [
    HttpAgent,
    Cache,
    'REST_API_ROOT_URL',
    RestClientLinkGenerator,
    'REST_API_CLIENT_PREPROCESSORS',
    'REST_API_CLIENT_POSTPROCESSORS'
  ]);
```
