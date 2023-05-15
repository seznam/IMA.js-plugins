import { HttpAgentResponse, Dependencies } from '@ima/core';

import { HttpClientRequest, ResourceInfo } from './HttpClient';

export enum Operation {
  PRE_REQUEST = 'preRequest',
  POST_REQUEST = 'postRequest',
}

export type ProcessorParams<B> = {
  response: HttpAgentResponse<B> | null;
  request: HttpClientRequest;
  resourceInfo: ResourceInfo;
};

export class Processor {
  static get $dependencies(): Dependencies {
    return [];
  }

  preRequest<B>(params: ProcessorParams<B>) {
    return params;
  }

  postRequest<B>(params: ProcessorParams<B>) {
    return params;
  }
}
