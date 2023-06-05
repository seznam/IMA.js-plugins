import { BaseEntity } from '../../BaseEntity';
import { EntityListMapper } from '../EntityListMapper';

describe('EntityListMapper', () => {
  it('should deserialize empty array to empty array', () => {
    const data = [];
    const entities = new EntityListMapper(BaseEntity).deserialize(data);

    expect(Array.isArray(entities)).toBe(true);
    expect(entities).toHaveLength(0);
  });

  it('should deserialize non empty array to array with entities', () => {
    const data = [
      { testField1: 'test value 1' },
      { testField2: 'test value 2' },
    ];
    const entities = new EntityListMapper(BaseEntity).deserialize(data);

    expect(Array.isArray(entities)).toBe(true);
    expect(entities).toHaveLength(2);
    expect(entities[0] instanceof BaseEntity).toBe(true);
    expect(entities[0]).toEqual(data[0]);
    expect(entities[1] instanceof BaseEntity).toBe(true);
    expect(entities[1]).toEqual(data[1]);
  });

  it('should not affect the serialized value', () => {
    const sourceData = [
      { testField1: 'test value 1' },
      { testField2: 'test value 2' },
    ];
    const entities = [
      new BaseEntity(sourceData[0]),
      new BaseEntity(sourceData[1]),
    ];
    jest.spyOn(entities[0], 'serialize');
    jest.spyOn(entities[1], 'serialize');

    const serializedData = new EntityListMapper(BaseEntity).serialize(entities);

    expect(entities[0].serialize).toHaveBeenCalled();
    expect(entities[1].serialize).toHaveBeenCalled();
    expect(Array.isArray(serializedData)).toBe(true);
  });
});
