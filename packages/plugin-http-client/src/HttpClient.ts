import type {
  Dependencies,
  HttpAgent,
  HttpAgentRequestOptions,
  UnknownParameters,
} from '@ima/core';

declare module '@ima/core' {
  interface OCAliasMap {
    $DefaultProcessors: Processor[];
  }
}

import { Processor, Operation, ProcessorParams } from './Processor';

export type ResourceInfo = {
  pathType: string;
  resource: any;
};

export const OPTION_TRANSFORM_PROCESSORS = 'transformProcessors';

export type HttpClientRequestOptions = {
  [OPTION_TRANSFORM_PROCESSORS]?: (processor: Processor[]) => Processor[];
} & HttpAgentRequestOptions;

export type HttpClientRequestMethod =
  | 'get'
  | 'put'
  | 'post'
  | 'patch'
  | 'delete';

export type HttpClientRequest = {
  method: HttpClientRequestMethod;
  url: string;
  data?: UnknownParameters;
  options?: HttpClientRequestOptions;
};

export class HttpClient {
  #http: HttpAgent;
  #defaultProcessors: Processor[];

  static get $dependencies(): Dependencies {
    return ['$Http', '...?$DefaultProcessors'];
  }

  constructor(http: HttpAgent, ...defaultProcessors: Processor[]) {
    this.#http = http;

    this.#defaultProcessors = defaultProcessors.filter(
      item => item instanceof Processor
    );
  }

  registerProcessor(processor: Processor) {
    this.#defaultProcessors.push(processor);
  }

  async request(resourceInfo: ResourceInfo, request: HttpClientRequest) {
    const processors = this._getProcessors(request);

    const processorResult = await this._runProcessors(
      processors,
      Operation.PRE_REQUEST,
      {
        resourceInfo,
        request,
        response: null,
      }
    );
    const { request: processedRequest } = processorResult;
    let { response: processedResponse } = processorResult;

    if (!processedResponse) {
      processedResponse = await this.#http[processedRequest.method](
        processedRequest.url,
        processedRequest.data,
        processedRequest.options
      );
    }

    return await this._runProcessors(processors, Operation.POST_REQUEST, {
      resourceInfo,
      request: processedRequest,
      response: processedResponse,
    });
  }

  async _runProcessors<B>(
    processors: Processor[],
    operation: Operation,
    processorParams: ProcessorParams<B>
  ) {
    for (const processor of processors) {
      const processorResult = await processor[operation](processorParams);
      processorParams = { ...processorParams, ...processorResult };
    }

    return processorParams;
  }

  /*
    Do readme
    Mozne upravit pro vsechny volani _defaultTransformProcessors,
    mozno upravit pro konkretni resource v _prepareOptions
    nebo by request v options
  {
  transformProcessors:
  processors => ({...processors, newProcessor})
  processors => processors.filter(item=>item.name!=='Processor'))
  }
  * */
  _defaultTransformProcessors(processors: Processor[]): Processor[] {
    return processors;
  }

  _getProcessors(request: HttpClientRequest): Processor[] {
    const defaultProcessors = this.#defaultProcessors;

    let transformProcessors = this._defaultTransformProcessors;
    if (
      request?.options?.[OPTION_TRANSFORM_PROCESSORS] &&
      typeof request.options[OPTION_TRANSFORM_PROCESSORS] === 'function'
    ) {
      transformProcessors = request.options[OPTION_TRANSFORM_PROCESSORS];
    }

    return transformProcessors(defaultProcessors);
  }
}
