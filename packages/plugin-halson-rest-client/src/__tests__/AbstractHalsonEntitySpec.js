import AbstractHalsonEntity from '../AbstractHalsonEntity';

describe('AbstractHalsonEntity', () => {
  class Entity extends AbstractHalsonEntity {}

  it('should declare the _links property if it does not exist', () => {
    const entity = new Entity({});

    expect(Object.hasOwnProperty.call(entity, '_links')).toBeTruthy();
  });

  it('should make the _links property non-enumarable', () => {
    const entity = new Entity({
      _links: { foo: 'bar' }
    });

    expect(entity._links.foo).toBe('bar');
    let descriptor = Object.getOwnPropertyDescriptor(entity, '_links');
    expect(descriptor.enumerable).toBeFalsy();
  });
});
