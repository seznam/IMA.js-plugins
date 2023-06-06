import type {
  Dependencies,
  HttpAgent,
  HttpAgentRequestOptions,
} from '@ima/core';
import { GenericError } from '@ima/core';

declare module '@ima/core' {
  interface OCAliasMap {
    HttpClientDefaultProcessors: Processor[];
  }
}

import {
  AbstractProcessor,
  Processor,
  Operation,
  ProcessorParams,
} from './AbstractProcessor';

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
  data?: Record<string, any>;
  options?: HttpClientRequestOptions;
};

/**
 * HttpClient use ima HttpAgent and adds support for processors.
 */
export class HttpClient {
  #http: HttpAgent;
  #defaultProcessors: Processor[];

  static get $dependencies(): Dependencies {
    return ['$Http', '...?HttpClientDefaultProcessors'];
  }

  constructor(http: HttpAgent, ...defaultProcessors: Processor[]) {
    this.#http = http;

    //ima returns undefined for empty optional spread dependency - which result in [undefined] so we filter it
    const processors = defaultProcessors.filter(Boolean);

    this.#checkProcessorsType(processors);
    this.#defaultProcessors = processors;
  }

  /**
   * Method registerProcessor added to defaultProcessors new processor
   * @param processor
   */
  registerProcessor(processor: Processor) {
    this.#checkProcessorsType([processor]);
    this.#defaultProcessors.push(processor);
  }

  /**
   * You can call request with additionalParams for processors. The request is processed by pre request processors method.
   * If pre request processors don't return response, ima HttpAgent request is called.
   * In the end the request is processed by post request processors method.
   *
   * @param request
   * @param additionalParams
   */
  async request<B = any>(
    request: HttpClientRequest,
    additionalParams?: object
  ) {
    const processors = this.#getProcessors(request);
    this.#checkProcessorsType(processors);

    const processorResult = await this.#runProcessors<B>(
      processors,
      Operation.PRE_REQUEST,
      {
        additionalParams,
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

    return await this.#runProcessors<B>(processors, Operation.POST_REQUEST, {
      additionalParams,
      request: processedRequest,
      response: processedResponse,
    });
  }

  invalidateCache(method: string, url: string, data: any) {
    this.#http.invalidateCache(method, url, data);
  }

  /**
   * RunProcessors runs every registred processor and patch the response.
   *
   * @param processors
   * @param operation
   * @param processorParams
   * @private
   */
  async #runProcessors<B>(
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

  #checkProcessorsType(processors: Processor[]) {
    processors.forEach(processor => {
      if (!(processor instanceof AbstractProcessor)) {
        throw new GenericError(
          `HttpClient: The processor  ${processor?.constructor?.name} must extend AbstractProcessor class.`
        );
      }
    });
  }

  /**
   * Method for default transforming registered processors
   * @param processors
   * @returns Processor[]
   */
  defaultTransformProcessors(processors: Processor[]): Processor[] {
    return processors;
  }

  /**
   * getProcessors returns processors transformed by defaultTransformProcessors method or by method from request options.
   *
   * @param request
   * @private
   *
   * @returns Processor[]
   */
  #getProcessors(request: HttpClientRequest): Processor[] {
    const defaultProcessors = this.#defaultProcessors;

    let transformProcessors = this.defaultTransformProcessors;
    if (
      request?.options?.[OPTION_TRANSFORM_PROCESSORS] &&
      typeof request.options[OPTION_TRANSFORM_PROCESSORS] === 'function'
    ) {
      transformProcessors = request.options[OPTION_TRANSFORM_PROCESSORS];
    }

    return transformProcessors(defaultProcessors);
  }
}
