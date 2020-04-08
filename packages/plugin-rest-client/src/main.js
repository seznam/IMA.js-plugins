import AbstractDataFieldMapper from './AbstractDataFieldMapper';
import AbstractEntity from './AbstractEntity';
import AbstractResource from './AbstractResource';
import AbstractRestClient from './AbstractRestClient';
import Configurator from './Configurator';
import HttpMethod from './HttpMethod';
import LinkGenerator from './LinkGenerator';
import Request from './Request';
import RequestPreProcessor from './RequestPreProcessor';
import Response from './Response';
import ResponsePostProcessor from './ResponsePostProcessor';
import RestClient from './RestClient';
import { deepFreeze } from './utils';

let $registerImaPlugin = () => {};

export default AbstractRestClient;

export {
  AbstractDataFieldMapper,
  AbstractEntity,
  AbstractResource,
  AbstractRestClient,
  Configurator,
  HttpMethod,
  LinkGenerator,
  Request,
  RequestPreProcessor,
  Response,
  ResponsePostProcessor,
  RestClient,
  deepFreeze,
  $registerImaPlugin,
};
