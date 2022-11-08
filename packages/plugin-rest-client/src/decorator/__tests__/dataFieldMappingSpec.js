import AbstractEntity from '../../AbstractEntity';
import dataFieldMapping from '../dataFieldMapping';

describe('dataFieldMapping', () => {
  it('should configure the dataFieldMapping property', () => {
    class Entity extends AbstractEntity {}

    dataFieldMapping({ id: '_id' })(Entity);
    expect(Entity.dataFieldMapping).toEqual({ id: '_id' });
  });
});
