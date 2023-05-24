import { GenericError, Dependencies } from '@ima/core';

declare module '@ima/core' {
  interface OCAliasMap {
    '$Settings.plugin.httpClient.rest': any;
  }
}

import { EntityConstructor } from './BaseEntity';
import {
  HttpClient,
  HttpClientRequestMethod,
  HttpClientRequestOptions,
} from '../HttpClient';

export abstract class AbstractResource {
  #httpClient: HttpClient;
  #baseApiUrl: string;

  static get $dependencies(): Dependencies {
    return [HttpClient, '$Settings.plugin.httpClient.rest'];
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

  get path(): { [pathType: string]: string } {
    throw new GenericError(
      `AbstractResource: Static getter "path" must be overriden.`
    );
  }

  get entityClass(): EntityConstructor | null {
    return null;
  }

  constructor(httpClient: HttpClient, settings: any) {
    this.#httpClient = httpClient;

    if (!settings.baseApiUrl) {
      throw new GenericError(`REST_CLIENT_BASE_API_URL is not set.`);
    }
    this.#baseApiUrl = settings.baseApiUrl;
  }

  update<B = any>(
    data: object,
    options: HttpClientRequestOptions,
    pathType = (this.constructor as typeof AbstractResource).PathType.UPDATE
  ) {
    return this.#restClientRequest<B>('patch', pathType, data, options);
  }

  create<B = any>(
    data: object,
    options: HttpClientRequestOptions,
    pathType = (this.constructor as typeof AbstractResource).PathType.CREATE
  ) {
    return this.#restClientRequest<B>('post', pathType, data, options);
  }

  delete<B = any>(
    data: object,
    options: HttpClientRequestOptions,
    pathType = (this.constructor as typeof AbstractResource).PathType.DELETE
  ) {
    return this.#restClientRequest<B>('delete', pathType, data, options);
  }

  get<B = any>(
    data: object,
    options: HttpClientRequestOptions,
    pathType = (this.constructor as typeof AbstractResource).PathType.GET
  ) {
    return this.#restClientRequest<B>('get', pathType, data, options);
  }

  replace<B = any>(
    data: object,
    options: HttpClientRequestOptions,
    pathType = (this.constructor as typeof AbstractResource).PathType.REPLACE
  ) {
    return this.#restClientRequest<B>('put', pathType, data, options);
  }

  #getPathTemplate(pathType: string): string {
    const pathTemplate = this.path[pathType];

    if (!pathTemplate) {
      throw new GenericError(
        `AbstractResource: getter "path" does not contain ${pathType} in ${this.constructor.name}`
      );
    }

    return pathTemplate;
  }

  getUrl(pathType: string, data: object) {
    const pathTemplate = this.#getPathTemplate(pathType);

    const path = this.#processPathTemplate(pathTemplate, data);

    return this.#baseApiUrl + path;
  }

  prepareData(data: object) {
    return { ...data };
  }

  prepareOptions(options: HttpClientRequestOptions) {
    return { ...options };
  }

  #processPathTemplate(pathTemplate: string, data: { [key: string]: any }) {
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

  async #restClientRequest<B>(
    method: HttpClientRequestMethod,
    pathType: string,
    data: object,
    options: HttpClientRequestOptions
  ) {
    const url = this.getUrl(pathType, data);

    const { response } = await this.#httpClient.request<B>(
      {
        method,
        url,
        data: this.prepareData(data),
        options: this.prepareOptions(options),
      },
      this.getResourceInfo(pathType)
    );

    return response;
  }

  getResourceInfo(pathType: string): object {
    return { resource: this, pathType };
  }
}
