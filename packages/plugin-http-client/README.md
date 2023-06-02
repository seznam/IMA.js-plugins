# @ima/plugin-http-client

Generic http client for the [IMA](https://imajs.io) application framework.

## Installation

```console
npm install @ima/plugin-http-client --save
```

## Usage

You can add HttpClient alias.

```js
//bind.js

import { HttpClient } from '@ima/plugin-http-client';
oc.bind('$HttpClient', HttpClient);

//optionally you can add default processors to httpClient
oc.constant('HttpClientDefaultProcessors', [AdditionalPostProcessor, SuperProcessor]);
```

You can register some processors.
```js
//services.js

import { EntityProcessor } from '@ima/plugin-http-client/rest';

const httpClient = oc.get('$HttpClient');
httpClient.registerProcessor(oc.get(EntityProcessor));
```

Then you can use HttpClient
```js
class ExampleHttpCall {
    #httpClient: HttpClient;

    static get $dependencies(): Dependencies {
        return [HttpClient];
    }

    constructor(httpClient: HttpClient) {
        this.#httpClient = httpClient;
    }

    async callAPI() {
        const url = 'https://example.com/api/author';

        const {response} = await this.#httpClient.request(
            {
                method: 'get',
                url
            }
        );

        return response;
    }
}
```



## HttpClient
HttpClient use ima HttpAgent and adds support for processors.
It supports the OPTION_TRANSFORM_PROCESSORS option, which enables processor transformation.
You can also define transformation by HttpClient method defaultTransformProcessors.

Examples of request options:
```js
  {
    [OPTION_TRANSFORM_PROCESSORS]: processors => ([...processors, newProcessor])  
  }
  
  {
    [OPTION_TRANSFORM_PROCESSORS]: processors => processors.filter(item=>!(item instanceof NewProcessor))
  }
```


### Processor
The processor serves to transform the request/response before and after the API call.
So it supports two methods preRequest and postRequest.

Example:
```js
export class EntityProcessor extends AbstractProcessor {
    postRequest<B>(params: ProcessorParams<B>) {
        const { response, additionalParams } = params;
        
        if (response) {
            const { body } = response;
            
            const entityClass = additionalParams?.resource?.entityClass;
            
            if (body && entityClass) {
            let newBody: object | object[];
            
            if (body instanceof Array) {
              newBody = body.map(entityData =>
                Reflect.construct(entityClass, [entityData])
              );
            } else {
              newBody = Reflect.construct(entityClass, [body]);
            }
            params.response = Object.assign({}, response, { body: newBody });
            }
        }
        
        return params;
    }
}
```

The result of each processor is patched in HttpClient, so it is sufficient to return the modified value as a result of the processor's action.

If the preRequest action returns a response object, the HttpAgent is no longer called, but comes straight to the postRequest action.

## REST 
This plugin supports REST API using AbstractResource and optional BaseEntity with helper Mappers and EntityProcessor.

### AbstractResource
AbstractResource will help with creating paths to the API as well as working with entities.
You can also change processors in prepareOptions with option OPTION_TRANSFORM_PROCESSORS.

You have to set setting baseApiUrl for REST resources:
```js
//settings.js

...
plugin: {
    httpClient: {
        rest: {
            baseApiUrl: 'YOUR BASE API URL'
        }
    }
},
...
```

#### Paths
You have to specify getter `path` to determine API path. 
There are some build-in PathType like CREATE, GET, UPDATE, REPLACE, DELETE, but you can specify your own.
You can use in brackets some variables in paths.

Example:
```js
class AuthorResource extends AbstractResource {
        static get PathType() {
            return {
                ...super.PathType,
                LIST: 'list'
            };
        }
        
        get path() {
            return {
                [this.constructor.PathType.LIST]: `/authors`,
                [this.constructor.PathType.GET]: `/authors/{$id}`
            };
        }
        
        list(data, options, pathType = this.constructor.PathType.LIST) 
        {
            return super.get(data, options, pathType);
        }
        
        //optionally you can specify entityClass and use it with EntityProcessor
        get entityClass() {
            return AuthorEntity;
        }
}
```

### Entity
This plugin provides a `BaseEntity` that can be directly used or extended. 
The entity takes care of deserializing the data coming into the constructor 
and also provides method for serialization.

#### Data field mapping

BaseEntity defines `dataFieldMapping` getter, which is used to deserialize/serialize the data.
You can use predefined mappers or create new ones to deserialize single value from an API to an entity value
and to serialize property from an entity to a plain value. You can also use string value to rename key.

Example:
```js
    ...
    get dataFieldMapping() {
        return {
            _id: 'id', // rename API value _id to id (_id doesn't exist in new entity)
            metaKeywords: new DefaultToArray(), //if metaKeywords is not defined then the entity will contain an empty array for this field.
            layout: new EntityMapper(BaseEntity), //transform layout object to BaseEntity
            listOfAuthors: { mapper: new EntityListMapper(BaseEntity), newKey: 'authors' } //rename to authors and tranform to array of BaseEntities
        };
    }
    ...
```


### Mapper
There are some predefined mappers:
* DefaultToArray - for given property defines empty array as default value
* EntityMapper - transforms value of property to given entity (given entity has to be instance of BaseEntity)
* EntityListMapper - transforms array of objects to array of given entities

You can also create new one:

Example:
```js
class DateMapper extends BaseMapper {
    deserialize(serializedDate) {
        if (!serializedDate) {
            return serializedDate;
        }
        
        const dateAndTime = serializedDate.split(' ');
        const dateParts = dateAndTime[0].split('-');
        const timeParts = dateAndTime[1].split(':');
        
        return new Date(
            dateParts[0],
            dateParts[1] - 1,
            dateParts[2],
            timeParts[0],
            timeParts[1],
            timeParts[2],
            0
        );
    }

    serialize(date) {
        if (!date) {
            return date;
        }
        
        const hours = formatNumber(date.getHours());
        const minutes = formatNumber(date.getMinutes());
        const seconds = formatNumber(date.getSeconds());
        
        return `${date.getFullYear()}-${formatNumber(date.getMonth() + 1)}-${formatNumber(
            date.getDate()
        )} ${hours}:${minutes}:${seconds}`;
        
        function formatNumber(number, digits = 2) {
            let string = `${number}`;
            while (string.length < digits) {
                string = `0${string}`;
            }
        
            return string;
        }
    }
}
```

### EntityProcessor

The `EntityProcessor` transforms the response from the API into entities in case there is `entityClass` getter filled in Resource.

