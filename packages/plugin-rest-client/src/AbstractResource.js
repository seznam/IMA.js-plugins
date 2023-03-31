import { GenericError } from '@ima/core';

import RestClient from './RestClient';

export default class AbstractResource {
  static get $dependencies() {
    return [RestClient, 'REST_CLIENT_BASE_API_URL'];
  }

  get entityClass() {
    return null;
  }

  // get path() {
  //   return {
  //     list: '/roles',
  //     item: '/roles/{_id}'
  //   };
  // }

  get path() {
    throw new GenericError(`RestClient: getter "path" must be overriden.`);
  }

  get defaultPathType() {
    return 'item';
  }

  constructor(restClient, baseApiUrl) {
    this._restClient = restClient;

    this._baseApiUrl = baseApiUrl;
  }

  async list(data, options) {
    const { response } = await this._restClientRequest(
      'get',
      'list',
      data,
      options
    );

    return response;
  }

  async get(data, options) {
    const { response } = await this._restClientRequest(
      'get',
      'get',
      data,
      options
    );

    return response;
  }

  async create(data, options) {
    const { response } = await this._restClientRequest(
      'post',
      'create',
      data,
      options
    );

    return response;
  }

  async update(data, options) {
    const { response } = await this._restClientRequest(
      'patch',
      'update',
      data,
      options
    );

    return response;
  }

  async replace(data, options) {
    const { response } = await this._restClientRequest(
      'put',
      'replace',
      data,
      options
    );

    return response;
  }

  async delete(data, options) {
    const { response } = await this._restClientRequest(
      'delete',
      'delete',
      data,
      options
    );

    return response;
  }

  async _restClientRequest(method, pathType, data, options) {
    const path = this._getPath(pathType, data);

    const { response } = await this._restClient.request(
      method,
      path,
      this._prepareData(data),
      this._prepareOptions(options)
    );

    this._convertResponseBodyToEntities(response);

    return response;
  }

  _prepareData(data) {
    return { ...data };
  }

  _prepareOptions(options) {
    return { ...options };
  }

  _getPath(pathType, data) {
    let pathTemplate = this.path[pathType];

    if (!pathTemplate) {
      pathTemplate = this.path[this.defaultPathType];

      if (!pathTemplate) {
        throw new GenericError(
          `RestClient: getter "path" does not contain ${pathType}.`
        );
      }
    }
    const path = this._processPathTemplate(pathTemplate, data);

    return this._baseApiUrl + path;
  }

  _processPathTemplate(pathTemplate, data) {
    let path = pathTemplate;

    let regexFindVariables = new RegExp('{(.*?)}', 'g');

    let matches,
      keys = [];
    while ((matches = regexFindVariables.exec(pathTemplate))) {
      keys.push(matches[1]);
    }

    keys.forEach(key => {
      if (!(key in data)) {
        throw new GenericError(
          `RestClient: No attribute of key {${key}} found in data in ${this.constructor.name}.`
        );
      }
      path = path.replace(`{${key}}`, data[key]);

      delete data[key];
    });

    return path;
  }

  _convertResponseBodyToEntities(response) {
    const body = response.body;
    const resource = this.entityClass;

    if (body && resource) {
      if (body instanceof Array) {
        response.body = body.map(entityData => new resource(entityData));
      } else {
        response.body = new resource(body);
      }
    }
  }
}
