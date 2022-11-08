import AbstractEntity from '../../AbstractEntity';
import resourceName from '../resourceName';

describe('resourceName', () => {
  it('should configure the resourceName property', () => {
    class Entity extends AbstractEntity {}

    resourceName('fooBar')(Entity);
    expect(Entity.resourceName).toBe('fooBar');
  });
});
