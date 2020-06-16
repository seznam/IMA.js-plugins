import AbstractResource from '../AbstractResource';
import AbstractEntity from '../AbstractEntity';
import AbstractRestClient from '../AbstractRestClient';
import { testStaticProperty } from './RestClientTestUtils';

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
    it('should call restClient.list method', (done) => {
      spyOn(restClient, 'list').and.callThrough();

      resource
        .list(parametersToPass, {}, null)
        .then(() => {
          expect(restClient.list).toHaveBeenCalledWith(
            resource.constructor.entityClass,
            parametersToPass,
            {},
            null
          );
          done();
        })
        .catch((error) => {
          fail(error.stack);
          done();
        });
    });
  });

  describe('get', () => {
    it('should call restClient.get method', (done) => {
      spyOn(restClient, 'get').and.callThrough();
      const id = 24;

      resource
        .get(id, parametersToPass, {}, null)
        .then(() => {
          expect(restClient.get).toHaveBeenCalledWith(
            resource.constructor.entityClass,
            id,
            parametersToPass,
            {},
            null
          );
          done();
        })
        .catch((error) => {
          fail(error.stack);
          done();
        });
    });
  });

  describe('create', () => {
    it('should call restClient.create method with data', (done) => {
      spyOn(restClient, 'create').and.callThrough();
      const data = {
        id: 1,
        foo: 'bar'
      };

      resource
        .create(data, parametersToPass, {}, null)
        .then(() => {
          expect(restClient.create).toHaveBeenCalledWith(
            resource.constructor.entityClass,
            data,
            parametersToPass,
            {},
            null
          );
          done();
        })
        .catch((error) => {
          fail(error.stack);
          done();
        });
    });
  });

  describe('delete', () => {
    it('should call restClient.delete method', (done) => {
      spyOn(restClient, 'delete').and.callThrough();
      const id = 24;

      resource
        .delete(id, parametersToPass, {}, null)
        .then(() => {
          expect(restClient.delete).toHaveBeenCalledWith(
            resource.constructor.entityClass,
            id,
            parametersToPass,
            {},
            null
          );
          done();
        })
        .catch((error) => {
          fail(error.stack);
          done();
        });
    });
  });

  describe('patch', () => {
    it("should call restClient.patch method with entity's serialized data", (done) => {
      spyOn(restClient, 'patch').and.callThrough();

      const data = { id: 1, foo: 'bar' };
      let newEntity = new Entity(data);
      let serializedData = newEntity.$serialize(data);

      resource
        .patch(newEntity, data, parametersToPass, {})
        .then(() => {
          expect(restClient.patch).toHaveBeenCalledWith(
            newEntity.constructor,
            newEntity[Entity.idFieldName],
            serializedData,
            parametersToPass,
            {}
          );
          done();
        })
        .catch((error) => {
          fail(error.stack);
          done();
        });
    });
  });

  describe('static properties', () => {
    it('should be possible to configure entityClass only once', () => {
      testStaticProperty(AbstractResource, 'entityClass', null, true, Entity);
    });

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
