import { BaseEntity } from '../../BaseEntity';
import { EntityMapper } from '../EntityMapper';

describe('EntityMapper', () => {
  it('should not alter string value during deserialization', () => {
    const mongoId = 'nflknfeflweknf';

    expect(new EntityMapper(BaseEntity).deserialize(mongoId)).toBe(mongoId);
  });

  it('should not alter entity during deserialization (already deserialized)', () => {
    const entity = new BaseEntity({});

    expect(new EntityMapper(BaseEntity).deserialize(entity)).toBe(entity);
  });

  it('should deserialize value to an entity', () => {
    const data = {
      testField: 'test value',
    };
    const entity = new EntityMapper(BaseEntity).deserialize(data);

    expect(entity instanceof BaseEntity).toBe(true);
    expect(entity.testField).toBe(data.testField);
  });

  it('should use serialize method of entity for serialization', () => {
    const sourceData = {
      testField: 'test value',
    };
    const entity = new BaseEntity(sourceData);
    jest.spyOn(entity, 'serialize');
    new EntityMapper(BaseEntity).serialize(entity);

    expect(entity.serialize).toHaveBeenCalled();
  });
});
