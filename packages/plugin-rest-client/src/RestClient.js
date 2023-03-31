import { GenericError } from '@ima/core';

import Processor, { Operation } from './Processor';

export default class RestClient {
  static get $dependencies() {
    return ['$Http', 'REST_CLIENT_DEFAULT_PROCESSORS'];
  }

  constructor(http, defaultProcessors) {
    this._http = http;

    this._defaultProcessors = defaultProcessors;
  }

  async request(method, path, data, options = {}) {
    let request = { method, path, data, options };
    const processors = this._getProcessors(request);

    [request] = await this._runProcessors(
      processors,
      Operation.PRE_REQUEST,
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
      request,
      response
    );

    return { request, response };
  }

  async _runProcessors(processors, operation, ...rest) {
    for (const processor of processors) {
      if (!(processor instanceof Processor)) {
        throw new GenericError(
          `RestClient: The processor  ${processor?.constructor?.name} must extend Processor class.`
        );
      }

      rest = await processor[operation](...rest);
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
}
