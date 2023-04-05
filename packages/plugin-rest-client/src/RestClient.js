import { GenericError } from '@ima/core';

import Processor, { Operation } from './processor/Processor';

export default class RestClient {
  static get $dependencies() {
    return ['$Http'];
  }

  constructor(http) {
    this._http = http;

    this._defaultProcessors = [];
  }

  registerProcessor(processor) {
    this._defaultProcessors.push(processor);
  }

  async request(resource, method, path, data, options = {}) {
    let request = { method, path, data, options };
    const processors = this._getProcessors(request);

    [request] = await this._runProcessors(
      processors,
      Operation.PRE_REQUEST,
      resource,
      request
    );
    let response = await this._http[method](
      request.path,
      request.data,
      request.options
    );
    [request, response] = await this._runProcessors(
      processors,
      Operation.POST_REQUEST,
      resource,
      request,
      response
    );

    return { request, response };
  }

  async _runProcessors(processors, operation, resource, ...rest) {
    for (const processor of processors) {
      if (!(processor instanceof Processor)) {
        throw new GenericError(
          `RestClient: The processor  ${processor?.constructor?.name} must extend Processor class.`
        );
      }

      rest = await processor[operation](resource, ...rest);
    }

    return rest;
  }

  _getProcessors(request) {
    const defaultProcessors = this._defaultProcessors;

    let transformProcessors = processors => processors;
    if (
      request?.options?.transformProcessors &&
      typeof request.options.transformProcessors === 'function'
    ) {
      transformProcessors = request.options.transformProcessors;

      delete request.options.transformProcessors;
    }

    return transformProcessors(defaultProcessors);
  }
  /*
  {
  transformProcessors:
  processors => {processors.push(oc.get(Processor); return processors;})
  processors => processors.filter(item=>item.name!=Processor))
  }
  * */
}
