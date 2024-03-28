/**
 * Mapper is used to deserialize single value from an API to an entity value
 * and to serialize property from an entity to a plain value.
 */
export interface Mapper {
  deserialize: (value: any) => any;
  serialize: (value: any) => any;
}

/**
 * MapperItem concatenates a mapper and an value key eg. for rename.
 */
export type MapperItem = {
  mapper: Mapper;
  newKey: string;
};

/**
 * DataFieldValue can be specified as a Mapper or just the name of the new field (rename) or in the complete structure like MapperItem.
 */
export type DataFieldValue = MapperItem | Mapper | string;

/**
 * BaseMapper implements Mapper interface
 * and is used as default Mapper for MapperItem in entity dataFieldMapping getter.
 */
export class BaseMapper implements Mapper {
  /**
   * Static method createMapperItem converts the disparate definitions in DataFieldValue into a general MapperItem structure.
   *
   * @param value
   * @param key
   */
  static createMapperItem(value: DataFieldValue, key: string) {
    let mapperItem: MapperItem = { mapper: new BaseMapper(), newKey: key };

    if (typeof value === 'string') {
      mapperItem = { mapper: new BaseMapper(), newKey: value };
    } else if (value instanceof BaseMapper) {
      mapperItem = { mapper: value, newKey: key };
    } else if ('mapper' in value && 'newKey' in value) {
      mapperItem = value;
    }

    return mapperItem;
  }

  /**
   * Deserialize method is used to convert plain value from API to entity property.
   *
   * @param value
   */
  deserialize(value: any): any {
    return value;
  }

  /**
   * Serialize method is used to convert entity property to plain value.
   *
   * @param value
   */
  serialize(value: any): any {
    return value;
  }
}
