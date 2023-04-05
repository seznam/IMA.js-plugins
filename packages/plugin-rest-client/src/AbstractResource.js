import { GenericError } from '@ima/core';

import RestClient from './RestClient';

export const PathType = Object.freeze({
  LIST: 'list',
  GET: 'get',
  CREATE: 'create',
  UPDATE: 'update',
  REPLACE: 'replace',
  DELETE: 'delete',
});

export default class AbstractResource {
  static get $dependencies() {
    return [RestClient, 'REST_CLIENT_BASE_API_URL'];
  }

  static get entityClass() {
    return null;
  }

  get resourceBasePath() {
    throw new GenericError(
      `RestClient: getter "resourceBasePath" must be overriden.`
    );
  }

  get path() {
    return Object.values(PathType).reduce((result, item) => {
      result[item] =
        item === PathType.LIST
          ? `/${this.resourceBasePath}`
          : `/${this.resourceBasePath}/{id}`;

      return result;
    }, {});
  }

  constructor(restClient, baseApiUrl) {
    this._restClient = restClient;

    this._baseApiUrl = baseApiUrl;
  }

  async list(data, options) {
    const { body } = await this._restClientRequest(
      'get',
      PathType.LIST,
      data,
      options
    );

    return body;
  }

  async get(data, options) {
    const { body } = await this._restClientRequest(
      'get',
      PathType.GET,
      data,
      options
    );

    return body;
  }

  create(data, options) {
    return this._restClientRequest('post', PathType.CREATE, data, options);
  }

  update(data, options) {
    return this._restClientRequest('patch', PathType.UPDATE, data, options);
  }

  replace(data, options) {
    return this._restClientRequest('put', PathType.REPLACE, data, options);
  }

  delete(data, options) {
    return this._restClientRequest('delete', PathType.DELETE, data, options);
  }

  async _restClientRequest(method, pathType, data, options) {
    const path = this._getPath(pathType, data);

    const { response } = await this._restClient.request(
      this,
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
    const pathTemplate = this.path[pathType];

    if (!pathTemplate) {
      throw new GenericError(
        `RestClient: getter "path" does not contain ${pathType} in ${this.constructor.name}`
      );
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
    const resource = this.constructor.entityClass;

    if (body && resource) {
      if (body instanceof Array) {
        response.body = body.map(entityData => new resource(entityData));
      } else {
        response.body = new resource(body);
      }
    }
  }
}
