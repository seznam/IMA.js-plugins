import { AbstractProcessor, type ProcessorParams } from '../AbstractProcessor';

export const OPTION_TRANSFORM_PROCESSORS = 'transformProcessors';

export class RemoveTransformOptionRequestProcessor extends AbstractProcessor {
  preRequest<T = unknown>(params: ProcessorParams<T>): ProcessorParams<T> {
    const { request } = params;

    const newRequest = { ...request };

    delete newRequest.options?.[OPTION_TRANSFORM_PROCESSORS];

    return { ...params, request: newRequest };
  }
}
