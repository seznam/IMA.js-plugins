import { BaseMapper } from '../BaseMapper';

describe('BaseMapper createMapperItem', () => {
  it('should return MapperItem for MapperItem as value', () => {
    const key = 'fieldKey';
    const value = { mapper: new BaseMapper(), newKey: 'newKey' };

    expect(BaseMapper.createMapperItem(value, key)).toBe(value);
  });

  it('should return MapperItem for string as value', () => {
    const key = 'new_author';
    const value = 'author';

    expect(BaseMapper.createMapperItem(value, key)).toStrictEqual({
      mapper: new BaseMapper(),
      newKey: value,
    });
  });

  it('should return MapperItem for Mapper as value', () => {
    const key = 'article';
    const value = new BaseMapper();

    expect(BaseMapper.createMapperItem(value, key)).toStrictEqual({
      mapper: value,
      newKey: key,
    });
  });
});
