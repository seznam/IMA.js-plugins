export default class AbstractService {
  constructor(resource) {
    this._resource = resource;
  }

  async list(data, options) {
    const { body } = await this._resource.list(data, options);

    return body;
  }

  async get(data, options) {
    const { body } = await this._resource.get(data, options);

    return body;
  }

  create(data, options) {
    return this._resource.create(data, options);
  }

  update(data, options) {
    return this._resource.update(data, options);
  }

  delete(data, options) {
    return this._resource.delete(data, options);
  }
}
