import { GenericError, Dependencies } from '@ima/core';

export type RestResourceSettings = {
  baseApiUrl: string | null;
};

declare module '@ima/core' {
  interface OCAliasMap {
    '$Settings.plugin.httpClient.rest'?: RestResourceSettings;
  }
}

import { EntityConstructor } from './BaseEntity';
import {
  HttpClient,
  HttpClientRequestMethod,
  HttpClientRequestOptions,
} from '../HttpClient';

/**
 * AbstractResource will help with creating paths to the API as well as working with entities.
 */
export abstract class AbstractResource {
  #httpClient: HttpClient;
  #baseApiUrl: string;

  static get $dependencies(): Dependencies {
    return [HttpClient, '$Settings.plugin.httpClient.rest'];
  }

  /**
   * PathType is set of constant for use in getter path
   * @class
   */
  static get PathType() {
    return {
      GET: 'get',
      CREATE: 'create',
      UPDATE: 'update',
      REPLACE: 'replace',
      DELETE: 'delete',
    };
  }

  /**
   * This getter should return paths to API for concrete PathType
   */
  get path(): { [pathType: string]: string } {
    throw new GenericError(
      `AbstractResource: getter "path" must be overriden.`
    );
  }

  /**
   * Optionally getter for EntityProcessor
   */
  get entityClass(): EntityConstructor | null {
    return null;
  }

  constructor(httpClient: HttpClient, settings?: RestResourceSettings) {
    this.#httpClient = httpClient;

    if (!settings?.baseApiUrl) {
      throw new GenericError(
        `$Settings.plugin.httpClient.rest.baseApiUrl is not set.`
      );
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

  /**
   * Method invalidate cache for given params
   * @param method
   * @param data
   * @param pathType
   */
  invalidateCache(method: string, data: object, pathType: string) {
    const url = this.getUrl(pathType, data);

    this.#httpClient.invalidateCache(method, url, this.prepareData(data));
  }

  /**
   * Return pathTemplate by pathType
   *
   * @param pathType
   * @private
   */
  #getPathTemplate(pathType: string): string {
    const pathTemplate = this.path[pathType];

    if (!pathTemplate) {
      throw new GenericError(
        `AbstractResource: getter "path" does not contain '${pathType}' pathType in ${this.constructor.name}`
      );
    }

    return pathTemplate;
  }

  /**
   * Create URL to API by baseApiUrl settings and processed path
   *
   * @param pathType
   * @param data
   */
  getUrl(pathType: string, data: object) {
    const pathTemplate = this.#getPathTemplate(pathType);

    const path = this.#processPathTemplate(pathTemplate, data);

    return this.#baseApiUrl + path;
  }

  /**
   * Prepare data for request
   * @param data
   */
  prepareData(data: object) {
    return { ...data };
  }

  /**
   * Prepare options for request
   * @param options
   */
  prepareOptions(options: HttpClientRequestOptions) {
    return { ...options };
  }

  /**
   * Process path - replace variables by values from data.
   *
   * @param pathTemplate
   * @param data
   * @private
   */
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

  /**
   * Returns additionalParams for processors
   * @param pathType
   */
  getResourceInfo(pathType: string): object {
    return { resource: this, pathType };
  }
}
