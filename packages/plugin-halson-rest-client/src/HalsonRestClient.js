import { AbstractRestClient } from '@ima/plugin-rest-client';
import HalsonLinkGenerator from './HalsonLinkGenerator';
import HalsonResponsePostProcessor from './HalsonResponsePostProcessor';

/**
 * The REST API client for the HAL+JSON REST API.
 */
export default class HalsonRestClient extends AbstractRestClient {
  /**
   * Initializes the HALSON REST API client.
   *
   * @param {HttpAgent} httpAgent The IMA HTTP agent used for communication
   *        with the REST API.
   * @param {Configurator} configurator URL to the REST API root.
   * @param {RequestPreProcessor[]} preProcessors The request pre-processors.
   * @param {ResponsePostProcessor[]} postProcessors The response
   *        post-processors. The response will be processed by the
   *        {@linkcode HalsonResponsePostProcessor} before it will be passed
   *        to the provided post-processors.
   */
  constructor(
    httpAgent,
    configurator,
    preProcessors = [],
    postProcessors = []
  ) {
    super(
      httpAgent,
      configurator,
      new HalsonLinkGenerator(),
      preProcessors,
      [new HalsonResponsePostProcessor()].concat(postProcessors)
    );
  }
}
