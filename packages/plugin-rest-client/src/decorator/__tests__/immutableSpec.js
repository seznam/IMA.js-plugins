import AbstractEntity from '../../AbstractEntity';
import immutable from '../immutable';

describe('immutable', () => {
  it('should configure the isImmutable property', () => {
    class Entity extends AbstractEntity {}

    immutable(Entity);
    expect(Entity.isImmutable).toBe(true);
  });
});
