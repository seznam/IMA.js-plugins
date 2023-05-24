export interface Mapper {
  deserialize(value: any): any;
  serialize(value: any): any;
}

export type MapperItem = {
  mapper: Mapper;
  newKey: string;
};

export type DataFieldValue = MapperItem | Mapper | string;

export class BaseMapper implements Mapper {
  static createMapperItem(value: DataFieldValue, newKey: string) {
    let mapperItem: MapperItem = { mapper: new BaseMapper(), newKey };

    if (typeof value === 'string') {
      mapperItem = { mapper: new BaseMapper(), newKey: value };
    } else if (value instanceof BaseMapper) {
      mapperItem = { mapper: value, newKey };
    } else if ('mapper' in value && 'newKey' in value) {
      mapperItem = value;
    }

    return mapperItem;
  }

  deserialize(value: any): any {
    return value;
  }

  serialize(value: any): any {
    return value;
  }
}
