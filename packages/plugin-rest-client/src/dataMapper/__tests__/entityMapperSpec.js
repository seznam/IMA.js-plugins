import AbstractEntity from '../../AbstractEntity';
import { entityMapper, entityListMapper } from '../entityMapper';

describe('entityMapper', () => {
  it('should not rename the data field', () => {
    expect(entityMapper(AbstractEntity).dataFieldName).toBeNull();
  });

  it('should not alter string value during deserialization (not embeded)', () => {
    const mongoId = 'nflknfeflweknf';

    expect(entityMapper(AbstractEntity).deserialize(mongoId)).toBe(mongoId);
  });

  it('should not alter entity during deserialization (already deserialized)', () => {
    const entity = new AbstractEntity({});

    expect(entityMapper(AbstractEntity).deserialize(entity)).toBe(entity);
  });

  it('should deserialize value to an entity', () => {
    const data = {
      testField: 'test value',
    };
    const entity = entityMapper(AbstractEntity).deserialize(data);

    expect(entity instanceof AbstractEntity).toBe(true);
    expect(entity.testField).toBe(data.testField);
  });

  it('should use $serialize method for serialization', () => {
    const sourceData = {
      testField: 'test value',
    };
    const entity = new AbstractEntity(sourceData);
    jest.spyOn(entity, '$serialize');
    entityMapper(AbstractEntity).serialize(entity);

    expect(entity.$serialize).toHaveBeenCalled();
  });
});

describe('entityListMapper', () => {
  it('should not rename the data field', () => {
    expect(entityListMapper(AbstractEntity).dataFieldName).toBeNull();
  });

  it('should deserialize empty array to empty array', () => {
    const data = [];
    const entities = entityListMapper(AbstractEntity).deserialize(data);

    expect(Array.isArray(entities)).toBe(true);
    expect(entities).toHaveLength(0);
  });

  it('should deserialize non empty array to array with entities', () => {
    const data = [
      { testField1: 'test value 1' },
      { testField2: 'test value 2' },
    ];
    const entities = entityListMapper(AbstractEntity).deserialize(data);

    expect(Array.isArray(entities)).toBe(true);
    expect(entities).toHaveLength(2);
    expect(entities[0] instanceof AbstractEntity).toBe(true);
    expect(entities[0]).toEqual(data[0]);
    expect(entities[1] instanceof AbstractEntity).toBe(true);
    expect(entities[1]).toEqual(data[1]);
  });

  it('should not affect the serialized value', () => {
    const sourceData = [
      { testField1: 'test value 1' },
      { testField2: 'test value 2' },
    ];
    const entities = [
      new AbstractEntity(sourceData[0]),
      new AbstractEntity(sourceData[1]),
    ];
    jest.spyOn(entities[0], '$serialize');
    jest.spyOn(entities[1], '$serialize');

    const serializedData = entityListMapper(AbstractEntity).serialize(entities);

    expect(entities[0].$serialize).toHaveBeenCalled();
    expect(entities[1].$serialize).toHaveBeenCalled();
    expect(Array.isArray(serializedData)).toBe(true);
  });
});
