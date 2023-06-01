import { HttpClient } from '../../HttpClient';
import { AbstractResource } from '../AbstractResource';
import { BaseEntity } from '../BaseEntity';

describe('AbstractResource', () => {
  class Resource extends AbstractResource {
    get entityClass() {
      return BaseEntity;
    }

    get path() {
      return {
        [this.constructor.PathType.REPLACE]: `/authors/{$id}`,
        [this.constructor.PathType.GET]: `/authorsGet/{$id}`,
        [this.constructor.PathType.UPDATE]: `/authors/{$id}`,
        [this.constructor.PathType.CREATE]: `/authors/{$id}`,
        [this.constructor.PathType.DELETE]: `/authors/{$id}`,
      };
    }
  }

  let resource = null;
  let httpClient = null;
  let data = { key: 'value' };
  let options = {};

  beforeEach(() => {
    httpClient = new HttpClient();
    resource = new Resource(httpClient, { baseApiUrl: 'url' });
  });

  it('should throw error with missing baseApiUrl', () => {
    try {
      new Resource(HttpClient, {});
      // Fail test if above expression doesn't throw anything.
      expect(true).toBe(false);
    } catch (e) {
      expect(e.message).toBe('REST_CLIENT_BASE_API_URL is not set.');
    }
  });

  it('should throw error with missing getter "path"', async () => {
    try {
      await new AbstractResource(httpClient, { baseApiUrl: 'url' }).update();
      // Fail test if above expression doesn't throw anything.
      expect(true).toBe(false);
    } catch (e) {
      expect(e.message).toBe(
        'AbstractResource: getter "path" must be overriden.'
      );
    }
  });

  describe('getResourceInfo', () => {
    it('should return additionalParams for Processor', async () => {
      expect(
        resource.getResourceInfo(AbstractResource.PathType.REPLACE)
      ).toStrictEqual({
        pathType: AbstractResource.PathType.REPLACE,
        resource,
      });
    });
  });

  describe('getUrl', () => {
    it('should return complete API URL', async () => {
      expect(
        resource.getUrl(AbstractResource.PathType.REPLACE, { $id: 564 })
      ).toBe('url/authors/564');
    });
  });

  describe('update', () => {
    it('should throw error with not defined path in getter "path"', async () => {
      try {
        await resource.update(data, options, 'not_set');
        // Fail test if above expression doesn't throw anything.
        expect(true).toBe(false);
      } catch (e) {
        expect(e.message).toBe(
          'AbstractResource: getter "path" does not contain \'not_set\' pathType in Resource'
        );
      }
    });

    it('should throw error with not defined value for replace variable in path', async () => {
      try {
        await resource.update(data, options);
        // Fail test if above expression doesn't throw anything.
        expect(true).toBe(false);
      } catch (e) {
        expect(e.message).toBe(
          'AbstractResource: No attribute of key {$id} found in data in Resource.'
        );
      }
    });

    it('should call httpClient.request method', async () => {
      jest
        .spyOn(httpClient, 'request')
        .mockReturnValue(Promise.resolve({ response: {} }));
      let data = { key: 'value' };

      await resource.update({ ...data, $id: 5 }, options);

      expect(httpClient.request).toHaveBeenCalledWith(
        { data, method: 'patch', url: 'url/authors/5', options },
        { pathType: AbstractResource.PathType.UPDATE, resource }
      );
    });
  });

  describe('get', () => {
    it('should call httpClient.request method', async () => {
      jest
        .spyOn(httpClient, 'request')
        .mockReturnValue(Promise.resolve({ response: {} }));
      let data = { key: 'value' };

      await resource.get({ ...data, $id: 5 }, options);

      expect(httpClient.request).toHaveBeenCalledWith(
        { data, method: 'get', url: 'url/authorsGet/5', options },
        { pathType: AbstractResource.PathType.GET, resource }
      );
    });
  });

  describe('create', () => {
    it('should call httpClient.request method', async () => {
      jest
        .spyOn(httpClient, 'request')
        .mockReturnValue(Promise.resolve({ response: {} }));
      let data = { key: 'value' };

      await resource.create({ ...data, $id: 5 }, options);

      expect(httpClient.request).toHaveBeenCalledWith(
        { data, method: 'post', url: 'url/authors/5', options },
        { pathType: AbstractResource.PathType.CREATE, resource }
      );
    });
  });

  describe('delete', () => {
    it('should call httpClient.request method', async () => {
      jest
        .spyOn(httpClient, 'request')
        .mockReturnValue(Promise.resolve({ response: {} }));
      let data = { key: 'value' };

      await resource.delete({ ...data, $id: 5 }, options);

      expect(httpClient.request).toHaveBeenCalledWith(
        { data, method: 'delete', url: 'url/authors/5', options },
        { pathType: AbstractResource.PathType.DELETE, resource }
      );
    });
  });

  describe('patch', () => {
    it('should call httpClient.request method', async () => {
      jest
        .spyOn(httpClient, 'request')
        .mockReturnValue(Promise.resolve({ response: {} }));
      let data = { key: 'value' };

      await resource.replace({ ...data, $id: 5 }, options);

      expect(httpClient.request).toHaveBeenCalledWith(
        { data, method: 'put', url: 'url/authors/5', options },
        { pathType: AbstractResource.PathType.REPLACE, resource }
      );
    });
  });
});
