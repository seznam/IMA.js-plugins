import { HttpAgentResponse, Dependencies } from '@ima/core';

import { HttpClientRequest } from './HttpClient';

export enum Operation {
  PRE_REQUEST = 'preRequest',
  POST_REQUEST = 'postRequest',
}

export type ProcessorParams<B> = {
  response: HttpAgentResponse<B> | null;
  request: HttpClientRequest;
  additionalParams?: any;
};

/**
 * The processor serves to transform the request/response before and after the API call.
 */
export interface Processor {
  preRequest<B = any>(params: ProcessorParams<B>): ProcessorParams<B>;
  postRequest<B = any>(params: ProcessorParams<B>): ProcessorParams<B>;
}

export abstract class AbstractProcessor implements Processor {
  static get $dependencies(): Dependencies {
    return [];
  }

  preRequest<B = any>(params: ProcessorParams<B>) {
    return params;
  }

  postRequest<B = any>(params: ProcessorParams<B>) {
    return params;
  }
}
