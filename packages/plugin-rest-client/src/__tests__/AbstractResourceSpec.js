import AbstractEntity from '../AbstractEntity';
import AbstractResource from '../AbstractResource';
import AbstractRestClient from '../AbstractRestClient';

describe('AbstractResource', () => {
  class Entity extends AbstractEntity {
    static get resourceName() {
      return 'foo';
    }

    static get idFieldName() {
      return 'id';
    }

    static get inlineResponseBody() {
      return true;
    }
  }

  class Resource extends AbstractResource {
    static get entityClass() {
      return Entity;
    }
  }

  class RestClient extends AbstractRestClient {
    // eslint-disable-next-line no-unused-vars
    list(resource, parameters = {}) {
      return Promise.resolve();
    }

    // eslint-disable-next-line no-unused-vars
    get(resource, id, parameters = {}) {
      return Promise.resolve();
    }

    // eslint-disable-next-line no-unused-vars
    create(resource, data, parameters = {}) {
      return Promise.resolve();
    }

    // eslint-disable-next-line no-unused-vars
    delete(resource, id, parameters = {}) {
      return Promise.resolve();
    }

    // eslint-disable-next-line no-unused-vars
    patch(resource, id, data, parameters = {}) {
      return Promise.resolve();
    }

    // eslint-disable-next-line no-unused-vars
    replace(resource, id, data, parameters = {}) {
      return Promise.resolve();
    }
  }

  let resource = null;
  let restClient = null;
  let parametersToPass = { key: 'value' };

  beforeEach(() => {
    restClient = new RestClient(null, null, null, [], []);
    resource = new Resource(restClient);
  });

  describe('list', () => {
    it('should call restClient.list method', async () => {
      jest.spyOn(restClient, 'list');

      await resource.list(parametersToPass, {}, null);

      expect(restClient.list).toHaveBeenCalledWith(
        resource.constructor.entityClass,
        parametersToPass,
        {},
        null
      );
    });
  });

  describe('get', () => {
    it('should call restClient.get method', async () => {
      jest.spyOn(restClient, 'get');
      const id = 24;

      await resource.get(id, parametersToPass, {}, null);

      expect(restClient.get).toHaveBeenCalledWith(
        resource.constructor.entityClass,
        id,
        parametersToPass,
        {},
        null
      );
    });
  });

  describe('create', () => {
    it('should call restClient.create method with data', async () => {
      jest.spyOn(restClient, 'create');
      const data = {
        id: 1,
        foo: 'bar',
      };

      await resource.create(data, parametersToPass, {}, null);

      expect(restClient.create).toHaveBeenCalledWith(
        resource.constructor.entityClass,
        data,
        parametersToPass,
        {},
        null
      );
    });
  });

  describe('delete', () => {
    it('should call restClient.delete method', async () => {
      jest.spyOn(restClient, 'delete');
      const id = 24;

      await resource.delete(id, parametersToPass, {}, null);

      expect(restClient.delete).toHaveBeenCalledWith(
        resource.constructor.entityClass,
        id,
        parametersToPass,
        {},
        null
      );
    });
  });

  describe('patch', () => {
    it("should call restClient.patch method with entity's serialized data", async () => {
      jest.spyOn(restClient, 'patch');

      const data = { id: 1, foo: 'bar' };
      let newEntity = new Entity(data);
      let serializedData = newEntity.$serialize(data);

      await resource.patch(newEntity, data, parametersToPass, {});

      expect(restClient.patch).toHaveBeenCalledWith(
        newEntity.constructor,
        newEntity[Entity.idFieldName],
        serializedData,
        parametersToPass,
        {}
      );
    });
  });

  describe('static properties', () => {
    it(
      'should have all its private symbol properties marked as ' +
        'non-enumerable',
      () => {
        for (let symbol of Object.getOwnPropertySymbols(resource)) {
          let descriptor = Object.getOwnPropertyDescriptor(resource, symbol);
          expect(descriptor.enumerable).toBe(false);
        }
      }
    );
  });
});
