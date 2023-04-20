import defaultToArray from '../defaultToArray';

describe('defaultToArray', () => {
  it('should not rename the data field', () => {
    expect(defaultToArray.dataFieldName).toBeNull();
  });

  it('should not alter array during deserialization', () => {
    let array = [1, 2, 3, {}];
    array.push(array);
    expect(defaultToArray.deserialize(array)).toBe(array);
  });

  it('should deserialize an empty value to an empty array', () => {
    expect(defaultToArray.deserialize('')).toEqual([]);
    expect(defaultToArray.deserialize(0)).toEqual([]);
    expect(defaultToArray.deserialize(false)).toEqual([]);
    expect(defaultToArray.deserialize(null)).toEqual([]);
    expect(defaultToArray.deserialize(undefined)).toEqual([]);
  });

  it('should not affect the serialized value', () => {
    expect(defaultToArray.serialize(null)).toBeNull();
    expect(defaultToArray.serialize(0)).toBe(0);
    expect(defaultToArray.serialize([1, 2, 3])).toEqual([1, 2, 3]);
  });
});
