# @ima/plugin-http-client

Generic http client for the [IMA](https://imajs.io) application framework.

## Installation

```console
npm install @ima/plugin-http-client --save
```

## HttpClient
HttpClient use ima HttpAgent and adds support for processors.

### Processor
The processor serves to transform the request/response before and after the API call.
So it has two methods preRequest and postRequest.

Example:
```
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

## REST 
This plugin supports REST api using AbstractResource and optional BaseEntity with helper Mappers and EntityProcessor.

### AbstractResource
AbstractResource will help with creating paths to the API as well as working with entities.

#### Paths
You have to specify getter `path` to determine API path. 
There are some build-in PathType like CREATE, GET, UPDATE, REPLACE, DELETE, but you can specify your own.
You can use in brackets some variables in paths.

Example:
```
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
        
        //optionally you can specify entityClass and you it with EntityProcessor
        get entityClass() {
            return AuthorEntity;
        }
}
```

### Entity
This plugin provides a `BaseEtity` that can be directly used or extended. 
The entity takes care of deserializing the data coming into the constructor 
and also has a method for serialization.

#### Data field mapping

There is a `dataFieldMapping` getter in the entity, which is used to deserialize/serialize the data.
You can use predefined mappers or create new ones to deserialize single value from an API to an entity value
and to serialize property from an entity to a plain value. You can also use only string value for rename key of value.

Example:
```
	get dataFieldMapping() {
		return {
			_id: 'id', // rename API value _id to id (_id is not exists in new entity)
			metaKeywords: new DefaultToArray(), //if metaKeywords is not defined then the entity will contain an empty array for this field.
			layout: new EntityMapper(BaseEntity), //transform layout object to BaseEntity
			listOfAuthors: { mapper: new EntityListMapper(BaseEntity), newKey: 'authors' } //rename to authors and tranform to array of BaseEntities
		};
	}
```


### Mapper
There are some predefined mappers:
* DefaultToArray - define for entity property default value as empty array
* EntityMapper - transform object into entity property which is instance of BaseEntity.
* EntityListMapper - transform array of object into entity property with array of entities

You can also create new one:

Example:
```
class Datemapper extends BaseMapper {
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

