import { DefaultToArray } from '../DefaultToArray';

describe('DefaultToArray', () => {
  it('should not alter array during deserialization', () => {
    const array = [1, 2, 3, {}];
    array.push(array);

    expect(new DefaultToArray().deserialize(array)).toBe(array);
  });

  it('should deserialize an empty value to an empty array', () => {
    expect(new DefaultToArray().deserialize('')).toEqual([]);
    expect(new DefaultToArray().deserialize(0)).toEqual([]);
    expect(new DefaultToArray().deserialize(false)).toEqual([]);
    expect(new DefaultToArray().deserialize(null)).toEqual([]);
    expect(new DefaultToArray().deserialize()).toEqual([]);
  });

  it('should not affect the serialized value', () => {
    expect(new DefaultToArray().serialize(null)).toBeNull();
    expect(new DefaultToArray().serialize(0)).toBe(0);
    expect(new DefaultToArray().serialize([1, 2, 3])).toEqual([1, 2, 3]);
  });
});
