import Processor, { Operation } from './Processor';

export default class EntityProcessor extends Processor {
  [Operation.POST_REQUEST](resourceInfo, request, response) {
    const { body } = response;

    let newBody = body;

    const entityClass = resourceInfo.resource.constructor.entityClass;

    if (body && entityClass) {
      if (body instanceof Array) {
        newBody = body.map(entityData => new entityClass(entityData));
      } else {
        newBody = new entityClass(body);
      }
    }

    const newResponse = Object.assign({}, response, { body: newBody });

    return [request, newResponse];
  }
}
