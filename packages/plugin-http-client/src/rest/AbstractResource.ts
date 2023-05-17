import { GenericError, Dependencies } from '@ima/core';

declare module '@ima/core' {
  interface OCAliasMap {
    REST_CLIENT_BASE_API_URL: string;
  }
}

import {
  HttpClient,
  HttpClientRequestMethod,
  HttpClientRequestOptions,
  ResourceInfo,
} from '../HttpClient';

export class AbstractResource {
  #httpClient: HttpClient;
  #baseApiUrl: string;

  static get $dependencies(): Dependencies {
    return [HttpClient, '?REST_CLIENT_BASE_API_URL'];
  }

  static get PathType() {
    return {
      GET: 'get',
      CREATE: 'create',
      UPDATE: 'update',
      REPLACE: 'replace',
      DELETE: 'delete',
    };
  }

  static get path(): { [pathType: string]: string } {
    throw new GenericError(
      `AbstractResource: Static getter "path" must be overriden.`
    );
  }

  static get entityClass() {
    return null;
  }

  constructor(httpClient: HttpClient, baseApiUrl: string) {
    this.#httpClient = httpClient;

    if (!baseApiUrl) {
      throw new GenericError(`REST_CLIENT_BASE_API_URL is not set.`);
    }
    this.#baseApiUrl = baseApiUrl;
  }

  update(
    data: object,
    options: HttpClientRequestOptions,
    pathType = (this.constructor as typeof AbstractResource).PathType.UPDATE
  ) {
    return this._restClientRequest('patch', pathType, data, options);
  }

  create(
    data: object,
    options: HttpClientRequestOptions,
    pathType = (this.constructor as typeof AbstractResource).PathType.CREATE
  ) {
    return this._restClientRequest('post', pathType, data, options);
  }

  delete(
    data: object,
    options: HttpClientRequestOptions,
    pathType = (this.constructor as typeof AbstractResource).PathType.DELETE
  ) {
    return this._restClientRequest('delete', pathType, data, options);
  }

  get(
    data: object,
    options: HttpClientRequestOptions,
    pathType = (this.constructor as typeof AbstractResource).PathType.GET
  ) {
    return this._restClientRequest('get', pathType, data, options);
  }

  replace(
    data: object,
    options: HttpClientRequestOptions,
    pathType = (this.constructor as typeof AbstractResource).PathType.REPLACE
  ) {
    return this._restClientRequest('put', pathType, data, options);
  }

  _getPathTemplate(pathType: string): string {
    const pathTemplate = (this.constructor as typeof AbstractResource).path[
      pathType
    ];

    if (!pathTemplate) {
      throw new GenericError(
        `AbstractResource: getter "path" does not contain ${pathType} in ${this.constructor.name}`
      );
    }

    return pathTemplate;
  }

  _getUrl(pathType: string, data: object) {
    const pathTemplate = this._getPathTemplate(pathType);

    const path = this._processPathTemplate(pathTemplate, data);

    return this.#baseApiUrl + path;
  }

  _prepareData(data: object) {
    return { ...data };
  }

  _prepareOptions(options: HttpClientRequestOptions) {
    return { ...options };
  }

  _processPathTemplate(pathTemplate: string, data: { [key: string]: any }) {
    let path = pathTemplate;

    const regexFindVariables = new RegExp('{(.*?)}', 'g');

    const keys = [];
    let matches;

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

  async _restClientRequest(
    method: HttpClientRequestMethod,
    pathType: string,
    data: object,
    options: HttpClientRequestOptions
  ) {
    const url = this._getUrl(pathType, data);

    const { response } = await this.#httpClient.request(
      this._getResourceInfo(pathType),
      {
        method,
        url,
        data: this._prepareData(data),
        options: this._prepareOptions(options),
      }
    );

    return response;
  }

  _getResourceInfo(pathType: string): ResourceInfo {
    return { resource: this, pathType };
  }
}
