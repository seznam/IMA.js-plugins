import type { ProcessorParams } from '../../AbstractProcessor';
import { AbstractProcessor } from '../../AbstractProcessor';

/**
 * The EntityProcessor transforms the response from the API into entities.
 */
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
