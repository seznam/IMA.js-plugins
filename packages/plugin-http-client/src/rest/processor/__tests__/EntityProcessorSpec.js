import { BaseEntity } from '../../BaseEntity';
import { EntityProcessor } from '../EntityProcessor';

describe('EntityProcessor', () => {
  it('should not transform response body for empty response', () => {
    const params = {};

    expect(new EntityProcessor().postRequest(params)).toBe(params);
  });

  it('should not transform response body for empty resource entityClass', () => {
    const params = { response: { body: { name: 'John' } } };

    expect(new EntityProcessor().postRequest(params)).toBe(params);
  });

  it('should transform response body to entityClass', () => {
    const params = {
      response: { body: { name: 'John' } },
      additionalParams: { resource: { entityClass: BaseEntity } },
    };

    expect(
      new EntityProcessor().postRequest(params).response.body instanceof
        BaseEntity
    ).toBe(true);
  });

  it('should transform response body to array of entityClass for array body', () => {
    const params = {
      response: { body: [{ name: 'John' }, { name: 'Peter' }] },
      additionalParams: { resource: { entityClass: BaseEntity } },
    };

    expect(
      new EntityProcessor().postRequest(params).response.body instanceof Array
    ).toBe(true);

    expect(
      new EntityProcessor().postRequest(params).response.body[0] instanceof
        BaseEntity
    ).toBe(true);
    expect(
      new EntityProcessor().postRequest(params).response.body[1] instanceof
        BaseEntity
    ).toBe(true);
  });
});
