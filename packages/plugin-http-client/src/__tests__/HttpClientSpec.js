import { HttpAgent } from '@ima/core';

import { AbstractProcessor } from '../AbstractProcessor';
import { HttpClient, OPTION_TRANSFORM_PROCESSORS } from '../HttpClient';

describe('HttpClient', () => {
  let httpAgent = null;
  let httpClient = null;
  let resultResponse;
  let additionalParams;

  class AdditionalProcessor extends AbstractProcessor {
    preRequest() {
      return { response: 'Pre' };
    }
  }

  class AdditionalPostProcessor extends AbstractProcessor {
    postRequest(params) {
      return { response: params.response + 'Post' };
    }
  }

  beforeEach(() => {
    httpAgent = new HttpAgent();
    httpClient = new HttpClient(httpAgent);

    resultResponse = 'httpAgentResponse';
    additionalParams = { resourcePath: 'main' };
  });

  describe('request without processors', () => {
    it('should not change response', async () => {
      jest
        .spyOn(httpAgent, 'get')
        .mockReturnValue(Promise.resolve(resultResponse));
      const request = { method: 'get', url: 'some_url' };
      const response = await httpClient.request(request);

      expect(response).toStrictEqual({
        additionalParams: undefined,
        request,
        response: resultResponse,
      });
    });

    it('should add additionalParams to result of request', async () => {
      jest
        .spyOn(httpAgent, 'get')
        .mockReturnValue(Promise.resolve(resultResponse));
      const request = { method: 'get', url: 'some_url' };
      const response = await httpClient.request(request, additionalParams);

      expect(response).toStrictEqual({
        additionalParams,
        request,
        response: resultResponse,
      });
    });

    it('should call defaultTransformProcessors with empty array of processors if not set option OPTION_TRANSFORM_PROCESSORS', async () => {
      jest
        .spyOn(httpAgent, 'post')
        .mockReturnValue(Promise.resolve(resultResponse));
      jest.spyOn(httpClient, 'defaultTransformProcessors');
      const request = { method: 'post', url: 'some_url' };
      const response = await httpClient.request(request, additionalParams);

      expect(response).toStrictEqual({
        additionalParams,
        request,
        response: resultResponse,
      });
      expect(httpClient.defaultTransformProcessors).toHaveBeenCalledWith([]);
    });
  });

  describe('request with processors', () => {
    it('should not call httpAgent if processor preRequest action returns response', async () => {
      jest.spyOn(httpAgent, 'get');
      const request = { method: 'get', url: 'some_url' };
      httpClient.registerProcessor(new AdditionalProcessor());
      const response = await httpClient.request(request, additionalParams);

      expect(httpAgent.get).toHaveBeenCalledTimes(0);
      expect(response).toStrictEqual({
        additionalParams,
        request,
        response: 'Pre',
      });
    });

    it('should remove processors by option OPTION_TRANSFORM_PROCESSORS', async () => {
      jest
        .spyOn(httpAgent, 'put')
        .mockReturnValue(Promise.resolve(resultResponse));

      const request = {
        method: 'put',
        url: 'some_url',
        options: {
          [OPTION_TRANSFORM_PROCESSORS]: processors =>
            processors.filter(item => !(item instanceof AdditionalProcessor)),
        },
      };
      httpClient.registerProcessor(new AdditionalProcessor());
      httpClient.registerProcessor(new AdditionalPostProcessor());
      httpClient.registerProcessor(new AdditionalProcessor());
      const response = await httpClient.request(request, additionalParams);

      expect(response).toStrictEqual({
        additionalParams,
        request,
        response: 'httpAgentResponsePost',
      });
    });

    it('should add processor by option OPTION_TRANSFORM_PROCESSORS', async () => {
      jest
        .spyOn(httpAgent, 'put')
        .mockReturnValue(Promise.resolve(resultResponse));

      const request = {
        method: 'put',
        url: 'some_url',
        options: {
          [OPTION_TRANSFORM_PROCESSORS]: processors => [
            ...processors,
            new AdditionalPostProcessor(),
          ],
        },
      };
      httpClient.registerProcessor(new AdditionalProcessor());
      const response = await httpClient.request(request, additionalParams);

      expect(response).toStrictEqual({
        additionalParams,
        request,
        response: 'PrePost',
      });
    });

    it('should add processor by constructor defaultProcessors', async () => {
      jest
        .spyOn(httpAgent, 'delete')
        .mockReturnValue(Promise.resolve(resultResponse));

      const request = {
        method: 'delete',
        url: 'some_url',
      };
      httpClient = new HttpClient(
        httpAgent,
        new AdditionalProcessor(),
        new AdditionalPostProcessor(),
        new AdditionalPostProcessor()
      );
      const response = await httpClient.request(request, additionalParams);

      expect(response).toStrictEqual({
        additionalParams,
        request,
        response: 'PrePostPost',
      });
    });
  });
});
