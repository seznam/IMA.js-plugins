import { Processor, ProcessorParams } from '../../Processor';

export class EntityProcessor extends Processor {
  postRequest<B>(params: ProcessorParams<B>) {
    const { response, resourceInfo } = params;

    if (response) {
      const { body } = response;

      const entityClass = resourceInfo.resource.constructor.entityClass;

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
