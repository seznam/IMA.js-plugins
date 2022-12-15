import AbstractEntity from '../../AbstractEntity';
import idFieldName from '../idFieldName';

describe('idFieldName', () => {
  it('should configure the idFieldName property', () => {
    class Entity extends AbstractEntity {}

    idFieldName('id')(Entity);
    expect(Entity.idFieldName).toBe('id');
  });
});
