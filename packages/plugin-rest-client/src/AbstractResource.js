import { GenericError } from '@ima/core';

import RestClient from './RestClient';

export default class AbstractResource {
  static get $dependencies() {
    return [RestClient, 'REST_CLIENT_BASE_API_URL'];
  }

  static get PathType() {
    return {
      LIST: 'list',
      GET: 'get',
      CREATE: 'create',
      UPDATE: 'update',
      REPLACE: 'replace',
      DELETE: 'delete',
    };
  }

  static get path() {
    throw new GenericError(
      `AbstractResource: Static getter "path" must be overriden.`
    );
  }

  static get entityClass() {
    return null;
  }

  constructor(restClient, baseApiUrl) {
    this._restClient = restClient;

    this._baseApiUrl = baseApiUrl;
  }

  update(data, options, pathType = this.constructor.PathType.UPDATE) {
    return this._restClientRequest('patch', pathType, data, options);
  }

  create(data, options, pathType = this.constructor.PathType.CREATE) {
    return this._restClientRequest('post', pathType, data, options);
  }

  delete(data, options, pathType = this.constructor.PathType.DELETE) {
    return this._restClientRequest('delete', pathType, data, options);
  }

  get(data, options, pathType = this.constructor.PathType.GET) {
    return this._getBody(pathType, data, options);
  }

  list(data, options, pathType = this.constructor.PathType.LIST) {
    return this._getBody(pathType, data, options);
  }

  replace(data, options, pathType = this.constructor.PathType.REPLACE) {
    return this._restClientRequest('put', pathType, data, options);
  }

  async _getBody(pathType, data, options) {
    const { body } = await this._restClientRequest(
      'get',
      pathType,
      data,
      options
    );

    return body;
  }

  _getPathTemplate(pathType) {
    const pathTemplate = this.constructor.path[pathType];

    if (!pathTemplate) {
      throw new GenericError(
        `AbstractResource: getter "path" does not contain ${pathType} in ${this.constructor.name}`
      );
    }

    return pathTemplate;
  }

  _getUrl(pathType, data) {
    const pathTemplate = this._getPathTemplate(pathType);

    const path = this._processPathTemplate(pathTemplate, data);

    return this._baseApiUrl + path;
  }

  _prepareData(data) {
    return { ...data };
  }

  _prepareOptions(options) {
    return { ...options };
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
          `AbstractResource: No attribute of key {${key}} found in data in ${this.constructor.name}.`
        );
      }
      path = path.replace(`{${key}}`, data[key]);

      delete data[key];
    });

    return path;
  }

  async _restClientRequest(method, pathType, data, options) {
    const url = this._getUrl(pathType, data);

    const { response } = await this._restClient.request(
      { resource: this, pathType },
      method,
      url,
      this._prepareData(data),
      this._prepareOptions(options)
    );

    return response;
  }
}
