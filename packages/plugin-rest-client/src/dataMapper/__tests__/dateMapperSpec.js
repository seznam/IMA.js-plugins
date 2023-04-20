import { dateMapper, dateMapperNullable } from '../dateMapper';

describe('dateMapper', () => {
  it('should not rename the data field', () => {
    expect(dateMapper.dataFieldName).toBeNull();
  });

  it('should parse the YYYY-MM-DD HH:MM:SS format', () => {
    let dateString = '2016-11-01 09:23:02';
    let date = new Date(2016, 10, 1, 9, 23, 2, 0);
    expect(dateMapper.deserialize(dateString)).toEqual(date);
  });

  it('should return default actual Date value during deserialization if given string is not defined', () => {
    expect(dateMapper.deserialize(null)).toEqual(expect.any(Date));
    expect(dateMapper.deserialize(undefined)).toEqual(expect.any(Date));
    expect(dateMapper.deserialize('')).toEqual(expect.any(Date));
  });

  it('should serialize the date to the YYYY-MM-DD HH:MM:SS format', () => {
    let dateString = '2016-11-01 09:23:02';
    let date = new Date(2016, 10, 1, 9, 23, 2, 0);
    expect(dateMapper.serialize(date)).toBe(dateString);
  });

  it('should ignore empty values during serialization', () => {
    expect(dateMapper.serialize(null)).toBeNull();
    expect(dateMapper.serialize(undefined)).toBeUndefined();
    expect(dateMapper.serialize('')).toBe('');
  });
});

describe('dateMapperNullable', () => {
  it('should return original value if the given string is not defined', () => {
    expect(dateMapperNullable.deserialize(null)).toBeNull();
    expect(dateMapperNullable.deserialize(undefined)).toBeUndefined();
    expect(dateMapperNullable.deserialize('')).toBe('');
  });
});
